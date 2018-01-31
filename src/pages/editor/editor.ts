import { Component } from '@angular/core';
import { Project } from '../../types';
import common from '../../common';
import { State } from '../../types';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { RoomManagerPage } from '../room-manager/room-manager';
import { LoadingController } from 'ionic-angular';
import { DiagnosticService } from '../../app/diagnostic.service';
import { Geolocation } from '@ionic-native/geolocation';


@IonicPage()
@Component({
  selector: 'page-editor',
  templateUrl: 'editor.html',
})
export class EditorPage {
  project:Project = common.getProjectStructure();
  state:State = common.state;

  constructor(
    private geolocation: Geolocation,
    private diagnosticService: DiagnosticService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation
  ) {
    let project = this.navParams.get('project');
    if (project) {
      this.project = project;
    } else {
      console.error('project is not set');
    }
    console.log('got the proj', this.project);

    // detect orientation changes
    this.screenOrientation.onChange().subscribe(
      () => {
        if (this.screenOrientation.type.startsWith('landscape')) {
          this.setFocusMode(true);
        } else {
          this.setFocusMode(false);
        }
      }
    );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditorPage');
    this.updateSnapHandle();
    // call onProjectLoaded when the project is loaded 
    let editor = this;
    this.raceForIt(() => {
      return common.snap.SnapActions !== undefined;
    }, 50, 5000)
      .then(stat => {
      let SnapActions = common.snap.SnapActions;
      let onOpenProject = common.snap.SnapActions.onOpenProject;
      common.snap.SnapActions.onOpenProject = function(str) {
        onOpenProject.apply(SnapActions, arguments);
        editor.onProjectLoaded();
      }
    })
      .catch(console.error);

    let loader = this.presentLoading('Loading the project..');
    common.snapFrame.addEventListener('projectLoaded', () => {
      // TODO use loading component
      common.snapFrame.style.visibility = 'visible';
      loader.dismiss();
    });

    console.log('setting up snap mobile', common.snap);
    window.mobile = window.mobile || {};
    window.mobile.platform = common.platform;
    window.mobile.geolocation = this.geolocation;
    window.mobile.diagnosticService = this.diagnosticService;

  }

  // really?! FIXME swap out with the proper solution
  // promisifiying race conditions!
  raceForIt(fn, delay=50, timeout=10000) {
    let counter = 0;
    return new Promise((resolve, reject) => {
      let myTimeout = setTimeout(() => {
        reject('timedout');
        clearInterval(interval);
      }, timeout)
      let interval = setInterval(() => {
        counter++;
        if (fn()) {
          clearInterval(interval);
          clearTimeout(myTimeout)
          console.log(`finished the race with #${counter} tries or ${counter * delay}ms wait`);
          resolve();
        }
      }, delay);
      // or accept failure
    })
  }

  presentLoading(msg) {
    let loader = this.loadingCtrl.create({
      cssClass: 'desktopViewWidth',
      content: msg
    });
    loader.present();
    return loader;
  }

  onProjectLoaded() {
    // dispatch a dom event? 
    common.snapFrame.dispatchEvent(new Event('projectLoaded'));
    console.log('project loaded');
  }

  ionViewWillEnter() {
    this.setFocusMode(true);
    this.setDesktopViewport(true);
  }

  ionViewWillLeave() {
    this.setFocusMode(false);
    this.setDesktopViewport(false);
  }

  getSnapFrame() {
    return <any>document.querySelector('iframe#editor');
  }

  // gets the editor context
  updateSnapHandle() {
    let iframe = this.getSnapFrame();
    common.snapFrame = iframe;
    common.snap = iframe.contentWindow;
  }

  getWorld() {
    return common.snap.world;
  }

  getNbMorph() {
    return this.getWorld().children[0];
  }
  // helper
  applyOnEditor(fn, arg1, arg2) {
    const context = common.snap;
    let args = Array.prototype.slice.call(arguments, 1);
    return fn.apply(context, args);
  }

  // editor specific functions, this would refer to editor window
  setFullscreen(status) {
    if (status === undefined) status = !this.getNbMorph().isAppMode;
    this.getNbMorph().toggleAppMode(status);
  }

  setFocusMode(status) {
    if (status === undefined) status = !this.state.view.focusMode;
    let tabEl:any = document.querySelector('ion-tabs');
    if (status === true) {
      this.statusBar.hide();
      tabEl.className += ' focusMode';
    } else {
      //revert
      tabEl.className = tabEl.className.replace('focusMode', '');
    }
    this.state.view.focusMode = status;
  }

  setDesktopViewport(status) {
    let vpEl:any = document.querySelector('meta[name="viewport"]');
    if (status) {
      vpEl.content = 'width=980';
    } else {
      vpEl.content = 'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }
  }

  openRoom() {
    this.navCtrl.push(RoomManagerPage, {});
  }


}
