import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ProjectPage } from './project';

@NgModule({
  declarations: [
    ProjectPage
  ],
  imports: [
    IonicModule,
    RouterModule.forChild([
       {
         path: '/project',  // TODO: does this need a parameter for the project name/id?
         component: ProjectPage
       }
    ]),
  ],
})
export class ProjectPageModule {}
