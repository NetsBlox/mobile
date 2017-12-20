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
  room: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.roles = [{name: 'loading', occupants: [{}] ];
    this.updateRoles();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomManagerPage');
  }

  getRoom() {
    console.log('snap world', common.snap.world);
    return common.snap.world.children[0].room;
  }

  updateRoles() {
    let room = this.getRoom();
    console.log('room', room);
    console.log('RoomMorph', Object.keys(common.snap.RoomMorph.prototype));
    this.roles = room.getRoles();
  }

}
