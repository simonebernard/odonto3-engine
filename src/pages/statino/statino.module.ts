import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatinoPage } from './statino';
import { DettaglioStatinoPage } from './statino';
import { FotoStatinoPage } from './statino';


@NgModule({
  declarations: [
    StatinoPage,
    DettaglioStatinoPage,
    FotoStatinoPage,
    
  ],
  imports: [
    IonicPageModule.forChild(StatinoPage),
  ],
})
export class StatinoPageModule {}
export class DettaglioStatinoPageModule {}
export class FotoStatinoPageModule {}
export class openNavEditStatinoPageModule {}
