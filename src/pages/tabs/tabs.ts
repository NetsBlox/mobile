import { Component } from '@angular/core';
import common from '../../common';
import { State } from '../../types';
// import { AboutPage } from '../about/about';
import { ProjectsPage } from '../projects/projects';
import { HomePage } from '../home/home';
import { AlertController } from '@ionic/angular';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { Utils } from '../../utils';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  // tab2Root = AboutPage;
  tab3Root = ProjectsPage;
  state:State = common.state;

  constructor(
    public alertCtrl: AlertController,
    private appPreferences: AppPreferences,
    private utils: Utils
  ) {

  }

  async ionViewDidLoad() {
    // async: passivly check to see if user is logged in and fetch user data
    common.checkLoggedIn()
      .catch(async err => {
        if (err.readyState === 0) { // it's a network error
          let alert = await this.alertCtrl.create({
            header: "Connection Error",
            subHeader: 'Are you connected to internet?',
            buttons: ['Dismiss']
          });
          alert.present();
        }
      });

    // setup server address
    if (this.utils.plt.is('cordova')) this.loadServerAddress();
  }

  // loads and sets the current server if it is defined
  loadServerAddress() {
    this.appPreferences.fetch('SERVER_URL').then(val => {
      // if is set and different, update
      if (val && val !== common.SERVER_ADDRESS) this.utils.updateServerUrl(val, false);
    });
  }

  // TODO on changes to state.view.focusMode run fn and hide .tabbar
}
