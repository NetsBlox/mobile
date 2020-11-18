import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import common from '../../common';
import { Utils } from '../../utils';
import { State } from '../../types';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username:string = '';
  password:string = '';
  state:State = common.state;
  common:any = common;
  candidateAddress:string = common.SERVER_ADDRESS;
  expertMode: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private utils: Utils
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {
    common.checkLoggedIn()
      .catch(() => {}); // ignore errors if loggedout
  }

  simpleUrl(url) {
    return url.replace(/https?:\/\//,'');
  }

  updateServerUrl() {
    // validate url
    if (this.validateUrl(this.candidateAddress)) {
      this.utils.updateServerUrl(this.candidateAddress, true);
      this.expertMode = false;
    } else {
      this.presentAlert('Bad URL', 'Please enter a valid and complete URL.');
    }
  }

  validateUrl(str) {
    if (!str.startsWith('http')) return false;
    let a  = document.createElement('a');
    a.href = str;
    return (a.host && a.host != window.location.host);
  }

  logout() {
    common.authenticator.logout()
      .then(resp => {
        this.state.loggedIn = false;
        common.cache.projects = null;
      })
      .catch(console.error);
  }

  login() {
    // alert about blank username or password
    if(!this.username || !this.password) {
      return this.presentAlert('Login failed', 'All fields are required.');
    }

    return common.authenticator.login(this.username, this.password)
      .then(() => common.getUser())
      .then(() => this.navCtrl.setRoot(HomePage))
      .catch(e => {
        this.presentAlert('Login failed', e.request.responseText);
      })
  }

  presentAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons:['OK']
    });
    alert.present();
    return alert;
  }

}
