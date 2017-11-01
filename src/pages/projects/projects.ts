import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as state from '../../common';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.projects = [];
    let defaultProject = {
      name: 'Project Name',
      description: 'description',
      thumbnail: 'url'
    };

    for(let i=0; i<10; i++){
      let proj = Object.assign({}, defaultProject);
      proj.name = proj.name + i
      this.projects.push(proj);
    }
    console.log(this.projects);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectsPage');
  }

  ionViewWillEnter() {
    this.loggedIn = state.loggedIn;
  }

  itemSelected(project) {
    alert(project);
  }

  loadProjects() {
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
}
