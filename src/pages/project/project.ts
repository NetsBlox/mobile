import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import common from '../../common';

/**
 * Generated class for the ProjectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-project',
  templateUrl: 'project.html',
})
export class ProjectPage {
  project:object = common.getProjectStructure();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.project = this.navParams.get('project');
    let url = `${common.SERVER_ADDRESS}/?action=private&ProjectName=${encodeURIComponent(this.project.name)}`
    this.project.url = url;
    console.log(this.project);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectPage');
  }

}
