import { Component } from '@angular/core';
import common from '../../common';
import { State } from '../../types';
// import { AboutPage } from '../about/about';
import { ProjectsPage } from '../projects/projects';
import { HomePage } from '../home/home';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  // tab2Root = AboutPage;
  tab3Root = ProjectsPage;
  state:State = common.state;

  constructor(public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    // async: passivly check to see if user is logged in and fetch user data
    common.checkLoggedIn()
      .catch(err => {
        if (err.readyState === 0) { // it's a network error
          let alert = this.alertCtrl.create({
            title: "Connection Error",
            subTitle: 'Are you connected to internet?',
            buttons: ['Dismiss']
          });
          alert.present();
        }
      });
  }

  // TODO on changes to state.view.focusMode run fn and hide .tabbar
}
