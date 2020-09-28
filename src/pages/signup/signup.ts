import {Component} from '@angular/core';
import { LoadingController } from 'ionic-angular';

import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {AuthService} from "../../providers/auth-service";

import {TabsPage} from '../tabs/tabs';
import {Welcome} from "../welcome/welcome";

@IonicPage()
@Component({selector: 'page-signup', templateUrl: 'signup.html'})
export class Signup {
  resposeData : any;
  selectcategory:any;
  selectcategory1:any;
  userData = {"username":"", "password":"","email":"","name":"","profilo":null};
  constructor(public navCtrl : NavController, public authService : AuthService, private toastCtrl:ToastController, public loadingCtrl: LoadingController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }

   signup() {
     console.log("signup")
    if(this.userData.username && this.userData.password && this.userData.email && this.userData.name && this.userData.profilo != null) {
      const loading =  this.loadingCtrl.create({ content : "Please wait..."});
      loading.present();
      this.authService.postData(this.userData, "signup").then((result) => {
        this.resposeData = result;
        if(this.resposeData.userData) {
          
          console.log(this.resposeData);
          localStorage.setItem('userData', JSON.stringify(this.resposeData) )
          this.navCtrl.push(TabsPage);
          loading.dismiss();
        } else {

          this.presentToast("Please give valid username and password");
          loading.dismiss();
        }
      }, (err) => {
        //Connection failed message
        console.log("err",err)
        this.presentToast(err.status +' '+err.statusText);
      });
  } else {
    console.log("Give valid information.");
    this.presentToast("Give valid information.");
  }
  
  }

  welcomePage() {
    this
      .navCtrl
      .push(Welcome);
  }
  codeSelected(){
    console.log("codeSelected",this.selectcategory)

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
