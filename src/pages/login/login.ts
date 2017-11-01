import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProjectsPage } from '../projects/projects';
import * as axios from 'axios';
import * as sha512 from 'js-sha512';
import * as common from '../../common';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username:string = '';
  password:string = '';
  loggedIn:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {
    this.loggedIn = state.loggedIn || false;
  }

  logout() {
    // TODO implement logout
    state.loggedIn = false;
    this.loggedIn = false
    return;
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

    // TODO dummy login for now
    state.loggedIn = true;
    this.navCtrl.push(ProjectsPage)
    return;

    return axios({
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
        crossDomain: true,
        statusCode: {
            403: function(xhr) {
                // login failed
                alert(xhr.responseText);
            }
        },
        success: () => {
            console.log('logged in');
        },
        fail: err => {
            console.log('failed to log in', err);
        }
    })
      .then(resp => {
        console.log('login succeeded from then');
        this.navCtrl.push(ProjectsPage)
      })
      .catch(e => {
        let alert = this.alertCtrl.create({
          title:'Login Failed', 
          subTitle: e,
          buttons:['OK']
        });
        alert.present();
      })
  }

  loadProjects() {
  }

}
