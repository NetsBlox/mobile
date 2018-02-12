import { Component } from '@angular/core';
import common from '../../common';
import { State } from '../../types';
import { AboutPage } from '../about/about';
import { ProjectsPage } from '../projects/projects';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ProjectsPage;
  state:State = common.state;

  constructor() {

  }

  ionViewDidLoad() {
    // async: passivly check to see if user is logged in and fetch user data
    common.checkLoggedIn();
  }

  // TODO on changes to state.view.focusMode run fn and hide .tabbar
}
