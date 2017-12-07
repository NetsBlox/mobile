import { Component } from '@angular/core';
import { Project } from '../../types';
import common from '../../common';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';


@IonicPage()
@Component({
  selector: 'page-editor',
  templateUrl: 'editor.html',
})
export class EditorPage {
  project:Project = common.getProjectStructure();

  constructor(public navCtrl: NavController, public navParams: NavParams, private statusBar: StatusBar) {
    let project = this.navParams.get('project');
    if (project) {
      this.project = project;
    } else {
      console.error('project is not set');
    }
    console.log('got the proj', this.project);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditorPage');
  }

  // gets the editor context
  getEditorWindow() {
    // TODO cache? 
    let iframe: any;
    iframe = document.querySelector('iframe#editor');
    return iframe.contentWindow;
  }

  getWorld() {
    return this.getEditorWindow().world;
  }

  // helper
  applyOnEditor(fn, arg1, arg2) {
    const context = this.getEditorWindow();
    let args = Array.prototype.slice.call(arguments, 1);
    return fn.apply(context, args);
  }

  // editor specific functions, this would refer to editor window
  setFullscreen(status) {
    this.getWorld().children[0].toggleAppMode(status);
  }


}
