import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { LoginPage } from './login';

@NgModule({
  declarations: [
    LoginPage
  ],
  imports: [
    IonicModule,
    RouterModule.forChild([
       {
         path: '/login',
         component: LoginPage
       }
    ]),
  ],
})
export class LoginPageModule {}
