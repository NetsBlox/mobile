import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProjectsPage } from '../projects/projects';
import common from '../../common';
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
  SERVER_ADDRESS:string = common.SERVER_ADDRESS.replace(/https?:\/\//,'');

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.authenticator = new AuthHandler(common.SERVER_ADDRESS);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {
    common.checkLoggedIn();
  }

  logout() {
    this.authenticator.logout()
      .then(resp => {
        this.state.loggedIn = false;
        common.cache.projects = null;
      })
      .catch(console.error);
  }

  login() {
    // alert about blank username or password
    if(!this.username || !this.password) {
      let alert = this.alertCtrl.create({
        title:'Login Failed', 
        subTitle:'All fields are rquired',
        buttons:['OK']
      });
      alert.present();
      return;
    }

    return this.authenticator.login(this.username, this.password)
      .then(resp => {
        this.state.loggedIn = true;
        this.state.username = this.username;
        common.getUser();
        this.navCtrl.push(ProjectsPage)
      })
      .catch(e => {
        let alert = this.alertCtrl.create({
          title:'Login Failed', 
          subTitle: e.request.responseText,
          buttons:['OK']
        });
        alert.present();
      })
  }

}
