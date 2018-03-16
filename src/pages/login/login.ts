import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProjectsPage } from '../projects/projects';
import * as sha512 from 'js-sha512';
import $ from 'jquery';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {
    common.checkLoggedIn();
  }

  logout() {
    $.ajax({
      method: 'POST',
      url: common.SERVER_ADDRESS + '/api/logout',
    })
      .then(resp => {
        this.state.loggedIn = false;
        common.cache.projects = null;
      })
      .catch(console.error);
  }

  login() {
    if(!this.username || !this.password) {
      let alert = this.alertCtrl.create({
        title:'Login Failed', 
        subTitle:'All fields are rquired',
        buttons:['OK']
      });
      alert.present();
      return;
    }

    // dummy login
    // this.state.loggedIn = true;
    // this.navCtrl.push(ProjectsPage)
    // return;

    return $.ajax({
      url: common.SERVER_ADDRESS + '/api/?SESSIONGLUE=.sc1m16',
      method: 'POST',
      data: JSON.stringify({
          __h: sha512(this.password),
          __u: this.username,
          remember: true
      }),
      contentType: 'application/json; charset=utf-8',
      xhrFields: {
          withCredentials: true
      },
      headers: {
          // SESSIONGLUE: '.sc1m16',
          Accept: '*/*',
      },
      crossDomain: true
    })
      .then(resp => {
        console.log('login succeeded from then');
        this.state.loggedIn = true;
        this.state.username = this.username;
        common.getUser();
        this.navCtrl.push(ProjectsPage)
      })
      .catch(e => {
        console.log(e);
        let alert = this.alertCtrl.create({
          title:'Login Failed', 
          subTitle: e.responseText,
          buttons:['OK']
        });
        alert.present();
      })
  }

}
