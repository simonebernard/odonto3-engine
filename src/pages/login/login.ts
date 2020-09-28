import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';

import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import {Welcome} from "../welcome/welcome";
import {AuthService} from "../../providers/auth-service";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  
  resposeData : any;
  userData = {"username":"", "password":""};

  constructor(public navCtrl: NavController, public authService: AuthService, private toastCtrl:ToastController, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

   login() {
    const loading =  this.loadingCtrl.create({ content  : "Please wait..."});
    if(this.userData.username && this.userData.password) {
       loading.present();
      this.authService.postData(this.userData, "login").then((result) =>{
      this.resposeData = result;

      if(this.resposeData.userData) {
        localStorage.setItem('userData', JSON.stringify(this.resposeData) )
        
          this.navCtrl.push(TabsPage);
          loading.dismiss();
        
      } else { 
        
          this.presentToast("Username and password non validi. Ripetere l'operazione ");
          loading.dismiss();
        
      }
  

    }, (err) => {
        loading.dismiss();
        console.log("err",err)
        this.presentToast(err.status +' '+err.statusText);
    });
   } else {
     this.presentToast("Inserisci username e password");
   }
  
  }
  welcomePage(){
    this.navCtrl.push(Welcome);

  }


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
