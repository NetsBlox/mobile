import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from '@ionic/angular';
import { Project } from '../../types';
import common from '../../common';
import { EditorPage } from '../editor/editor';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'page-project',
  templateUrl: 'project.html',
})

export class ProjectPage {
  project:Project;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private iab: InAppBrowser) {
    // setup project
    let project = this.navParams.get('project');
    if (project) this.project = project;
    if (project.type === 'private') {
      let externalUrl = `${common.SERVER_ADDRESS}/?action=private&ProjectName=${encodeURIComponent(this.project.name)}&noRun=DOESNT_MATTER`;
      let internalUrl = `assets/netsblox-client/index.html?action=private&ProjectName=${encodeURIComponent(this.project.name)}&noRun=DOESNT_MATTER`;
      this.project.url = internalUrl;
      this.project.externalUrl = externalUrl;
    } else if (project.type === 'example') {
      this.project.url = `assets/netsblox-client/index.html?action=example&ProjectName=${encodeURIComponent(this.project.name)}&noRun=DOESNT_MATTER`;
    }
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
    const navOpts = {state: {project: this.project}};
    this.navCtrl.navigateForward('/editor', navOpts)
  }
}
