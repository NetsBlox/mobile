import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonApp, IonicModule } from '@ionic/angular';
import { MyApp } from './app.component';
import { SafePipe } from '../pipes';
import { Utils } from '../utils';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { ProjectsPage } from '../pages/projects/projects';
import { ProjectPage } from '../pages/project/project';
import { LoginPage } from '../pages/login/login';
import { EditorPage } from '../pages/editor/editor';
import { RoomManagerPage } from '../pages/room-manager/room-manager';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { DiagnosticService } from './diagnostic.service';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AppPreferences } from '@ionic-native/app-preferences/ngx';
import { AbsoluteDrag } from '../components/absolute-drag/absolute-drag';
import { Dialogs } from '@ionic-native/dialogs/ngx';


@NgModule({
  declarations: [
    SafePipe,
    MyApp,
    AboutPage,
    ContactPage,
    ProjectsPage,
    ProjectPage,
    LoginPage,
    EditorPage,
    RoomManagerPage,
    HomePage,
    TabsPage,
    AbsoluteDrag
  ],
  imports: [
    BrowserModule,
    //IonicModule.forRoot(MyApp, [Utils])
    IonicModule.forRoot()
  ],
  bootstrap: [IonApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    ProjectsPage,
    ProjectPage,
    LoginPage,
    EditorPage,
    RoomManagerPage,
    HomePage,
    TabsPage
  ],
  providers: [
    Dialogs,
    StatusBar,
    Device,
    Geolocation,
    Diagnostic,
    DiagnosticService,
    LocationAccuracy,
    ScreenOrientation,
    Keyboard,
    InAppBrowser,
    Utils,
    AppPreferences,
    HTTP,
    SplashScreen,
    //{provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
