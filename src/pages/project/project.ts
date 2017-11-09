import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import common from '../../common';

@IonicPage()
@Component({
  selector: 'page-project',
  templateUrl: 'project.html',
})
export class ProjectPage {
  project:object = common.getProjectStructure();

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    let project = this.navParams.get('project');
    if (project) this.project = project;
    let url = `${common.SERVER_ADDRESS}/?action=private&ProjectName=${encodeURIComponent(this.project.name)}`
    this.project.url = url;
    console.log(this.project);
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
  }

}
