import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AppPreferences } from '@ionic-native/app-preferences';
import { Platform } from 'ionic-angular';
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

  presentAlert(title, msg, buttons=['OK']) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: buttons
    });
    alert.present();
    return alert;
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
    return toast;
  }

  presentLoading(msg) {
    let loader = this.loadingCtrl.create({
      // dismissOnPageChange: true, // prematurely dismisses loader
      content: msg
    });

    loader.onDidDismiss(() => {
    });

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
