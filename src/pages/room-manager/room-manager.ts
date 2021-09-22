import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import common from '../../common';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'page-room-manager',
  templateUrl: 'room-manager.html',
})
export class RoomManagerPage {
  roles: any;
  friends: any = [];
  cache: any = {friends: []};
  invitingTo: string; // if set, shows the friendlist and invites to the specified role
  loader: any; // keeps a handle to the room loading popup
  intervals:any = []

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
      if (this.loader) this.loader.dismiss();
    });

    // FIXME hacky fix for keeping the room up to date with the changes
    // catch websocket messages with type 'room-roles' or hook into room.update
    // client doesn't get room-roles message when target accepts invitaiton
    this.intervals.push(setInterval(this.updateFriendList.bind(this), 2000))
    let fn = common.snap.WebSocketManager.MessageHandlers['room-roles'];
    let webSocketManager = this.getIde().sockets;
    common.snap.WebSocketManager.MessageHandlers['room-roles'] = function(msg) {
      fn.call(webSocketManager, msg);
      roomManager.updateRoles();
    }
  }

  ionViewWillLeave() {
    this.invitingTo = undefined;
    this.intervals.forEach(i => clearInterval(i));
    // hide page ASAP to avoid showing changes when updating viewport settings
    let page:any = document.querySelector('page-room-manager');
    page.style.display = 'none';
  }

  // acts as on role loaded
  onProjectLoaded() {
    this.updateRoles();
  }

  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
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
    this.roles = roles;
  }

  getRoleByName(name) {
    return this.roles.find(r => r.name === name);
  }

  // FIXME not working reliably
  updateFriendList() {
    let handleError =(err, lbl) => {
      console.error(err);
    };
    let friendsCb = friends => {
      // TODO search find pick the friend if there are any
      friends.unshift('myself');
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
    let role = this.getRoleByName(roleName);
    // TODO don't expose if is not the owner or a collaborator
    if (room.isOwner() || room.isCollaborator()) {
      this.showToast(`Inviting user ${username} to role ${roleName}`);
      room.inviteGuest(username, role.id);
    } else {
      // not allowed to do this
      console.error('you are not allowed to invite guests');
    }
    this.invitingTo = undefined; // reset invitingTo // hide the prompt
  }

  // move to a role
  async goToRole(role) {
    let alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: `Move to role ${role.name}?`,
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
          handler: async () => {
            this.getRoom().moveToRole(role);
            // FIXME moving to role is an async task
            let loader = await this.presentLoading(`loading ${role.name} data..`)
            common.snapFrame.addEventListener('projectLoaded', loader.dismiss);
            this.loader = loader;
          }
        }
      ]
    });
    alert.present();
  }


  async presentLoading(msg) {
    let loader = await this.loadingCtrl.create({
      message: msg
    });
    loader.present();
    return loader;
  }


  async evictUser(user, roleName) {
    // TODO warn/confirm
    let room = this.getRoom();
    let sucCb = () => {
      console.log('evicted', user.username);
      this.updateRoles();
    };
    let errCb =(err, lbl) => {
      console.error(err, lbl);
    };
    let alert = await this.alertCtrl.create({
      header: 'Confirm',
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

  async presentActions(role) {
    this.invitingTo = undefined;
    let actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose an action',
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
            this.goToRole(role);
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
