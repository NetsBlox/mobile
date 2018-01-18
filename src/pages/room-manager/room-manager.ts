import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import common from '../../common';
import { LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-room-manager',
  templateUrl: 'room-manager.html',
})
export class RoomManagerPage {
  roles: any;
  friends: any;
  cache: any = {friends: []};
  invitingTo: string; // if set, shows the friendlist and invites to the specified role
  loader: any; // keeps a handle to the room loading popup

  constructor(public loadingCtrl: LoadingController, public toastCtrl: ToastController, private alertCtrl: AlertController, public platform: Platform, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams) {
    this.roles = [{name: 'loading', occupants: []}];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomManagerPage');
    this.updateRoles();
    this.updateFriendList();
    // keep room page up to date, TODO while the page is in view
    let roomManager = this;
    common.snapFrame.addEventListener('projectLoaded', () => {
      this.onProjectLoaded.call(roomManager);
      this.loader.dismiss();
    });
  }

  ionViewWillLeave() {
    this.invitingTo = undefined;
  }

  // acts as on role loaded
  onProjectLoaded() {
    this.updateRoles();
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });

    toast.present(toast);
  }

  getIde() {
    return common.snap.world.children[0];
  }

  getRoom() {
    return common.snap.world.children[0].room;
  }

  // updates roles inplace
  updateRoles() {
    let roles = this.getRoom().getRoles();
    console.log('updating roles', roles);
    this.roles = roles;
  }

  // FIXME not working reliably 
  updateFriendList() {
    console.log('updating the friend list');
    this.friends = [];
    let handleError =(err, lbl) => {
      console.error(err);
    };
    let friendsCb = friends => {
      // TODO search find pick the friend if there are any
      friends.unshift('myself');
      console.log('friendlist:', friends);
      this.friends = friends;
      this.cache.friends = [...friends];
    };
    common.snap.SnapCloud.getFriendList(friendsCb, handleError);
  }

  // invite a friend to a role
  inviteGuest(username, roleName) {
    const room = this.getRoom();
    // FIXME temp workaround to invite guests w/o selecting a role
    if (!roleName) {
      let theRole = this.roles.find(role => role.users.length === 0);
      if (theRole) {
        roleName = theRole.name;
      } else {
        console.error('no role selected, cant invite guests');
        return;
      }
    }
    // TODO don't expose if is not the owner or a collaborator
    if (room.isOwner() || room.isCollaborator()) {
      this.showToast(`Inviting user ${username} to role ${roleName}`);
      room.inviteGuest(username, roleName);
    } else {
      // not allowed to do this
      console.error('you are not allowed to invite guests');
    }
    this.invitingTo = undefined; // reset invitingTo // hide the prompt
  }

  // move to a role
  moveToRole(roleName) {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: `Move to role ${roleName}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Move',
          handler: () => {
            this.getRoom().moveToRole(roleName);
            // FIXME moving to role is an async task
            let loader = this.presentLoading(`loading ${roleName} data..`)
            common.snapFrame.addEventListener('projectLoaded', loader.dismiss);
            this.loader = loader;
          }
        }
      ]
    });
    alert.present();
  }


  presentLoading(msg) {
    let loader = this.loadingCtrl.create({
      content: msg
    });
    loader.present();
    return loader;
  }


  evictUser(user, roleName) {
    // TODO warn/confirm
    let room = this.getRoom();
    let sucCb = () => {
      console.log('evicted', user.username);
      this.updateRoles();
    };
    let errCb =(err, lbl) => {
      console.error(err, lbl);
    };
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: `Are you sure you want to evict ${user.username}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Eviction canceled');
          }
        },
        {
          text: 'Evict',
          handler: () => {
            common.snap.SnapCloud.evictUser( sucCb, errCb,
              [user.uuid, roleName, room.ownerId, room.name]
            );
          }
        }
      ]
    });
    alert.present();
  }

  presentActions(role) {
    this.invitingTo = undefined;
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose an action',
      buttons: [
        {
          text: 'Evict User',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'exit' : null,
          handler: () => {
            // TODO find the user, through the role? 
            let user = role.users.find(uName => uName !== 'myself');
            this.evictUser(user, role.name);
            console.log('Destructive clicked');
          }
        },{
          text: 'Move To',
          icon: !this.platform.is('ios') ? 'move' : null,
          handler: () => {
            this.moveToRole(role.name);
            console.log('moving to role', role.name);
          }
        },{
          text: 'Invite Guest',
          icon: !this.platform.is('ios') ? 'add' : null,
          handler: () => {
            // ask/update the friends list and show a list of users to select from
            this.updateFriendList();
            this.invitingTo = role.name;
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  // searches through a cached list of friends
  filterFriends(ev) {
    this.friends = [...this.cache.friends]
    let val = ev.target.value;
    if (val && val.trim() !== '') {
      this.friends = this.friends.filter(friend => {
        return friend.toLowerCase().includes(val.toLowerCase());
      });
    }
  }

}
