import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Project } from '../../types';
import common from '../../common';
import { EditorPage } from '../editor/editor';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-project',
  templateUrl: 'project.html',
})

export class ProjectPage {
  project:Project = common.getProjectStructure();

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private iab: InAppBrowser) {
    // setup project
    let project = this.navParams.get('project');
    if (project) this.project = project;
    let externalUrl = `${common.SERVER_ADDRESS}/?action=private&ProjectName=${encodeURIComponent(this.project.name)}`;
    let internalUrl = `assets/netsblox-client/index.html?action=private&ProjectName=${encodeURIComponent(this.project.name)}`;
    this.project.url = internalUrl;
    this.project.externalUrl = externalUrl;
    console.log('the project', this.project);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectPage');
  }

  openProject() {
    let target = '_self';
    let options: InAppBrowserOptions = {
      hardwareback : 'yes',
      toolbar : 'yes', //iOS only 
    };
    this.iab.create(this.project.url, target, options);
  }

  openProject2() {
    window.location.href = this.project.url;
  }

  // opens the project using external snap
  openProject3() {
    // no need for localsnap?
    window.location.href = this.project.externalUrl;
  }

  openProject4() {
    this.navCtrl.push(EditorPage, {project: this.project})
  }
}
