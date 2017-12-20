import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import common from '../../common';

@IonicPage()
@Component({
  selector: 'page-room-manager',
  templateUrl: 'room-manager.html',
})
export class RoomManagerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomManagerPage');
  }

}
