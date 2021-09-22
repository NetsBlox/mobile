import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ProjectsPage } from './projects';

@NgModule({
  declarations: [
ProjectsPage 
  ],
  imports: [
    IonicModule,
    RouterModule.forChild([
       {
         path: '/projects',
         component: ProjectsPage
       }
    ]),
  ],
})
export class ProjectsPageModule {}
