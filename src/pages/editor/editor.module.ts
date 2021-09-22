import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EditorPage } from './editor';
const routes: Routes = [
{ path: 'editor', component: EditorPage }
];

@NgModule({
  declarations: [
    EditorPage 
  ],
  imports: [
    IonicModule,
    RouterModule.forChild(routes),
  ],
})
export class EditorPageModule {}
