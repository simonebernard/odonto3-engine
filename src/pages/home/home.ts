import { Component, ViewChild } from "@angular/core";
import { NavController, App, AlertController, NavParams } from "ionic-angular";

import { Common } from "../../providers/common";

import { AuthService } from "../../providers/auth-service";
import { Observable } from 'rxjs/Rx';


@Component({ selector: "page-home", templateUrl: "home.html" })
export class HomePage {
  @ViewChild("updatebox") updatebox;
  public userDetails: any;
  public resposeData: any;
  public dataSet: any;
  public grigliaSet: any;
  public noRecords: boolean;
  

  userPostData = {
    user_id: "",
    token: "",
    feed: "",
    feed_id: "",
    lastCreated: "",
    cod_ut: "",
    profilo:"",
    startDate:"",
    endDate:"",
    tipo:""
  };

  tipo_lavori = [];
  bocca = [];

  constructor(
    public common: Common,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public nav: NavController,
    public app: App,
    public authService: AuthService
  ) {
    const data = JSON.parse(localStorage.getItem("userData"));
    this.userDetails = data.userData;
    this.userPostData.user_id = this.userDetails.user_id;
    this.userPostData.token = this.userDetails.token;
    this.userPostData.cod_ut = this.userDetails.cod_ut;
    this.userPostData.profilo = this.userDetails.profilo;

    if ( this.userDetails.profilo == 2 ) {
      this.userDetails.name = "Dott. " + this.userDetails.name ; 
    }

    this.userPostData.lastCreated = "";
    this.noRecords = false
    //this.getFeed();
      
    //this.getStatini('first');

    Observable.interval(5000).subscribe(x => { // will execute every 30 seconds
       // this.getStatini('loop');
    });
  }

  getGrigliaDenti(cod_statino) {
    /*
    this.common.presentLoading();
    this.authService.postData(cod_statino, "getGrigliaDenti").then(
      result => {
        this.resposeData = result;
        if (this.resposeData.grigliaDentiData) {
          this.grigliaSet = this.resposeData.grigliaDentiData;
        }
      }, err => {

      }
    );
*/

  }

  public getStatini(message) {
    
    if (message=='first') this.common.presentLoading();
    this.authService.postData(this.userPostData, "getStatini").then(
      result => {
        this.resposeData = result;
        if (this.resposeData.statiniData) {

          
          if (message=='first') this.common.closeLoading();
          this.dataSet = this.resposeData.statiniData;

        } else {
          this.common.closeLoading();
          console.log("No data found");
        }
      },
      err => {
        //Connection failed message
      }
    );
  }


  feedUpdate() {
    if (this.userPostData.feed) {
      this.common.presentLoading();
      this.authService.postData(this.userPostData, "feedUpdate").then(
        result => {
          this.resposeData = result;
          if (this.resposeData.feedData) {
            this.common.closeLoading();
            this.dataSet.unshift(this.resposeData.feedData);
            this.userPostData.feed = "";

            //this.updatebox.setFocus();
            setTimeout(() => {
              //  this.updatebox.focus();
            }, 150);
          } else {
            console.log("No access");
          }
        },
        err => {
          //Connection failed message
        }
      );
    }
  }

  

  feedDelete(feed_id, msgIndex) {
    if (feed_id > 0) {
      let alert = this.alertCtrl.create({
        title: "Delete Feed",
        message: "Do you want to buy this feed?",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            }
          },
          {
            text: "Delete",
            handler: () => {
              this.userPostData.feed_id = feed_id;
              this.authService.postData(this.userPostData, "feedDelete").then(
                result => {
                  this.resposeData = result;
                  if (this.resposeData.success) {
                    this.dataSet.splice(msgIndex, 1);
                  } else {
                    console.log("No access");
                  }
                },
                err => {
                  //Connection failed message
                }
              );
            }
          }
        ]
      });
      alert.present();
    }
  }



  doInfinite(e): Promise<any> {
    console.log("Begin async operation");
    return new Promise(resolve => {
      setTimeout(() => {
        this.authService.postData(this.userPostData, "feed").then(
          result => {
            this.resposeData = result;
            if (this.resposeData.feedData.length) {
              const newData = this.resposeData.feedData;
              this.userPostData.lastCreated = this.resposeData.feedData[
                newData.length - 1
              ].created;

              for (let i = 0; i < newData.length; i++) {
                this.dataSet.push(newData[i]);
              }
            } else {
              this.noRecords = true;
              console.log("No user updates");
            }
          },
          err => {
            //Connection failed message
          }
        ).catch((error) => {
          //assert.isNotOk(error,'Promise error');
        });
        resolve();
      }, 500);
    });
  }

  converTime(time) {
    let a = new Date(time * 1000);
    return a;
  }

  backToWelcome() {
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  logout() {
    //Api Token Logout

    localStorage.clear();
    setTimeout(() => this.backToWelcome(), 1000);
  }
}

@Component({
  templateUrl: 'dettaglio-statino.html',
})
export class Dettaglio2StatinoPage {
  
  item;

  constructor(params: NavParams) {
    this.item = params.data.item;
  }
}
