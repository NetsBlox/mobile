import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ProjectsPage } from '../projects/projects';
import * as axios from 'axios';
import * as sha512 from 'js-sha512';
import $ from 'jquery';
import common from '../../common';


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
    console.log(common);
    this.loggedIn = common.loggedIn || false;
  }

  logout() {
    // TODO implement logout
    common.loggedIn = false;
    // this.loggedIn = false
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

    // dummy login
    // common.loggedIn = true;
    // this.navCtrl.push(ProjectsPage)
    // return;

    // TODO use axios, fetch or sth lighter
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
    // return axios({
    //   url: common.SERVER_ADDRESS + '/api/?SESSIONGLUE=.sc1m16',
    //     method: 'POST',
    //     data: JSON.stringify({
    //         __h: sha512(this.password),
    //         __u: this.username,
    //         remember: true
    //     }),
    //     contentType: 'application/json; charset=utf-8',
    //     withCredentials: true,
    //     headers: {
    //         // SESSIONGLUE: '.sc1m16',
    //         Accept: '*/*',
    //     },
    //   })
      .then(resp => {
        console.log('login succeeded from then');
        common.loggedIn = true;
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

  loadProjects() {
  }

}