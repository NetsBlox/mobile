import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import common from '../../common';

@IonicPage()
@Component({
  selector: 'page-room-manager',
  templateUrl: 'room-manager.html',
})
export class RoomManagerPage {
  roles: any;
  friends: any;

  constructor(public platform: Platform, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams) {
    this.roles = [{name: 'loading', occupants: []}];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomManagerPage');
    this.updateRoles();
    this.updateFriendList();
  }

  getRoom() {
    return common.snap.world.children[0].room;
  }

  // updates roles inplace
  updateRoles() {
    let roles = this.getRoom().getRoles();
    console.log('roles', roles);
    this.roles = roles;
  }

  updateFriendList() {
    console.log('updating the friend list');
    this.friends = [];
    let handleError =(err, lbl) => {};
    let friendsCb = friends => {
      // TODO search find pick the friend if there are any
      friends.unshift('myself');
      console.log('friendlist', friends);
      this.friends = friends;
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
      room.inviteGuest(username, roleName);
    } else {
      // not allowed to do this
      console.error('you are not allowed to invite guests');
    }
  }

  // move to a role
  moveToRole(roleName) {
    this.getRoom().moveToRole(roleName);
  }

  evictUser(user, roleName) {
    // TODO warn/confirm
    let room = this.getRoom();
    let sucCb = () => {
      console.log('evicted', user.username);
    };
    let errCb =(err, lbl) => {
      console.error(err, lbl);
    };
    common.snap.SnapCloud.evictUser( sucCb, errCb,
      [user.uuid, roleName, room.ownerId, room.name]
    );
  }

  presentActions(role) {
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
            console.log('moving to');
          }
        },{
          text: 'Invite Guest',
          icon: !this.platform.is('ios') ? 'add' : null,
          handler: () => {
            console.log('invite guest clicked. open modal list');
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

}
