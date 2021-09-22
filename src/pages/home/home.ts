import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoginPage } from '../login/login';
import { State } from '../../types';
import { Utils } from '../../utils';
import common from '../../common';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  LoginPage: any;
  state:State = common.state;

  constructor(
    public navCtrl: NavController,
    public utils: Utils
  ) {
    this.LoginPage = LoginPage;
  }

  showServer() {
    this.utils.presentToast(common.SERVER_ADDRESS);
  }

}
