import {Injectable} from "@angular/core";
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

// TODO port present* methods to reuse these
@Injectable()
export class Utils {
  constructor(
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
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

}
