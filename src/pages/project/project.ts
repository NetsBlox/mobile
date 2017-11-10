import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { EditorPage } from '../editor/editor';
import common from '../../common';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-project',
  templateUrl: 'project.html',
})
export class ProjectPage {
  project:object = common.getProjectStructure();

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private iab: InAppBrowser) {
    let project = this.navParams.get('project');
    if (project) this.project = project;
    let url = `${common.SERVER_ADDRESS}/?action=private&ProjectName=${encodeURIComponent(this.project.name)}`
    this.project.url = url;
    console.log('the project', this.project);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectPage');
  }

  openProject() {
    let alert = this.alertCtrl.create({
      title:'Coming soon', 
      subTitle:'not implemented yet',
      buttons:["I can't wait"]
    });
    alert.present();
    // this.navCtrl.push(EditorPage);
    const browser = this.iab.create(`/assets/netsblox-client/netsblox-dev.html?action=private&ProjectName=${encodeURIComponent(this.project.name)}`);
  }

}
