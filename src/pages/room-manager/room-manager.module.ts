import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { RoomManagerPage } from './room-manager';

@NgModule({
  declarations: [
RoomManagerPage
  ],
  imports: [
    IonicModule,
    RouterModule.forChild([
       {
         path: '/room',
         component: RoomManagerPage
       }
    ]),
  ],
})
export class RoomManagerPageModule {}
