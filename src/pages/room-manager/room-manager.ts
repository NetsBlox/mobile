import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import common from '../../common';

@IonicPage()
@Component({
  selector: 'page-room-manager',
  templateUrl: 'room-manager.html',
})
export class RoomManagerPage {
  roles: any;
  friends: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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

}
