import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { Platform } from '@ionic/angular';
import common from './common';


// TODO port present* methods to reuse these
@Injectable()
export class Utils {
  constructor(
    public plt: Platform,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private appPreferences: AppPreferences
  ) {
  }

  async presentAlert(title, msg, buttons=['OK']) {
    let alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: buttons
    });
    alert.present();
    return alert;
  }

  async presentToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
    return toast;
  }

  async presentLoading(msg) {
    let loader = await this.loadingCtrl.create({
      // dismissOnPageChange: true, // prematurely dismisses loader
      message: msg
    });

    //loader.onDidDismiss()
    loader.present();
    return loader;
  }

  // updates server url used throughout the app
  updateServerUrl(url, save) {
    common.SERVER_ADDRESS = url;
    // update authenticator
    common.authenticator.serverUrl = common.SERVER_ADDRESS
    console.log('changed server url to', url);
    if (save) this.appPreferences.store('SERVER_URL', url);
  }


}
