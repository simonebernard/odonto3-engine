import { Component } from '@angular/core';
import { Platform,ActionSheetController,NavController } from 'ionic-angular';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { StatinoPage } from '../statino/statino';
import { CercaStatinoPage } from '../statino/statino';

//import {CalendarioPage } from '../calendario/calendario' ;


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CercaStatinoPage;
  tab3Root = StatinoPage;
  tab4Root = ContactPage;

  constructor(
    public platform: Platform,
    public actionsheetCtrl: ActionSheetController,
    public navCtrl: NavController
  ) {}

  openActionStatinoSheet() { 
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Lavori',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Richiedi preventivo',
          icon: !this.platform.is('ios') ? 'md-create' : null,
          handler: () => {
            //console.log('Create clicked');
            //let navTransition = actionSheet.dismiss();
            localStorage.setItem('preventivo', 'true')
            this.navCtrl.push(StatinoPage);
            //StatinoPage;
          }
        },
        {
          text: 'Inserisci lavoro',
          icon: !this.platform.is('ios') ? 'md-create' : null,
          handler: () => {
            localStorage.setItem('preventivo', 'false')
            this.navCtrl.push(StatinoPage);
            //StatinoPage;
          }
        }/*,
        {
          text: 'Cerca',
          icon: !this.platform.is('ios') ? 'md-search' : null,
          handler: () => {
           // console.log('Cerca clicked');
            this.navCtrl.push(CercaStatinoPage);
          }
        }*/, 
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
           // console.log('Cancel clicked');
           localStorage.setItem('preventivo', 'false')
          }
        }
      ]
    });
    actionSheet.present();
  }
}

