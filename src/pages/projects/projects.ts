import { Component } from '@angular/core';
import { ProjectPage } from '../project/project';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import common from '../../common';
import { Project, State } from '../../types';
import Q from 'q';
import $ from 'jquery';
import { HTTP } from '@ionic-native/http'
import ta from 'time-ago';

@IonicPage()
@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
})
export class ProjectsPage {
  projects: any[];
  state:State = common.state; // TODO authentication should be handled in form of a middleware
  projectStructure:Project = common.getProjectStructure();

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private http: HTTP) {
    this.projects = [];
    this.projects.push(this.projectStructure);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectsPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ProjectsPage');
    this.loadUserProjects();
  }

  itemSelected(project) {
    this.navCtrl.push(ProjectPage, {project});
  }

  generateFakeProject() {
    let projects = [];
    let deferred = Q.defer();
    setTimeout(() => {
      for(let i=0; i<10; i++){
        let proj = <Project> Object.assign({}, this.projectStructure);
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
    return $.ajax({
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
    let url = common.SERVER_ADDRESS + '/api/getProjectList?format=json';
    $.ajax({
      url, 
      method: 'GET',
      xhrFields: {
          withCredentials: true
      },
      crossDomain: true
    })
      .then(resp => {
        console.log('received user projects', resp);
        this.state.loggedIn = true;
        let projects = resp.map(proj => {
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
      .catch(console.error);
  }
}
