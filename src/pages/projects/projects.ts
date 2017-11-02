import { Component } from '@angular/core';
import { ProjectPage } from '../project/project';
import { LoadingController } from 'ionic-angular';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import common from '../../common';
import Q from 'q';
import * as axios from 'axios';
import ta from 'time-ago';

/**
 * Generated class for the ProjectsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
})
export class ProjectsPage {
  projects: any[];
  loggedIn:boolean = false; // TODO authentication should be handled in form of a middleware
  projectStructure:object = common.getProjectStructure();

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.projects = [];
    this.projects.push(this.projectStructure);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectsPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ProjectsPage');
    this.loggedIn = common.loggedIn;
    if (this.loggedIn) this.loadUserProjects();
  }

  itemSelected(project) {
    this.navCtrl.push(ProjectPage, {project});
  }

  generateFakeProject() {
    let projects = [];
    let deferred = Q.defer();
    setTimeout(() => {
      for(let i=0; i<10; i++){
        let proj = Object.assign({}, this.projectStructure);
        proj.name = proj.name + i
        projects.push(proj);
      }
      this.projects = projects;
      deferred.resolve(projects);
    }, 3000)
    return deferred.promise;
  }

  loadProjects() {
    // TODO display loading
    return axios({
      url: 'https://jsonplaceholder.typicode.com/posts'
    })
      .then(resp => {
        return resp.data;
      })
      .catch(e => {
        let alert = this.alertCtrl.create({
          title:'Loading Failed', 
          subTitle:'Please retry.',
          buttons:['OK']
        });
        alert.present();
      })
  }

  loadUserProjects() {
    console.log('loading projects');
    axios({
      url: common.SERVER_ADDRESS + '/api/getProjectList?format=json',
      method: 'GET',
      withCredentials: true,
    })
      .then(resp => {
        console.log('received user projects', resp.data);
        let projects = resp.data.map(proj => {
          return {
            name: proj.ProjectName,
            description: proj.Notes,
            thumbnail: proj.Thumbnail,
            updatedAt: new Date(proj.Updated),
            updatedAtRelative: ta().ago(new Date(proj.Updated))
          };
        });
        this.projects = projects;
      })
  }
}
