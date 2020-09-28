import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {Camera} from '@ionic-native/camera';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AuthService } from '../providers/auth-service';
import { SplitPane } from '../providers/split-pane';
import { Common } from '../providers/common';
import { HttpModule } from "@angular/http";
//import { HttpClientModule, HttpClient } from '@angular/common/http';


import { Welcome } from '../pages/welcome/welcome';
import { Login } from '../pages/login/login';
import { Signup } from '../pages/signup/signup';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';

import { Dettaglio2StatinoPage } from '../pages/home/home';

import { TabsPage } from '../pages/tabs/tabs';
/*Odonto3*/
import { StatinoPage } from '../pages/statino/statino';
import { CercaStatinoPage } from '../pages/statino/statino';
import { DettaglioStatinoPage } from '../pages/statino/statino';
import { FotoStatinoPage } from '../pages/statino/statino';
import { Calendar } from '@ionic-native/calendar';
import { CalendarioPage } from '../pages/calendario/calendario';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MomentModule } from 'angular2-moment';
import { LinkyModule } from 'angular-linky';
import { NgCalendarModule  } from 'ionic2-calendar';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    MyApp,
    Welcome,
    Login,
    Signup,
    CalendarioPage,
    ContactPage,
    HomePage,
    TabsPage,
    StatinoPage,
    CercaStatinoPage,
    DettaglioStatinoPage,
    FotoStatinoPage,      
    Dettaglio2StatinoPage
  ],
  imports: [
    IonicSelectableModule,
    NgCalendarModule,
    BrowserModule,HttpModule,MomentModule,LinkyModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Welcome,
    Login,
    Signup,
    CalendarioPage,
    ContactPage,
    HomePage,
    TabsPage,
    StatinoPage,
    CercaStatinoPage,
    DettaglioStatinoPage,
    FotoStatinoPage,   
    Dettaglio2StatinoPage
  ],
  providers: [
    StatinoPage,
    StatusBar,
    SplashScreen,Camera,AuthService,SplitPane,Common,InAppBrowser,Calendar,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
