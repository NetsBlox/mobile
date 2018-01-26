import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import common from '../common';


import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  public platform: string;

  constructor(device: Device, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // setup platfrom string to be used by diagnostic service
      if(device.platform){
        common.platform = device.platform.toLowerCase();
        if(common.platform.match(/win/)){
          common.platform = "windows";
        }
        let body = document.getElementsByTagName('body')[0];
        body.classList.add(common.platform);
      }

    });
  }
}
