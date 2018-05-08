import { Component } from '@angular/core';
import { ProjectPage } from '../project/project';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import common from '../../common';
import { Project, State } from '../../types';
import axios from 'axios';
import ta from 'time-ago';

@IonicPage()
@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
})
export class ProjectsPage {
  projects: Project[] = [];
  publicProjects: Project[];
  exampleProjects:  Project[] = [];
  examplesStatus:string = '';
  projectsStatus:string = '';
  category: string = 'examples'; // default category to show
  state:State = common.state; // TODO authentication should be handled in form of a middleware

  // TODO use native cordova http module for fetching
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectsPage');
    if (this.state.loggedIn) this.category = 'private';
    this.loadExamples();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ProjectsPage');
    this.loadUserProjects(true);
    if (this.exampleProjects.length === 0) this.loadExamples();
  }

  itemSelected(project) {
    this.navCtrl.push(ProjectPage, {project});
  }

  // loadPublicProjects() {
  //   console.log('Calling server for public projects');
  //   return axios({
  //     method: 'GET',
  //     url: common.SERVER_ADDRESS +'/api/Projects/PROJECTS'
  //   });
  // }

  loadExamples() {
    console.log('Calling server for example projects');
    this.examplesStatus = 'Loading examples.';
    axios({
      url: common.SERVER_ADDRESS + '/api/Examples/EXAMPLES?metadata=true',
      method: 'GET'
    })
      .then(resp => {
        let data = resp.data;
        let projects = data.map(proj => {
          return {
            name: proj.projectName,
            type: 'example',
            description: proj.notes,
            thumbnail: proj.thumbnail,
            services: proj.services
          };
        });
        projects.sort((a,b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
        this.exampleProjects = projects;
        this.examplesStatus = (projects.length === 0) ? 'No examples found.' : '';
        return projects;
      })
      .catch(err => {
        let alert = this.alertCtrl.create({
          title:'Failed to load examples.',
          subTitle:'Are you connected to internet?',
          buttons: [
            'OK',
            {
              text: 'Try Again',
              handler: () => {
                this.loadExamples();
              }
            }
          ]
        });
        alert.present();
        this.examplesStatus = 'Failed to load examples.';
      })
  }

  // loads the projects from cache or request the server for projects
  // cache flag dictates whether to use the cache (if available) or not
  loadUserProjects(cache=true) {
    if (!common.state.loggedIn) {
      this.projectsStatus = 'Login to see your projects here.';
      return false
    }
    let hasValidCache = () => {
      return common.cache.projects && common.cache.projects.length > 0;
    }
    if (cache && hasValidCache()) {
      console.log('loading projects from cache');
      this.projects = [...common.cache.projects];
      return;
    }
    this.projectsStatus = 'Loading projects..';
    let url = common.SERVER_ADDRESS + '/api/getProjectList?format=json';
    axios({
      url, 
      method: 'GET',
      withCredentials: true,
      crossDomain: true
    } as any)
      .then(resp => {
        let data = resp.data;
        console.log('received user projects', data);
        this.state.loggedIn = true;
        let projects = data.map(proj => {
          return {
            name: proj.ProjectName,
            type: 'private',
            description: proj.Notes,
            thumbnail: proj.Thumbnail,
            updatedAt: new Date(proj.Updated),
            updatedAtRelative: ta().ago(new Date(proj.Updated))
          };
        });
        projects.sort((a,b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
        common.cache.projects = projects;
        this.projects = [...projects];
        this.projectsStatus = (projects.length === 0) ? 'No projects found.' : '';
        return projects
      })
      .catch(err => {
        console.error(err);
        this.projectsStatus = 'Failed to load projects.';
      });
  }

  filterItems(ev: any) {
    this.loadUserProjects();
    let val = ev.target.value;
    if (val && val.trim() !== '') {
      this.projects = this.projects.filter(project => {
        return project.name.toLowerCase().includes(val.toLowerCase());
      });
    }
  }

}
