webpackJsonp([4],{

/***/ 118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return HomePage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Dettaglio2StatinoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_common__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_service__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Rx__ = __webpack_require__(342);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_Rx__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HomePage = (function () {
    function HomePage(common, alertCtrl, navCtrl, nav, app, authService) {
        this.common = common;
        this.alertCtrl = alertCtrl;
        this.navCtrl = navCtrl;
        this.nav = nav;
        this.app = app;
        this.authService = authService;
        this.userPostData = {
            user_id: "",
            token: "",
            feed: "",
            feed_id: "",
            lastCreated: "",
            cod_ut: "",
            profilo: "",
            startDate: "",
            endDate: "",
            tipo: ""
        };
        this.tipo_lavori = [];
        this.bocca = [];
        var data = JSON.parse(localStorage.getItem("userData"));
        this.userDetails = data.userData;
        this.userPostData.user_id = this.userDetails.user_id;
        this.userPostData.token = this.userDetails.token;
        this.userPostData.cod_ut = this.userDetails.cod_ut;
        this.userPostData.profilo = this.userDetails.profilo;
        if (this.userDetails.profilo == 2) {
            this.userDetails.name = "Dott. " + this.userDetails.name;
        }
        this.userPostData.lastCreated = "";
        this.noRecords = false;
        //this.getFeed();
        //this.getStatini('first');
        __WEBPACK_IMPORTED_MODULE_4_rxjs_Rx__["Observable"].interval(5000).subscribe(function (x) {
            // this.getStatini('loop');
        });
    }
    HomePage.prototype.getGrigliaDenti = function (cod_statino) {
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
    };
    HomePage.prototype.getStatini = function (message) {
        var _this = this;
        if (message == 'first')
            this.common.presentLoading();
        this.authService.postData(this.userPostData, "getStatini").then(function (result) {
            _this.resposeData = result;
            if (_this.resposeData.statiniData) {
                if (message == 'first')
                    _this.common.closeLoading();
                _this.dataSet = _this.resposeData.statiniData;
            }
            else {
                _this.common.closeLoading();
                console.log("No data found");
            }
        }, function (err) {
            //Connection failed message
        });
    };
    HomePage.prototype.feedUpdate = function () {
        var _this = this;
        if (this.userPostData.feed) {
            this.common.presentLoading();
            this.authService.postData(this.userPostData, "feedUpdate").then(function (result) {
                _this.resposeData = result;
                if (_this.resposeData.feedData) {
                    _this.common.closeLoading();
                    _this.dataSet.unshift(_this.resposeData.feedData);
                    _this.userPostData.feed = "";
                    //this.updatebox.setFocus();
                    setTimeout(function () {
                        //  this.updatebox.focus();
                    }, 150);
                }
                else {
                    console.log("No access");
                }
            }, function (err) {
                //Connection failed message
            });
        }
    };
    HomePage.prototype.feedDelete = function (feed_id, msgIndex) {
        var _this = this;
        if (feed_id > 0) {
            var alert_1 = this.alertCtrl.create({
                title: "Delete Feed",
                message: "Do you want to buy this feed?",
                buttons: [
                    {
                        text: "Cancel",
                        role: "cancel",
                        handler: function () {
                            console.log("Cancel clicked");
                        }
                    },
                    {
                        text: "Delete",
                        handler: function () {
                            _this.userPostData.feed_id = feed_id;
                            _this.authService.postData(_this.userPostData, "feedDelete").then(function (result) {
                                _this.resposeData = result;
                                if (_this.resposeData.success) {
                                    _this.dataSet.splice(msgIndex, 1);
                                }
                                else {
                                    console.log("No access");
                                }
                            }, function (err) {
                                //Connection failed message
                            });
                        }
                    }
                ]
            });
            alert_1.present();
        }
    };
    HomePage.prototype.doInfinite = function (e) {
        var _this = this;
        console.log("Begin async operation");
        return new Promise(function (resolve) {
            setTimeout(function () {
                _this.authService.postData(_this.userPostData, "feed").then(function (result) {
                    _this.resposeData = result;
                    if (_this.resposeData.feedData.length) {
                        var newData = _this.resposeData.feedData;
                        _this.userPostData.lastCreated = _this.resposeData.feedData[newData.length - 1].created;
                        for (var i = 0; i < newData.length; i++) {
                            _this.dataSet.push(newData[i]);
                        }
                    }
                    else {
                        _this.noRecords = true;
                        console.log("No user updates");
                    }
                }, function (err) {
                    //Connection failed message
                }).catch(function (error) {
                    //assert.isNotOk(error,'Promise error');
                });
                resolve();
            }, 500);
        });
    };
    HomePage.prototype.converTime = function (time) {
        var a = new Date(time * 1000);
        return a;
    };
    HomePage.prototype.backToWelcome = function () {
        var root = this.app.getRootNav();
        root.popToRoot();
    };
    HomePage.prototype.logout = function () {
        //Api Token Logout
        var _this = this;
        localStorage.clear();
        setTimeout(function () { return _this.backToWelcome(); }, 1000);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])("updatebox"),
        __metadata("design:type", Object)
    ], HomePage.prototype, "updatebox", void 0);
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({ selector: "page-home",template:/*ion-inline-start:"C:\Users\berna\Desktop\odonto3_new\src\pages\home\home.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <img ion-right src="assets/imgs/odonto3_header.png" class="navbarLogo" />\n\n    <ion-title>Home</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <h2>Benvenuto {{userDetails.name}}</h2>\n\n  <ion-card>\n\n    <img src="assets/imgs/TenichePosturometriche.png"/>\n\n    <ion-card-content>\n\n      <ion-card-title><b>Laboratorio Odontotecnico</b>        \n\n        </ion-card-title>\n\n      <p>\n\n        Bernard & Mosella.\n\n\n\n      </p>\n\n    </ion-card-content>\n\n  </ion-card>\n\n  <!--\n\n\n\n  \n\n    <h2 class="center">Lavori recenti </h2>\n\n\n\n    <div *ngIf=\'dataSet!=""\'>   \n\n      <ion-list>\n\n          <ion-item *ngFor="let item of dataSet">\n\n              <ion-thumbnail item-left>\n\n                  <img src="assets/imgs/{{item.sesso}}.png">\n\n              </ion-thumbnail>\n\n              \n\n              <h2>{{ item.nome_cli }} {{ item.cognome_cli }} </h2>\n\n              <p> {{ item.DATA_TS |  date:\'dd/MM/yyyy HH:mm\' }} </p>\n\n              <p *ngIf=\'profilo!=2\'> {{item.medico}} </p>\n\n              \n\n              <button clear item-right (click)="openNavEditStatino(item,\'edit\')" >Modifica</button>              \n\n          </ion-item>\n\n      </ion-list>    \n\n  </div>\n\n  <div *ngIf=\' dataSet == "" \'> <h3>Nessuno lavoro recente</h3> </div>\n\n\n\n  <ion-infinite-scroll (ionInfinite)="$event.waitFor(doInfinite())" *ngIf="!noRecords">\n\n    <ion-infinite-scroll-content></ion-infinite-scroll-content>\n\n  </ion-infinite-scroll>\n\n-->\n\n</ion-content>'/*ion-inline-end:"C:\Users\berna\Desktop\odonto3_new\src\pages\home\home.html"*/ }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__providers_common__["a" /* Common */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* App */],
            __WEBPACK_IMPORTED_MODULE_3__providers_auth_service__["a" /* AuthService */]])
    ], HomePage);
    return HomePage;
}());

var Dettaglio2StatinoPage = (function () {
    function Dettaglio2StatinoPage(params) {
        this.item = params.data.item;
    }
    Dettaglio2StatinoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Users\berna\Desktop\odonto3_new\src\pages\home\dettaglio-statino.html"*/'<ion-header>\n\n        <ion-navbar>\n\n          <ion-title>\n\n            {{ item.title }}\n\n          </ion-title>\n\n        </ion-navbar>\n\n      </ion-header>\n\n      \n\n      <ion-content padding>\n\n      \n\n        <ion-item>\n\n          <ion-label>Data Entrata</ion-label>\n\n          <ion-datetime displayFormat="DD MMM YYYY" [(ngModel)]="item.de" name="{{ item.de }}" ></ion-datetime>\n\n        </ion-item>\n\n      \n\n        <ion-item>\n\n          <ion-label>Data Uscita</ion-label>\n\n          <ion-datetime displayFormat="DD MMM YYYY" [(ngModel)]="item.du" name="{{ item.du }}" ></ion-datetime>\n\n        </ion-item>\n\n      \n\n        <ion-item>\n\n          <ion-label stacked>Note</ion-label>\n\n          <ion-textarea type="text" rows="40"  [(ngModel)]="item.note" name=\'{{item.note}}\'></ion-textarea>\n\n        </ion-item>\n\n      \n\n      </ion-content>'/*ion-inline-end:"C:\Users\berna\Desktop\odonto3_new\src\pages\home\dettaglio-statino.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavParams */]])
    ], Dettaglio2StatinoPage);
    return Dettaglio2StatinoPage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Common; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/*
  Generated class for the Common provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var Common = (function () {
    function Common(loadingCtrl) {
        this.loadingCtrl = loadingCtrl;
        console.log('Hello Common Provider');
    }
    Common.prototype.presentLoading = function () {
        this.loader = this.loadingCtrl.create({ content: "Please wait ..." });
        this.loader.present();
    };
    Common.prototype.closeLoading = function () {
        this.loader.dismiss();
    };
    Common = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* LoadingController */]])
    ], Common);
    return Common;
}());

//# sourceMappingURL=common.js.map

/***/ }),

/***/ 156:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Login; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tabs_tabs__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__welcome_welcome__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_auth_service__ = __webpack_require__(58);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var Login = (function () {
    function Login(navCtrl, authService, toastCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.authService = authService;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.userData = { "username": "", "password": "" };
    }
    Login.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Login');
    };
    Login.prototype.login = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({ content: "Please wait..." });
        if (this.userData.username && this.userData.password) {
            loading.present();
            this.authService.postData(this.userData, "login").then(function (result) {
                _this.resposeData = result;
                if (_this.resposeData.userData) {
                    localStorage.setItem('userData', JSON.stringify(_this.resposeData));
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__tabs_tabs__["a" /* TabsPage */]);
                    loading.dismiss();
                }
                else {
                    _this.presentToast("Username and password non validi. Ripetere l'operazione ");
                    loading.dismiss();
                }
            }, function (err) {
                loading.dismiss();
                console.log("err", err);
                _this.presentToast(err.status + ' ' + err.statusText);
            });
        }
        else {
            this.presentToast("Inserisci username e password");
        }
    };
    Login.prototype.welcomePage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__welcome_welcome__["a" /* Welcome */]);
    };
    Login.prototype.presentToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    };
    Login = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-login',template:/*ion-inline-start:"C:\Users\berna\Desktop\odonto3_new\src\pages\login\login.html"*/'\n\n\n\n\n\n<ion-content padding>\n\n<ion-list>\n\n\n\n  <ion-item>\n\n    <ion-label fixed>Username</ion-label>\n\n    <ion-input type="text" value="" [(ngModel)]="userData.username"></ion-input>\n\n  </ion-item>\n\n\n\n  <ion-item>\n\n    <ion-label fixed>Password</ion-label>\n\n    <ion-input type="password" [(ngModel)]="userData.password"></ion-input>\n\n  </ion-item>\n\n\n\n  <button ion-button block color="primary" (click)="login()">Login</button>\n\n\n\n  <a href="#" (click)="welcomePage()">Welcome Page</a>\n\n\n\n\n\n</ion-list>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\berna\Desktop\odonto3_new\src\pages\login\login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */], __WEBPACK_IMPORTED_MODULE_4__providers_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* LoadingController */]])
    ], Login);
    return Login;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 157:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Signup; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_service__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__welcome_welcome__ = __webpack_require__(66);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var Signup = (function () {
    function Signup(navCtrl, authService, toastCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.authService = authService;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.userData = { "username": "", "password": "", "email": "", "name": "", "profilo": null };
    }
    Signup.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Signup');
    };
    Signup.prototype.signup = function () {
        var _this = this;
        console.log("signup");
        if (this.userData.username && this.userData.password && this.userData.email && this.userData.name && this.userData.profilo != null) {
            var loading_1 = this.loadingCtrl.create({ content: "Please wait..." });
            loading_1.present();
            this.authService.postData(this.userData, "signup").then(function (result) {
                _this.resposeData = result;
                if (_this.resposeData.userData) {
                    console.log(_this.resposeData);
                    localStorage.setItem('userData', JSON.stringify(_this.resposeData));
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
                    loading_1.dismiss();
                }
                else {
                    _this.presentToast("Please give valid username and password");
                    loading_1.dismiss();
                }
            }, function (err) {
                //Connection failed message
                console.log("err", err);
                _this.presentToast(err.status + ' ' + err.statusText);
            });
        }
        else {
            console.log("Give valid information.");
            this.presentToast("Give valid information.");
        }
    };
    Signup.prototype.welcomePage = function () {
        this
            .navCtrl
            .push(__WEBPACK_IMPORTED_MODULE_4__welcome_welcome__["a" /* Welcome */]);
    };
    Signup.prototype.codeSelected = function () {
        console.log("codeSelected", this.selectcategory);
    };
    Signup.prototype.presentToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    };
    Signup = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({ selector: 'page-signup',template:/*ion-inline-start:"C:\Users\berna\Desktop\odonto3_new\src\pages\signup\signup.html"*/'<ion-content padding>\n\n<ion-list>\n\n\n\n  <ion-item>\n\n    <ion-label fixed>Name</ion-label>\n\n    <ion-input type="text"  [(ngModel)]="userData.name"></ion-input>\n\n  </ion-item>\n\n\n\n  <ion-item>\n\n    <ion-label fixed>Email</ion-label>\n\n    <ion-input type="text"  [(ngModel)]="userData.email"></ion-input>\n\n  </ion-item>\n\n\n\n  <ion-item>\n\n    <ion-label fixed>Username</ion-label>\n\n    <ion-input type="text"  [(ngModel)]="userData.username"></ion-input>\n\n  </ion-item>\n\n\n\n  <ion-item>\n\n    <ion-label fixed>Password</ion-label>\n\n    <ion-input type="password" [(ngModel)]="userData.password"></ion-input>\n\n  </ion-item>\n\n\n\n  <ion-item>\n\n    <ion-label>Profile</ion-label>\n\n    <ion-select [(ngModel)]="userData.profilo">\n\n      <ion-option value="2">Doctor</ion-option>\n\n      <ion-option value="1">Tecnic</ion-option>\n\n    </ion-select>\n\n  </ion-item>\n\n\n\n  \n\n\n\n  <button ion-button block color="primary" (click)="signup()">Signup</button>\n\n  \n\n  <a href="#" (click)="welcomePage()">Welcome Page</a>\n\n</ion-list>\n\n</ion-content>'/*ion-inline-end:"C:\Users\berna\Desktop\odonto3_new\src\pages\signup\signup.html"*/ }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* LoadingController */]])
    ], Signup);
    return Signup;
}());

//# sourceMappingURL=signup.js.map

/***/ }),

/***/ 170:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 170;

/***/ }),

/***/ 215:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/calendario/calendario.module": [
		842,
		3
	],
	"../pages/login/login.module": [
		843,
		2
	],
	"../pages/signup/signup.module": [
		844,
		1
	],
	"../pages/welcome/welcome.module": [
		845,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 215;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 339:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContactPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ContactPage = (function () {
    function ContactPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ContactPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-contact',template:/*ion-inline-start:"C:\Users\berna\Desktop\odonto3_new\src\pages\contact\contact.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <img ion-right src="assets/imgs/odonto3_header.png" class="navbarLogo" />\n\n    <ion-title>Contatti</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <ion-list>\n\n\n\n    <ion-list-header>Indirizzo</ion-list-header>\n\n    <ion-item>\n\n      <ion-icon name="ionic" item-left></ion-icon>\n\n      Corso Vittorio Emanuele, <br /> 110 - 80121 Napoli\n\n    </ion-item>\n\n\n\n    <ion-list-header>Numeri di telefono</ion-list-header>\n\n    <ion-item>\n\n      <ion-icon name="ionic" item-left></ion-icon>\n\n      Tel. +39 081 660784 <br /> 081 2157190 \n\n      <button data-href="tel:3395342838" secondary clear item-right>\n\n        <ion-icon name="call"></ion-icon>\n\n         Chiama\n\n     </button>\n\n    </ion-item>\n\n\n\n    <ion-list-header>Email</ion-list-header>\n\n    <ion-item>\n\n      <ion-icon name="mail" item-left></ion-icon>\n\n      bernardmosella@gmail.com\n\n      <button data-href="mailto:bernardmosella@gmail.com" secondary clear item-right>\n\n        <ion-icon name="call"></ion-icon>\n\n         Scrivici\n\n     </button>\n\n    </ion-item>\n\n    \n\n\n\n  </ion-list>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\berna\Desktop\odonto3_new\src\pages\contact\contact.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */]])
    ], ContactPage);
    return ContactPage;
}());

//# sourceMappingURL=contact.js.map

/***/ }),

/***/ 47:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return StatinoPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DettaglioStatinoPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CercaStatinoPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return FotoStatinoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__ = __webpack_require__(435);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_common__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_auth_service__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__tabs_tabs__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_forms__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ionic_selectable__ = __webpack_require__(437);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var StatinoPage = (function () {
    function StatinoPage(params, common, nav, alertCtrl, navCtrl, authService, formBuilder) {
        this.common = common;
        this.nav = nav;
        this.alertCtrl = alertCtrl;
        this.navCtrl = navCtrl;
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.tipo_lavori = [];
        this.bocca = [];
        this.calendarEvent = {};
        this.validation = {};
        this.attendees = [{
                email: ""
            }];
        this.modalita = 'NEW';
        this.profilo = '';
        this.visualizzastatini = false;
        this.cod_ut = '';
        this.medico = '';
        this.paziente = '';
        this.sesso = '';
        this.sex = '';
        this.editPaziente = {};
        this.clienti = [];
        this.odontoiatra = [];
        this.arrToSend = [];
        this.noteEmail = [];
        this.removeByAttr = function (arr, attr, value) {
            var i = arr.length;
            var obj = {};
            while (i--) {
                if (arr[i]
                    && arr[i].hasOwnProperty(attr)
                    && (arguments.length > 2 && arr[i][attr] === value)) {
                    obj = arr[i];
                    arr.splice(i, 1);
                }
            }
            return { "arr": JSON.stringify(arr), "obj": obj };
        };
        this.customerNameControl = this.formBuilder.control(null, __WEBPACK_IMPORTED_MODULE_6__angular_forms__["f" /* Validators */].required);
        this.customerSurnameControl = this.formBuilder.control(null, __WEBPACK_IMPORTED_MODULE_6__angular_forms__["f" /* Validators */].required);
        this.customerCityControl = this.formBuilder.control(null, __WEBPACK_IMPORTED_MODULE_6__angular_forms__["f" /* Validators */].required);
        this.customerBirthdateControl = this.formBuilder.control(null, __WEBPACK_IMPORTED_MODULE_6__angular_forms__["f" /* Validators */].required);
        this.customerGenderControl = this.formBuilder.control(null, __WEBPACK_IMPORTED_MODULE_6__angular_forms__["f" /* Validators */].required);
        this.newCustomerForm = this.formBuilder.group({
            sureName: this.customerSurnameControl,
            firstName: this.customerNameControl,
            birthDate: this.customerBirthdateControl,
            customerCity: this.customerCityControl,
            gender: this.customerGenderControl
        });
        this.clientiPostData = [{
                'cod_ut': "", 'cod_cli': "", 'nome': "", 'cognome': "", 'data_nascita': "", 'sesso': ""
            }];
        this.aggiornaAbilitaSalva = {
            'paziente': false,
            'dente': false,
            'lavoro': false
        };
        var data = JSON.parse(localStorage.getItem("userData"));
        this.userDetails = data.userData;
        this.profilo = this.userDetails.profilo;
        this.clientiPostData.cod_ut = this.userDetails.cod_ut;
        this.sesso = '';
        this.preventivo = localStorage.getItem("preventivo");
        this.titoloHeader = 'Inserisci Lavoro';
        if (this.preventivo == 'true') {
            this.titoloHeader = 'Richiedi preventivo';
        }
        this.bocca = this.setBocca();
        this.tipo_lavori = this.setLavori();
        if (this.userDetails.profilo == "1") {
            this.getMedico();
            this.abilitaSalva = 4;
        }
        if (this.userDetails.profilo == "2") {
            if (sessionStorage.getItem("clienti") == null) {
                this.getClienti();
            }
            else {
                this.clienti = JSON.parse(sessionStorage.getItem("clienti"));
            }
            this.abilitaSalva = 3;
        }
        if (params.data.edit == null && (localStorage.getItem('cod_statino') == null || localStorage.getItem('cod_statino') == '')) {
            console.log('setMaxStatino on');
            this.setMaxStatino();
        }
        else {
            console.log('MaxStatino is already setted, cod_statino = ' + localStorage.getItem('cod_statino'));
        }
        //Provengo dal cerca lavori    
        if (params.data.edit != null) {
            console.log(params.data.edit);
            var data_1 = params.data.edit;
            var lavori = data_1.lavori;
            var griglia_denti = data_1.griglia_denti;
            this.tipo_lavori = JSON.parse(lavori);
            this.bocca = JSON.parse(griglia_denti);
            this.Cod_Statino = data_1.Cod_Statino;
            console.log('get Statino from edit , cod_statino = ' + this.Cod_Statino);
            this.cli_cod_cli = data_1.cli_cod_cli;
            this.modalita = 'EDIT';
            this.titoloHeader = 'Modifica Lavoro';
            this.editPaziente = { "sesso": data_1.sesso, "nome_cli": data_1.nome_cli, "cognome_cli": data_1.cognome_cli };
        }
    }
    StatinoPage.prototype.setLavori = function () {
        //Deve diventare dinamica e prelevare solo una volta dal db
        return [
            {
                'title': 'Provvisori',
                'name': 'provvisori',
                'de': '',
                'du': '',
                'icon': 'arrow-forward',
                'note': '',
                'color': '#E63135',
                'id_google_event': ''
            },
            {
                'title': 'P.Struttura',
                'name': 'p-struttura',
                'de': '',
                'du': '',
                'icon': 'arrow-forward',
                'note': '',
                'color': '#0CA9EA',
                'id_google_event': ''
            },
            {
                'title': 'P.Ceramica',
                'name': 'p-ceramica',
                'de': '',
                'du': '',
                'icon': 'arrow-forward',
                'note': '',
                'color': '#F46529',
                'id_google_event': ''
            },
            {
                'title': 'P.Mobile',
                'name': 'p-mobile',
                'de': '',
                'du': '',
                'icon': 'arrow-forward',
                'note': '',
                'color': '#F46520',
                'id_google_event': ''
            },
            {
                'title': 'Altro',
                'name': 'altro',
                'de': '',
                'du': '',
                'icon': 'arrow-forward',
                'note': '',
                'color': '#FFD439',
                'id_google_event': ''
            },
        ];
    };
    StatinoPage.prototype.setBocca = function () {
        var bocca = [
            {
                'sezione': '1',
                'denti': [
                    { 'id': '18', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 7 },
                    { 'id': '17', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 6 },
                    { 'id': '16', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 5 },
                    { 'id': '15', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 4 },
                    { 'id': '14', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 3 },
                    { 'id': '13', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 2 },
                    { 'id': '12', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 1 },
                    { 'id': '11', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 0 },
                    { 'id': '21', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 0 },
                    { 'id': '22', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 1 },
                    { 'id': '23', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 2 },
                    { 'id': '24', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 3 },
                    { 'id': '25', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 4 },
                    { 'id': '26', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 5 },
                    { 'id': '27', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 6 },
                    { 'id': '28', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base', 'colonna': 7 },
                ]
            },
            {
                'sezione': '2',
                'denti': [
                    { 'id': '48', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '47', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '46', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '45', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '44', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '43', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '42', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '41', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '31', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '32', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '33', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '34', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '35', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '36', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '37', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' },
                    { 'id': '38', 'impianto': 0, 'moncone': 0, 'ponti': 0, 'classe': 'base' }
                ]
            }
        ];
        return bocca;
    };
    StatinoPage.prototype.searchPaziente = function (event) {
        var _this = this;
        console.log("searchPaziente", event);
        var text = event.text.trim();
        if (this.customersSubscription) {
            this.customersSubscription.unsubscribe();
        }
        if (!text) {
            if (this.customersSubscription) {
                this.customersSubscription.unsubscribe();
            }
            event.component.items = [];
            event.component.endSearch();
            return;
        }
        event.component.items = this.clienti.filter(function (item) {
            var str = item.nome_cognome;
            if (str == undefined) {
                str = _this.clienti[_this.clienti.length - 1].cognome_nome;
            }
            if (str.toUpperCase().indexOf(text) >= 0 || str.toLowerCase().indexOf(text) >= 0 || str.indexOf(text) >= 0) {
                _this.cli_cod_cli = item.cod_cli;
                _this.customerNameControl.setValue(item.firstName);
                console.log(str + ' - ' + text);
                console.log(str.indexOf(text));
                return true;
            }
            return false;
        });
        event.component.endSearch();
    };
    StatinoPage.prototype.onSearchFail = function (event) {
        if (event.component.hasSearchText) {
            console.log("onSearchFail", event.component.searchText);
        }
    };
    StatinoPage.prototype.onSearchSuccess = function (event) {
        // Hide form.    
        event.component.hideAddItemTemplate();
    };
    StatinoPage.prototype.onAddPaziente = function (event) {
        // Clean form.
        this.customerSurnameControl.reset();
        this.customerNameControl.reset();
        this.customerCityControl.reset();
        this.customerBirthdateControl.reset();
        this.customerGenderControl.reset();
        event.component.showAddItemTemplate();
    };
    StatinoPage.prototype.addPaziente = function (event) {
        var _this = this;
        // Create port.
        var data = JSON.parse(localStorage.getItem("userData"));
        this.customer = {
            sureName: this.customerSurnameControl.value,
            firstName: this.customerNameControl.value,
            customerCity: this.customerCityControl.value,
            birthDate: this.customerBirthdateControl.value,
            gender: this.customerGenderControl.value,
            user_id: data['userData']['user_id'],
            profilo: data['userData']['profilo'],
            cod_ut: this.medico != '' ? this.medico : data['userData']['cod_ut']
        };
        // Add port to storage.
        this.authService.postData(this.customer, "creaCliente").then(function (result) {
            console.log("creaCliente");
            var tmpClienti = JSON.parse(sessionStorage.getItem("clienti"));
            tmpClienti.push(result['retGetCli'][0]);
            sessionStorage.setItem("clienti", JSON.stringify(tmpClienti));
            _this.clienti.push({
                cod_ut: _this.medico != '' ? _this.medico : data['userData']['cod_ut'],
                cod_cli: result['cod_cli'],
                cognome: _this.customerSurnameControl.value,
                nome: _this.customerNameControl.value,
                cognome_nome: _this.customerSurnameControl.value + ' ' + _this.customerNameControl.value,
                data_nascita: _this.customerBirthdateControl.value,
                sesso: _this.customerGenderControl.value
            });
            var cli = [];
            cli.push({
                cod_ut: _this.medico != '' ? _this.medico : data['userData']['cod_ut'],
                cod_cli: result['cod_cli'],
                cognome: _this.customerSurnameControl.value,
                nome: _this.customerNameControl.value,
                cognome_nome: _this.customerSurnameControl.value + ' ' + _this.customerNameControl.value,
                data_nascita: _this.customerBirthdateControl.value,
                sesso: _this.customerGenderControl.value
            });
            _this.customerComponent.addItem(cli).then(function () {
                _this.customerComponent.search(cli[0].cognome_nome);
            });
            _this.customerSurnameControl.reset();
            _this.customerNameControl.reset();
            _this.customerCityControl.reset();
            _this.customerBirthdateControl.reset();
            // Show list.
            _this.customerComponent.hideAddItemTemplate();
        }, function (err) {
        });
    };
    StatinoPage.prototype.setStatino = function (lavori, griglia_denti, cod_statino, flag, event) {
        console.log("1)", lavori);
        this.tipo_lavori = lavori;
        console.log("2)", griglia_denti);
        this.bocca = griglia_denti;
        this.Cod_Statino = cod_statino;
        this.aggiornaAbilitaSalva['lavoro'] = flag > 0;
        this.aggiornaAbilitaSalva['dente'] = flag > 0;
        this.aggiornaAbilitaSalva['paziente'] = flag > 0;
        this.AbilitaSalva('lavoro');
        this.AbilitaSalva('paziente');
        this.AbilitaSalva('dente');
        this.modalita = 'EDIT';
        this.titoloHeader = 'Modifica Lavoro';
        this.editPaziente = { "sesso": event["value"].sesso, "nome_cli": event["value"].nome, "cognome_cli": event["value"].cognome };
    };
    StatinoPage.prototype.visualizzaListaStatini = function () {
        console.log("visualizzaListaStatini");
        try {
            this.nav.push(CercaStatinoPage, { event: this.event });
        }
        catch (error) {
            console.error(error.stack);
        }
    };
    StatinoPage.prototype.onChangePaziente = function (event) {
        var _this = this;
        console.log("onChangePaziente");
        this.abilitaSalva = 3;
        if (event["value"] != null && event["value"] !== undefined) {
            var flag = 1;
            if (event["value"].cod_statino != null)
                flag--;
            if (flag > 0) {
                this.tipo_lavori = this.setLavori();
                this.bocca = this.setBocca();
                this.aggiornaAbilitaSalva['paziente'] = false;
                this.AbilitaSalva('paziente');
            }
            else {
                var alert = this.alertCtrl.create({
                    title: 'Il paziente ha già un lavoro in corso.',
                    subTitle: '',
                    buttons: [{
                            text: 'Visualizza gli statini',
                            handler: function () {
                                //this.visualizzaListaStatini(event,flag);
                                _this.event = event;
                                _this.nav.push(CercaStatinoPage, { event: event });
                                _this.visualizzastatini = true;
                            }
                        }, {
                            text: 'Crea nuovo statino',
                            handler: function () {
                                _this.tipo_lavori = _this.setLavori();
                                _this.bocca = _this.setBocca();
                                _this.AbilitaSalva('paziente');
                                _this.event = event;
                                _this.visualizzastatini = true;
                            }
                        }], enableBackdropDismiss: false
                });
                alert.present();
            }
        }
    };
    StatinoPage.prototype.onSavePaziente = function (event) {
        // Fill form.
        var item = event['item'];
        console.log("onSavePaziente", item);
        this.customer = item;
        this.customerNameControl.setValue(item.nome);
        this.customerSurnameControl.setValue(item.cognome);
        this.customerCityControl.setValue(item.luogo_di_nascita);
        this.customerBirthdateControl.setValue(item.data_nascita);
        this.customerGenderControl.setValue(item.sesso);
        // Show form.
        event.component.showAddItemTemplate();
    };
    StatinoPage.prototype.savePaziente = function (event) {
        var _this = this;
        this.customerComponent.showLoading();
        console.log("savePaziente", event);
        this.customer = {
            sureName: this.customerSurnameControl.value,
            firstName: this.customerNameControl.value,
            customerCity: this.customerCityControl.value,
            birthDate: this.customerBirthdateControl.value,
            gender: this.customerGenderControl.value,
            cod_ut: this.customer.cli_cod_ut,
            cod_cli: this.customer.cli_cod_cli
        };
        console.log(this.customer);
        // Add port to storage.
        this.authService.postData(this.customer, "creaCliente").then(function (result) {
            console.log("result", result);
            _this.customerSurnameControl.reset();
            _this.customerNameControl.reset();
            _this.customerCityControl.reset();
            _this.customerBirthdateControl.reset();
            _this.customerGenderControl.reset();
            // Show list.
            _this.customerComponent.hideAddItemTemplate();
        }, function (err) {
            console.error("creaCliente", err);
        });
        this.customerComponent.hideAddItemTemplate();
        this.customerComponent.hideLoading();
    };
    StatinoPage.prototype.setMaxStatino = function () {
        var _this = this;
        var tmpToSend = this.userDetails;
        console.log('setMaxStatino');
        this.authService.postData(tmpToSend, "setMaxStatino").then(function (result) {
            console.log("result", result);
            _this.resultSetMaxStatino = result;
            if (_this.resultSetMaxStatino.status == 'OK') {
                _this.Cod_Statino = _this.resultSetMaxStatino.cod_statino;
                localStorage.setItem('cod_statino', _this.Cod_Statino);
                localStorage.setItem('id_google_folder', _this.resultSetMaxStatino.id_google_folder);
            }
            else {
                console.log('setMaxStatino error:' + _this.resultSetMaxStatino.msg);
            }
        }, function (err) {
            //gestione errore clienti 
        });
    };
    StatinoPage.prototype.AbilitaSalva = function (key, val) {
        if (val === void 0) { val = ''; }
        //console.log('AbilitaSalva',key);
        if (!this.aggiornaAbilitaSalva[key] && key != 'dente') {
            this.aggiornaAbilitaSalva[key] = true;
            console.log('Decremento da ' + key);
            this.abilitaSalva--;
        }
        else {
            if (!this.aggiornaAbilitaSalva[key]) {
                this.aggiornaAbilitaSalva[key] = true;
                console.log('Decremento abilitaSalva');
                this.abilitaSalva--;
            }
            else if (this.aggiornaAbilitaSalva[key] && val == 'base') {
                var temp = false;
                for (var index = 0; index < this.bocca.length; index++) {
                    var arcata = this.bocca[index];
                    for (var j = 0; j < arcata.denti.length; j++) {
                        var dente = arcata.denti[j];
                        if (dente.classe != 'base') {
                            //esiste un dente con un lavoro
                            console.log('#' + dente.id + '|' + dente.classe);
                            temp = true;
                        }
                    }
                }
                if (!temp) {
                    this.aggiornaAbilitaSalva[key] = false;
                    console.log('Incremento abilitaSalva');
                    this.abilitaSalva++;
                }
                else {
                    console.log('NON Incremento abilitaSalva');
                }
            }
            else if (!this.aggiornaAbilitaSalva[key] && val != 'base') {
                console.log('Decremento abilitaSalva');
                this.abilitaSalva--;
            }
        }
    };
    StatinoPage.prototype.getClienti = function () {
        var _this = this;
        console.log("getClienti");
        this.common.presentLoading();
        var tmpToSend = '';
        if (this.medico == '') {
            tmpToSend = this.clientiPostData.cod_ut;
        }
        else {
            tmpToSend = this.medico;
        }
        this.authService.postData(tmpToSend, "getClienti").then(function (result) {
            _this.CliResposeData = result;
            if (_this.CliResposeData.cliData) {
                _this.common.closeLoading();
                _this.clienti = _this.CliResposeData.cliData;
                console.log("this.clienti", _this.clienti);
                sessionStorage.setItem("clienti", JSON.stringify(_this.clienti));
            }
        }, function (err) {
            _this.common.closeLoading();
            var alert = _this.alertCtrl.create({
                title: 'Qualcosa è andato storto!',
                subTitle: err.statusText,
                buttons: [{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: function () {
                            _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__tabs_tabs__["a" /* TabsPage */]);
                        }
                    }], enableBackdropDismiss: false
            });
            alert.present();
        });
    };
    StatinoPage.prototype.getMedico = function () {
        var _this = this;
        this.common.presentLoading();
        this.authService.postData(this.mediciPostData, "getMedici").then(function (result) {
            _this.mediciResponseData = result;
            //console.log(this.mediciResponseData) ;
            if (_this.mediciResponseData.mediciData) {
                _this.common.closeLoading();
                _this.odontoiatra = _this.mediciResponseData.mediciData;
                console.log('getMedico');
                _this.abilitaSalva--;
            }
        }, function (err) {
            _this.common.closeLoading();
            var alert = _this.alertCtrl.create({
                title: 'Qualcosa è andato storto!',
                subTitle: err.statusText,
                buttons: [{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: function () {
                            _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__tabs_tabs__["a" /* TabsPage */]);
                        }
                    }]
            });
            alert.present();
        });
    };
    StatinoPage.prototype.annullaStatino = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__tabs_tabs__["a" /* TabsPage */]);
    };
    StatinoPage.prototype.saveStatino = function (mod) {
        var _this = this;
        console.log(mod + " Statino ");
        console.log("tipo_lavori", this.tipo_lavori);
        if (this.Cod_Statino == null) {
            this.Cod_Statino = localStorage.getItem('cod_statino');
        }
        this.arrToSend[0] = this.bocca;
        this.arrToSend[1] = this.tipo_lavori;
        this.arrToSend[2] = this.paziente['cli_cod_cli'] == undefined ? this.cli_cod_cli : this.paziente['cli_cod_cli'];
        this.arrToSend[3] = this.userDetails.cod_ut;
        if (this.medico == '') {
            this.arrToSend[4] = this.clientiPostData.cod_ut;
        }
        else {
            this.arrToSend[4] = this.medico;
        }
        this.arrToSend[5] = this.Cod_Statino;
        this.arrToSend[6] = this.preventivo;
        this.arrToSend[7] = this.modalita;
        var arrNote = {};
        arrNote['superiore'] = '';
        arrNote['inferiore'] = '';
        for (var index = 1; index <= this.noteEmail.length; index++) {
            if (this.noteEmail[index] != undefined) {
                arrNote['superiore'] = index <= 28 ? arrNote['superiore'] + ', ' + this.noteEmail[index] : arrNote['superiore'];
                arrNote['inferiore'] = index > 28 ? arrNote['inferiore'] + ', ' + this.noteEmail[index] : arrNote['inferiore'];
            }
        }
        arrNote['superiore'] = arrNote['superiore'].substring(1);
        arrNote['inferiore'] = arrNote['inferiore'].substring(1);
        this.arrToSend[8] = arrNote;
        this.common.presentLoading();
        this.authService.postData(this.arrToSend, "salvaStatino").then(function (result) {
            _this.resposeData = result;
            console.log(_this.resposeData);
            if (_this.resposeData.statinoSalvato == 'OK') {
                sessionStorage.removeItem(_this.arrToSend[2]);
                //let tmpClienti = JSON.parse(sessionStorage.getItem("clienti"));
                //var retObj = this.removeByAttr(tmpClienti, 'cli_cod_cli', this.arrToSend[2]);
                //console.log("this.resposeData",this.resposeData)
                //tmpClienti.push(result['retGetCli'][0]);
                //sessionStorage.setItem("clienti",JSON.stringify(tmpClienti));
                _this.common.closeLoading();
                var alert = _this.alertCtrl.create({
                    title: 'Statino ' + mod == 'EDIT' ? 'aggiornato' : 'salvato' + ' correttamente',
                    subTitle: 'Codice lavoro : ' + _this.Cod_Statino,
                    buttons: [{
                            text: 'OK',
                            handler: function () {
                                _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__tabs_tabs__["a" /* TabsPage */]);
                            }
                        }], enableBackdropDismiss: false
                });
                alert.present();
                if (_this.Cod_Statino == localStorage.getItem('cod_statino')) {
                    localStorage.setItem('cod_statino', '');
                    localStorage.setItem('id_google_folder', '');
                    _this.setMaxStatino();
                }
            }
        }, function (err) {
            //gestione errore clienti 
            console.log(err);
            _this.common.closeLoading();
            var alert = _this.alertCtrl.create({
                title: 'Qualcosa è andato storto!',
                subTitle: err.statusText,
                buttons: [{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: function () {
                            _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__tabs_tabs__["a" /* TabsPage */]);
                        }
                    }], enableBackdropDismiss: false
            });
            alert.present();
        });
    };
    StatinoPage.prototype.visualizzaData = function (a) {
        var myData = a.split("-");
        var tmp = myData[2];
        if (tmp.indexOf('T') < 0) {
            return myData[2] + '/' + myData[1] + '/' + myData[0];
        }
        else {
            var myData2 = tmp.split("T");
            return myData2[0] + '/' + myData[1] + '/' + myData[0];
        }
    };
    StatinoPage.prototype.verificaDeDu = function (item) {
        if (item.de != '' && item.du != '') {
            this.AbilitaSalva('lavoro');
            return true;
        }
    };
    StatinoPage.prototype.openNavDetailsDenti = function (indice, jndice, item) {
        var _this = this;
        console.log('Dente:' + item['id']);
        var alert = this.alertCtrl.create();
        alert.setTitle('Dente numero ' + item['id']);
        for (var key in item) {
            if (key != 'id' && key != 'classe' && key != 'colonna') {
                var v = item[key];
                alert.addInput({
                    type: 'checkbox',
                    label: this.capitalizeFirstLetter(key),
                    name: 'input-' + key,
                    id: 'input-' + key,
                    value: key,
                    checked: Boolean(v),
                });
            }
        }
        alert.setCssClass('pippo');
        alert.addButton('Cancel');
        alert.addButton({
            text: 'Ok',
            handler: function (data) {
                for (var key in item) {
                    if (key != 'id' && key != 'classe') {
                        _this.bocca[indice].denti[jndice][key] = 0;
                    }
                }
                _this.bocca[indice].denti[jndice]['classe'] = 'base';
                var classe_css = '';
                for (var k in data) {
                    _this.bocca[indice].denti[jndice][data[k]] = 1;
                    classe_css += data[k] + '_';
                }
                classe_css = classe_css.substring(0, classe_css.length - 1);
                if (classe_css == '')
                    classe_css = 'base';
                _this.bocca[indice].denti[jndice]['classe'] = classe_css;
                _this.AbilitaSalva('dente', _this.bocca[indice].denti[jndice]['classe']);
                if (_this.bocca[indice].denti[jndice]['classe'] === 'base') {
                    delete _this.noteEmail[item['id']];
                }
                else {
                    _this.noteEmail[item['id']] = item['id'] + ' - ' + _this.bocca[indice].denti[jndice]['classe'];
                }
                console.log(_this.noteEmail);
            }
        });
        alert.present();
    };
    StatinoPage.prototype.capitalizeFirstLetter = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    StatinoPage.prototype.openNavDetailsPage = function (item) {
        console.log('openNavDetailsPage', item);
        item.cod_statino = this.Cod_Statino;
        item.modalita = this.modalita;
        this.nav.push(DettaglioStatinoPage, { item: item });
    };
    StatinoPage.prototype.openFotosPage = function (item) {
        this.nav.push(FotoStatinoPage, { item: item });
    };
    StatinoPage.prototype.buildISODate = function (date, time) {
        var dateArray = date && date.split('-');
        var timeArray = time && time.split(':');
        var normalDate = new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]), parseInt(timeArray[0]), parseInt(timeArray[1]), 0, 0);
        return normalDate.toISOString();
    };
    StatinoPage.prototype.addAttendees = function () {
        if (this.attendees[this.attendees.length - 1].email == '')
            return;
        var newAttendee = { email: "" };
        this.attendees.unshift(newAttendee);
    };
    StatinoPage.prototype.removeAttendees = function (itemIndex) {
        this.attendees.splice(itemIndex, 1);
    };
    StatinoPage.prototype.popLastAttendeeIfEmpty = function (itemsList) {
        if (!!itemsList.length) {
            return itemsList[0]["email"] == "" ? itemsList.shift(itemsList[0]) : itemsList;
        }
        return [];
    };
    StatinoPage.prototype.validate = function () {
        return this.isStringValid(this.calendarEvent.name) &&
            this.isStringValid(this.calendarEvent.name) &&
            this.isStringValid(this.calendarEvent.location) &&
            this.isStringValid(this.calendarEvent.description) &&
            this.isStringValid(this.calendarEvent.startDate) &&
            this.isStringValid(this.calendarEvent.startTime) &&
            this.isStringValid(this.calendarEvent.endDate) &&
            this.isStringValid(this.calendarEvent.endTime) &&
            this.areAttendeesValid(this.attendees);
    };
    StatinoPage.prototype.isStringValid = function (str) {
        if (typeof str != 'undefined' && str) {
            return true;
        }
        ;
        return false;
    };
    StatinoPage.prototype.areAttendeesValid = function (attendees) {
        if (attendees.length == 1 && !this.isStringValid(attendees[0]["email"])) {
            return false;
        }
        return true;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('customerComponent'),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_7_ionic_selectable__["a" /* IonicSelectableComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_7_ionic_selectable__["a" /* IonicSelectableComponent */]) === "function" && _a || Object)
    ], StatinoPage.prototype, "customerComponent", void 0);
    StatinoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-statino',template:/*ion-inline-start:"C:\Users\berna\Desktop\odonto3_new\src\pages\statino\statino.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>      \n    </button>\n    <ion-title>{{titoloHeader}}</ion-title>\n    <ion-buttons end>\n      <img *ngIf=\'visualizzastatini === false\' ion-right src="assets/imgs/odonto3_header.png" class="navbarLogo" />\n      <button *ngIf=\'visualizzastatini !== false\' ion-button large (click)="visualizzaListaStatini()">\n        Visualizza gli statini        \n      </button>\n      <ion-icon name="arrow-forward-sharp" ion-right ></ion-icon>\n\n  </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content>\n\n  <ion-list *ngIf=\'profilo != 2\'>\n    <ion-item>\n      <ion-label>Odontoiatra</ion-label>\n      <ion-select [(ngModel)]="medico" (ionChange)="getClienti()">\n        <ion-option *ngFor="let odo of odontoiatra" [value]="odo.cod_utente">{{odo.nome}} {{odo.cognome}} </ion-option>\n      </ion-select>\n    </ion-item>\n  </ion-list>\n\n  <ion-list *ngIf=\'modalita == "NEW"\'>\n    <ion-item>\n      <ion-label>Paziente</ion-label>\n      <ionic-selectable \n      #customerComponent\n      item-content \n      searchPlaceholder="" \n      [searchFailText]="\'Nessun paziente trovato\'" \n      [(ngModel)]="paziente" \n      itemValueField="cli_cod_cli" \n      itemTextField="cognome_nome" \n      [(items)]="clienti"\n      [canSearch]="true" \n      [canClear]="true" \n      [canAddItem]="true" \n      [canSaveItem]="true" \n      [canDeleteItem]="true" \n      (onSearch)="searchPaziente($event)"\n      (onSearchFail)="onSearchFail($event)" \n      (onSearchSuccess)="onSearchSuccess($event)"\n      (onAddItem)="onAddPaziente($event)"\n      (onSaveItem)="onSavePaziente($event)" \n      (onChange)="onChangePaziente($event)">\n      <ng-template ionicSelectableItemTemplate let-cliente="item">        \n        <div id="{{cliente.cli_cod_cli}}" [ngStyle]="cliente.sesso==\'M\' && {\'background-color\':\'#cdfff4\'} || {\'background-color\': \'#fcc7ff\'}">\n            {{cliente.cognome_nome}} - {{cliente.data_nascita}}  - {{cliente.cli_cod_cli}}           \n        </div>\n      </ng-template>\n      <ng-template ionicSelectableAddItemTemplate let-cliente="item" let-isAdd="isAdd">\n				<form [formGroup]="newCustomerForm" novalidate>\n					<ion-list>\n            <ion-item-divider>{{isAdd ? \'Aggiungi\' : \'Modifica\'}} paziente</ion-item-divider>\n            <ion-item-divider *ngIf="isAdd">Nessun paziente trovato</ion-item-divider>\n						<ion-item>\n              <ion-label>Cognome</ion-label>\n              {{isAdd ? \'\' : item}}\n              <ion-input type="text" formControlName="sureName" autocorrect="off" autocapitalize="none">\n							</ion-input>\n            </ion-item>\n            <ion-item>\n							<ion-label>Nome</ion-label>\n							<ion-input type="text" formControlName="firstName" autocorrect="off" autocapitalize="none">\n							</ion-input>\n            </ion-item>\n            <ion-item>\n              <ion-label>Data di nascita</ion-label>\n              <ion-datetime formControlName="birthDate" display-format="MMMM YYYY"></ion-datetime>\n            </ion-item>\n            <ion-item>\n							<ion-label>Luogo di nascita</ion-label>\n							<ion-input type="text" formControlName="customerCity" autocorrect="off" autocapitalize="none">\n							</ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>Sesso</ion-label>\n                <ion-select placeholder="Seleziona" formControlName="gender">\n                  <ion-option value="F">Femmina</ion-option>\n                  <ion-option value="M">Maschio</ion-option>\n                </ion-select>\n              </ion-item>\n					</ion-list>\n				</form>\n				<ion-footer>\n					<ion-toolbar>\n						<ion-row>\n							<ion-col col-6>\n								<button ion-button full no-margin (click)="customerComponent.hideAddItemTemplate()">\n                  Cancel\n                </button>\n              </ion-col>\n              <ion-col col-6>\n                <button ion-button full no-margin (click)="isAdd ? addPaziente() : savePaziente(port)" [disabled]="!newCustomerForm.valid">\n                  {{isAdd ? \'Add\' : \'Save\'}}\n                </button>\n              </ion-col>\n            </ion-row>\n          </ion-toolbar>\n        </ion-footer>\n      </ng-template>\n     </ionic-selectable>\n  </ion-item>\n  </ion-list>\n\n  <ion-list *ngIf=\'modalita == "EDIT"\'>\n    <ion-card>\n      <ion-card-content>\n        <ion-card-title>          \n          {{editPaziente.nome_cli}} {{editPaziente.cognome_cli}}\n        </ion-card-title>\n        <p>\n          <ion-icon name="female" *ngIf=\'editPaziente.sesso=="F"\'></ion-icon>\n          <ion-icon name="male" *ngIf=\'editPaziente.sesso=="M"\'></ion-icon>        \n        </p>\n  \n      </ion-card-content>\n    </ion-card>\n  </ion-list>\n  \n  <ion-list>\n    <ion-grid id=\'griglia_denti\' *ngFor="let p of bocca ; let i = index">\n      <ion-row *ngIf=\'p.sezione < 2 \' >\n        <ion-col *ngFor="let d of p.denti; let j = index;">            \n          <div class=\'{{d.classe}}\'  (click)="openNavDetailsDenti(i,j,d)">\n            {{d.id}}\n            <img src=\'assets/imgs/{{d.id}}.png\' /> \n            <div id="background2"></div>\n            <div id="background3"></div>\n          </div>\n        </ion-col>\n      </ion-row>\n      <ion-row *ngIf=\'p.sezione > 1\'>\n        <ion-col *ngFor="let d of p.denti ; let j = index">\n          <div class=\'{{d.classe}}\' (click)="openNavDetailsDenti(i,j,d)">\n            {{d.id}}\n            <img src=\'assets/imgs/{{d.id}}.png\' /> \n            <div id="background2"></div>\n            <div id="background3"></div>\n          </div>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n  </ion-list>\n\n  <ion-list>\n    <ion-item *ngFor="let item of tipo_lavori; let i = index" (click)="openNavDetailsPage(item)">\n      <ion-icon [name]="item.icon" [ngStyle]="{\'color\': item.color}"></ion-icon>\n      {{ item.title }}\n\n      \n      <button ion-button item-end outline icon-start *ngIf="item.de !=\'\' && item.du !=\'\'||item.de !=\'\' && item.du ==\'\' && item.note !=\'\'" [ngStyle]="{\'color\': \'green\'}">\n        {{ visualizzaData(item.de) }}\n      </button>\n      <button ion-button item-end outline icon-end *ngIf="(item.de !=\'\' &&  verificaDeDu(item)) || (item.du !=\'\' &&  verificaDeDu(item)) " [ngStyle]="{\'color\': \'red\'}">\n        {{ visualizzaData(item.du) }}\n      </button>\n      <ion-icon item-end name="ios-alert-outline" [ngStyle]="{\'color\': \'red\'}" *ngIf="item.du ==\'\' && item.note !=\'\'"></ion-icon>\n    </ion-item>\n  </ion-list>\n\n  <ion-footer no-shadow>\n    <ion-row position="bottom" id=\'salvaStatinoButton\'>\n      <ion-col width-50 text-center><button ion-button large (click)="annullaStatino()">Annulla</button></ion-col>\n      <ion-col width-50 text-center>\n        <button *ngIf=\'modalita ==  "NEW"\' ion-button large (click)="saveStatino(\'NEW\')" [disabled]="abilitaSalva > 0">Salva</button>\n        <button *ngIf=\'modalita == "EDIT"\' ion-button large (click)="saveStatino(\'EDIT\')">Modifica</button>\n      </ion-col>\n    </ion-row>\n  </ion-footer>\n\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\berna\Desktop\odonto3_new\src\pages\statino\statino.html"*/,
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavParams */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__providers_common__["a" /* Common */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__providers_common__["a" /* Common */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_4__providers_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__providers_auth_service__["a" /* AuthService */]) === "function" && _g || Object, typeof (_h = typeof __WEBPACK_IMPORTED_MODULE_6__angular_forms__["a" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__angular_forms__["a" /* FormBuilder */]) === "function" && _h || Object])
    ], StatinoPage);
    return StatinoPage;
    var _a, _b, _c, _d, _e, _f, _g, _h;
}());

var DettaglioStatinoPage = (function () {
    function DettaglioStatinoPage(params, navCtrl, camera, alertCtrl, authService) {
        this.navCtrl = navCtrl;
        this.camera = camera;
        this.alertCtrl = alertCtrl;
        this.authService = authService;
        this.description = '';
        this.startDate = '';
        //startDate: String = new Date().toISOString();
        this.startTime = '';
        this.endDate = '';
        this.endTime = '';
        this.userData = { user_id: "", token: "", cod_statino: "", imageB64: "", tipolavoro: "", id_google_folder: "" };
        if (params.data.item.modalita != 'EDIT' ||
            (params.data.item.modalita == 'EDIT' && params.data.item.de == '')) {
            params.data.item.de = new Date().toISOString();
        }
        this.item = params.data.item;
    }
    DettaglioStatinoPage.prototype.openFotosPage = function (item, startDate, endDate) {
        localStorage.setItem('tipolavoro', item);
    };
    DettaglioStatinoPage.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.i = 0;
        this.photos = [];
        this.getPhotos();
    };
    DettaglioStatinoPage.prototype.deletePhoto = function (index) {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: "Sicuro che vuoi Cancellare la foto? Non si può tornare indietro!",
            message: "",
            buttons: [
                {
                    text: "No",
                    handler: function () {
                        console.log("Disagree clicked");
                    }
                },
                {
                    text: "Yes",
                    handler: function () {
                        console.log("Agree clicked");
                        _this.photos.splice(index, 1);
                    }
                }
            ]
        });
        confirm.present();
    };
    DettaglioStatinoPage.prototype.getPhotos = function () {
        var _this = this;
        console.log('getPhotos');
        var userDataObj = JSON.parse(localStorage.getItem("userData"));
        var cod_statino = localStorage.getItem('cod_statino');
        this.userData.user_id = userDataObj.userData["user_id"];
        this.userData.token = userDataObj.userData["token"];
        this.userData.cod_statino = cod_statino;
        this.userData.tipolavoro = localStorage.getItem("tipolavoro");
        this.authService.postData(this.userData, "getImages").then(function (result) {
            _this.resp = result;
            if (_this.resp.imageData) {
                var photos = {};
                photos = _this.resp;
                var resultArray2 = Object.keys(photos['imageData']).map(function (personNamedIndex) {
                    var foto = photos['imageData'][personNamedIndex];
                    return "data:image/jpeg;base64," + foto.photo;
                });
                _this.photos = resultArray2;
            }
        }, function (err) { console.log('err ' + err); });
    };
    DettaglioStatinoPage.prototype.takePhoto = function (item) {
        var _this = this;
        console.log('takePhoto up', this.photos);
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            //targetWidth: 450,
            //targetHeight: 450,
            //saveToPhotoAlbum: false
            saveToPhotoAlbum: JSON.parse(localStorage.getItem("userData")).userData.saveToPhotoAlbum * 1 ? true : false
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.base64Image = "data:image/jpeg;base64," + imageData;
            _this.photos.push(_this.base64Image);
            _this.images[_this.images.length] = "data:image/jpeg;base64," + imageData;
            _this.photos.reverse();
            _this.sendData(imageData);
        }, function (err) {
            console.log(err);
        });
    };
    DettaglioStatinoPage.prototype.sendData = function (imageData) {
        var _this = this;
        var userDataObj = JSON.parse(localStorage.getItem("userData"));
        this.userData.imageB64 = imageData;
        this.userData.user_id = userDataObj.userData["user_id"];
        this.userData.token = userDataObj.userData["token"];
        this.userData.cod_statino = localStorage.getItem('cod_statino');
        this.userData.tipolavoro = localStorage.getItem("tipolavoro");
        this.userData.id_google_folder = localStorage.getItem("id_google_folder");
        console.log("pippo", this.userData);
        this.authService.postData(this.userData, "userImage").then(function (result) {
            _this.responseData = result;
            console.log('result ' + result);
        }, function (err) {
            // Error log
            console.log('err ' + err);
        });
    };
    DettaglioStatinoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Users\berna\Desktop\odonto3_new\src\pages\statino\dettaglio-statino.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>\n\n      {{ item.title }}\n\n    </ion-title>\n\n    <!--\n\n          <ion-buttons end>\n\n        <button ion-button  (click)="openFotosPage(item.name,startDate,endDate)" >\n\n            <ion-icon item-start name="camera" ></ion-icon>\n\n          </button>\n\n    </ion-buttons>\n\n    -->\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n\n\n  <ion-item>\n\n    <ion-label>Data Entrata</ion-label>\n\n    <ion-datetime displayFormat="DD MMM YYYY" [(ngModel)]="item.de" name="{{ item.de }}" [(ngModel)]=\'startDate\'  ></ion-datetime>\n\n  </ion-item>\n\n\n\n  <ion-item>\n\n    <ion-label>Data Uscita</ion-label>\n\n    <ion-datetime displayFormat="DD MMM YYYY" [(ngModel)]="item.du" name="{{ item.du }}" [(ngModel)]=\'endDate\'></ion-datetime>\n\n  </ion-item>\n\n\n\n  <ion-item>\n\n    <ion-label stacked>Note</ion-label>\n\n    <ion-textarea type="text" rows="5"  [(ngModel)]="item.note" name=\'{{item.note}}\' [(ngModel)]=\'description\'></ion-textarea>\n\n  </ion-item>\n\n\n\n    <ion-label stacked>Fotos</ion-label>\n\n    <!--\n\n      \n\n    -->\n\n    <ion-grid>\n\n      <ion-row>\n\n        <ion-col col-6 *ngFor="let photo of photos; let id = index">\n\n          <ion-card class="block">\n\n            <ion-icon name="trash" class="deleteIcon" (click)="deletePhoto(id)"></ion-icon>\n\n            <img [src]="photo" *ngIf="photo" />\n\n          </ion-card>\n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-grid>\n\n  \n\n    <ion-grid>\n\n      <ion-row>\n\n        <ion-col col-6 *ngFor="let image of images;">\n\n          <ion-card class="block">\n\n            <ion-icon name="trash" class="deleteIcon"></ion-icon>\n\n            <img src="data:image/png;base64,{{image}}" style="height: 200px;width:100px" />\n\n          </ion-card>\n\n        </ion-col>\n\n      </ion-row>\n\n    </ion-grid>\n\n   \n\n</ion-content>\n\n<ion-footer>\n\n\n\n\n\n    \n\n  <ion-row id=\'salvaStatinoButton\'>\n\n    <ion-col width-100 text-center>      \n\n      <button ion-button full (click)="takePhoto(item)">\n\n        <ion-icon name="camera"></ion-icon>&nbsp;Fai una foto\n\n      </button>\n\n    </ion-col>\n\n</ion-row>\n\n\n\n</ion-footer>'/*ion-inline-end:"C:\Users\berna\Desktop\odonto3_new\src\pages\statino\dettaglio-statino.html"*/,
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavParams */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_4__providers_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__providers_auth_service__["a" /* AuthService */]) === "function" && _e || Object])
    ], DettaglioStatinoPage);
    return DettaglioStatinoPage;
    var _a, _b, _c, _d, _e;
}());

var CercaStatinoPage = (function () {
    function CercaStatinoPage(params, authService, common, nav, toastCtrl, alertCtrl) {
        this.authService = authService;
        this.common = common;
        this.nav = nav;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.description = '';
        this.startDate = '';
        this.startTime = '';
        this.endDate = '';
        this.endTime = '';
        this.profilo = '';
        this.buttonDisabled = true;
        this.userPostData = {
            user_id: "",
            token: "",
            feed: "",
            feed_id: "",
            lastCreated: "",
            cod_ut: "",
            profilo: "",
            startDate: "",
            endDate: "",
            tipo: "",
            cli_cod_cli: ""
        };
        this.item = params.data;
        console.log("params.data", params.data);
        if (params.data.event === undefined) {
            this.dataSet = 'no_data';
            this.titleHeader = 'Cerca Lavori';
        }
        else {
            //this.dataSet = 'data';
            //this.titleHeader = 'Lista Lavori';
            this.cli_cod_cli = this.item['event'].value['cli_cod_cli'];
            this.doCercaStatino('fromCercaStatino');
        }
        //this.dataSet = 'no_data';
        //this.titleHeader = 'Cerca Lavori';
        //this.clienti = this.getClienti()
        if (sessionStorage.getItem("clienti") == null) {
            this.getClienti();
        }
        else {
            this.clienti = JSON.parse(sessionStorage.getItem("clienti"));
        }
        console.log("constructor");
    }
    CercaStatinoPage.prototype.portChange = function (event) {
        console.log('port:', event.value);
    };
    CercaStatinoPage.prototype.getClienti = function () {
        var _this = this;
        console.log("getClienti");
        this.common.presentLoading();
        var tmpToSend = JSON.parse(localStorage.getItem("userData")).userData.cod_ut;
        this.authService.postData(tmpToSend, "getClienti").then(function (result) {
            _this.CliResposeData = result;
            if (_this.CliResposeData.cliData) {
                _this.common.closeLoading();
                _this.clienti = _this.CliResposeData.cliData;
                sessionStorage.setItem("clienti", JSON.stringify(_this.clienti));
            }
        }, function (err) {
            _this.common.closeLoading();
            var alert = _this.alertCtrl.create({
                title: 'Qualcosa è andato storto!',
                subTitle: err.statusText,
                buttons: [{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: function () {
                            _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__tabs_tabs__["a" /* TabsPage */]);
                        }
                    }]
            });
            alert.present();
        });
    };
    CercaStatinoPage.prototype.doCercaStatino = function (message) {
        var _this = this;
        this.common.presentLoading();
        var data = JSON.parse(localStorage.getItem("userData"));
        this.userPostData = data.userData;
        this.userPostData.startDate = this.startDate;
        this.userPostData.endDate = this.endDate;
        this.userPostData.tipo = message;
        this.userPostData.cli_cod_cli = this.cli_cod_cli;
        console.log("doCercaStatino", this.userPostData);
        var sessionCli = JSON.parse(sessionStorage.getItem(this.cli_cod_cli));
        if (sessionCli == null) {
            this.authService.postData(this.userPostData, "getStatini").then(function (result) {
                _this.resposeData = result;
                _this.common.closeLoading();
                if (_this.resposeData.statiniData) {
                    _this.dataSet = _this.resposeData.statiniData;
                    console.log("dataSet of " + _this.cli_cod_cli, _this.dataSet);
                    sessionStorage.setItem(_this.cli_cod_cli, JSON.stringify(_this.dataSet));
                    _this.titleHeader = 'Lista Lavori';
                }
                else {
                    var toast = _this.toastCtrl.create({
                        message: 'Nessun risultato per la tua ricerca',
                        showCloseButton: true,
                        position: 'top',
                        closeButtonText: 'Ok'
                    });
                    toast.present();
                    console.log("No data found");
                }
            }, function (err) {
                _this.common.closeLoading();
                //Connection failed message
            });
        }
        else {
            this.dataSet = sessionCli;
            this.titleHeader = 'Lista Lavori';
            this.common.closeLoading();
        }
    };
    CercaStatinoPage.prototype.searchPaziente = function (event) {
        var _this = this;
        try {
            var text_1 = event.text.trim();
            event.component.items = this.clienti.filter(function (item) {
                var str = item.nome_cognome;
                if (str == undefined) {
                    str = _this.clienti[_this.clienti.length - 1].cognome_nome;
                }
                if (str.toUpperCase().indexOf(text_1) >= 0 || str.toLowerCase().indexOf(text_1) >= 0 || str.indexOf(text_1) >= 0) {
                    console.log(str + ' - ' + text_1);
                    console.log(str.indexOf(text_1));
                    return true;
                }
                return false;
            });
            event.component.endSearch();
        }
        catch (error) {
            console.error(error.stack);
        }
    };
    CercaStatinoPage.prototype.onSearchSuccess = function (event) {
        // Hide form.    
        event.component.hideAddItemTemplate();
    };
    CercaStatinoPage.prototype.onChangePaziente = function (event) {
        this.cli_cod_cli = event["value"].cli_cod_cli;
    };
    CercaStatinoPage.prototype.openNavEditMainStatino = function (item) {
        var objToSent = { "lavori": "", "griglia_denti": "", "tipo_lavori": "", "bocca": "", "Cod_Statino": "", "sesso": "", "nome_cli": "", "cognome_cli": "", "cli_cod_cli": "" };
        console.log("openNavEditMainStatino", item);
        objToSent.lavori = item.lavori;
        objToSent.griglia_denti = item.griglia_denti;
        objToSent.tipo_lavori = JSON.parse(objToSent.lavori);
        objToSent.bocca = JSON.parse(objToSent.griglia_denti);
        objToSent.Cod_Statino = item.cod_statino;
        objToSent.sesso = item.sesso;
        objToSent.nome_cli = item.nome_cli;
        objToSent.cognome_cli = item.cognome_cli;
        objToSent.cli_cod_cli = this.cli_cod_cli;
        console.log("objToSent", objToSent);
        this.nav.push(StatinoPage, { edit: objToSent });
    };
    CercaStatinoPage.prototype.onSearchFail = function (event) {
        if (event.component.hasSearchText) {
            console.log("onSearchFail", event.component.searchText);
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('customerComponent'),
        __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_7_ionic_selectable__["a" /* IonicSelectableComponent */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_7_ionic_selectable__["a" /* IonicSelectableComponent */]) === "function" && _a || Object)
    ], CercaStatinoPage.prototype, "customerComponent", void 0);
    CercaStatinoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Users\berna\Desktop\odonto3_new\src\pages\statino\cerca-statino.html"*/'<ion-header>\n\n    <ion-navbar>\n\n      <ion-title>\n\n       {{titleHeader}}\n\n      </ion-title>\n\n    </ion-navbar>\n\n  </ion-header>\n\n  \n\n  <ion-content padding >\n\n    <div *ngIf=\'dataSet=="no_data"\'>\n\n      <ion-item>\n\n        <ion-label>Paziente</ion-label>\n\n        <ionic-selectable \n\n      #customerComponent\n\n      item-content \n\n      searchPlaceholder="" \n\n      [searchFailText]="\'Nessun paziente trovato\'" \n\n      [(ngModel)]="paziente" \n\n      itemValueField="cli_cod_cli" \n\n      itemTextField="cognome_nome" \n\n      [(items)]="clienti"\n\n      [canSearch]="true" \n\n      [canClear]="false" \n\n      [canAddItem]="false" \n\n      [canSaveItem]="false" \n\n      [canDeleteItem]="false" \n\n      (onSearch)="searchPaziente($event)"\n\n      (onSearchFail)="onSearchFail($event)" \n\n      (onSearchSuccess)="onSearchSuccess($event)"\n\n      (onChange)="onChangePaziente($event)">\n\n      <ng-template ionicSelectableItemTemplate let-cliente="item">        \n\n        <div id="{{cliente.cli_cod_cli}}" [ngStyle]="cliente.sesso==\'M\' && {\'background-color\':\'#cdfff4\'} || {\'background-color\': \'#fcc7ff\'}">\n\n            {{cliente.cognome_nome}} - {{cliente.data_nascita}}            \n\n        </div>\n\n      </ng-template>\n\n    </ionic-selectable>\n\n      </ion-item>\n\n    \n\n    <ion-item>\n\n      <ion-label>Data Entrata: dal</ion-label>\n\n      <ion-datetime displayFormat="DD MMM YYYY"   [(ngModel)]=\'startDate\' ></ion-datetime>\n\n    </ion-item>\n\n  \n\n    <ion-item>\n\n      <ion-label>Data Uscita: al</ion-label>\n\n      <ion-datetime displayFormat="DD MMM YYYY" [(ngModel)]=\'endDate\'></ion-datetime>\n\n    </ion-item>\n\n    <ion-row id=\'cercaStatinoButton\'>\n\n      <button [disabled]="cli_cod_cli===undefined " ion-button block (click)="doCercaStatino(\'fromCercaStatino\')" >\n\n        Cerca\n\n      </button>\n\n    </ion-row>    \n\n    </div>\n\n\n\n    <div *ngIf=\'dataSet!="no_data"\'>   \n\n      <ion-list>\n\n          <ion-item *ngFor="let item of dataSet" (click)="openNavEditMainStatino(item)">\n\n              <ion-thumbnail item-left>\n\n                  <img src="assets/imgs/{{item.sesso}}.png">\n\n              </ion-thumbnail>\n\n              \n\n              <h2>{{ item.nome_cli }} {{ item.cognome_cli }} </h2>\n\n              <p> IN {{ item.DATA_TS_E  }} </p>\n\n              <p> OUT {{ item.DATA_TS_U  }} </p>\n\n              <p *ngIf=\'profilo!=2\'> {{item.medico}} </p>              \n\n          </ion-item>\n\n      </ion-list>    \n\n  </div>\n\n  </ion-content>'/*ion-inline-end:"C:\Users\berna\Desktop\odonto3_new\src\pages\statino\cerca-statino.html"*/,
            selector: 'CercaStatinoPage  '
        }),
        __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavParams */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__providers_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__providers_auth_service__["a" /* AuthService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3__providers_common__["a" /* Common */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__providers_common__["a" /* Common */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* ToastController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* ToastController */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]) === "function" && _g || Object])
    ], CercaStatinoPage);
    return CercaStatinoPage;
    var _a, _b, _c, _d, _e, _f, _g;
}());

var FotoStatinoPage = (function () {
    function FotoStatinoPage(navCtrl, camera, alertCtrl, authService) {
        this.navCtrl = navCtrl;
        this.camera = camera;
        this.alertCtrl = alertCtrl;
        this.authService = authService;
        this.userData = { user_id: "", token: "", cod_statino: "", imageB64: "", tipolavoro: "", id_google_folder: "" };
    }
    FotoStatinoPage.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.i = 0;
        this.photos = [];
        this.getPhotos();
    };
    FotoStatinoPage.prototype.deletePhoto = function (index) {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: "Sicuro che vuoi Cancellare la foto? Non si può tornare indietro!",
            message: "",
            buttons: [
                {
                    text: "No",
                    handler: function () {
                        console.log("Disagree clicked");
                    }
                },
                {
                    text: "Yes",
                    handler: function () {
                        console.log("Agree clicked");
                        _this.photos.splice(index, 1);
                    }
                }
            ]
        });
        confirm.present();
    };
    FotoStatinoPage.prototype.getPhotos = function () {
        var _this = this;
        console.log('getPhotos');
        var userDataObj = JSON.parse(localStorage.getItem("userData"));
        var cod_statino = localStorage.getItem('cod_statino');
        this.userData.user_id = userDataObj.userData["user_id"];
        this.userData.token = userDataObj.userData["token"];
        this.userData.cod_statino = cod_statino;
        this.userData.tipolavoro = localStorage.getItem("tipolavoro");
        this.authService.postData(this.userData, "getImages").then(function (result) {
            _this.resp = result;
            if (_this.resp.imageData) {
                var photos = {};
                photos = _this.resp;
                var resultArray2 = Object.keys(photos['imageData']).map(function (personNamedIndex) {
                    var foto = photos['imageData'][personNamedIndex];
                    return "data:image/jpeg;base64," + foto.photo;
                });
                _this.photos = resultArray2;
            }
        }, function (err) { console.log('err ' + err); });
    };
    FotoStatinoPage.prototype.takePhoto = function (item) {
        var _this = this;
        console.log('takePhoto', this.photos);
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            //targetWidth: 450,
            //targetHeight: 450,
            //saveToPhotoAlbum: false
            saveToPhotoAlbum: JSON.parse(localStorage.getItem("userData")).userData.saveToPhotoAlbum * 1 ? true : false
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.base64Image = "data:image/jpeg;base64," + imageData;
            _this.images.push(imageData);
            _this.photos.push(_this.base64Image);
            _this.photos.reverse();
            _this.sendData(imageData);
        }, function (err) {
            console.log(err);
        });
    };
    FotoStatinoPage.prototype.sendData = function (imageData) {
        var _this = this;
        var userDataObj = JSON.parse(localStorage.getItem("userData"));
        this.userData.imageB64 = imageData;
        this.userData.user_id = userDataObj.userData["user_id"];
        this.userData.token = userDataObj.userData["token"];
        this.userData.cod_statino = localStorage.getItem('cod_statino');
        this.userData.tipolavoro = localStorage.getItem("tipolavoro");
        this.userData.id_google_folder = localStorage.getItem("id_google_folder");
        console.log("pippo", this.userData);
        this.authService.postData(this.userData, "userImage").then(function (result) {
            _this.responseData = result;
            console.log('result ' + result);
        }, function (err) {
            // Error log
            console.log('err ' + err);
        });
    };
    FotoStatinoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Users\berna\Desktop\odonto3_new\src\pages\statino\foto-statino.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>\n\n      Foto\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n\n\n  <button ion-button full (click)="takePhoto(item)">\n\n    <ion-icon name="camera"></ion-icon>&nbsp;Fai una foto\n\n  </button>\n\n \n\n  <ion-grid>\n\n    <ion-row>\n\n      <ion-col col-6 *ngFor="let photo of photos; let id = index">\n\n        <ion-card class="block">\n\n          <ion-icon name="trash" class="deleteIcon" (click)="deletePhoto(id)"></ion-icon>\n\n          <img [src]="photo" *ngIf="photo" />\n\n        </ion-card>\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n\n\n  <ion-grid>\n\n    <ion-row>\n\n      <ion-col col-6 *ngFor="let image of images;">\n\n        <ion-card class="block">\n\n          <ion-icon name="trash" class="deleteIcon"></ion-icon>\n\n          <img src="data:image/png;base64,{{image.b64}}" *ngIf="image.b64" style="height: 200px;width:100px" />\n\n        </ion-card>\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\berna\Desktop\odonto3_new\src\pages\statino\foto-statino.html"*/,
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__providers_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__providers_auth_service__["a" /* AuthService */]) === "function" && _d || Object])
    ], FotoStatinoPage);
    return FotoStatinoPage;
    var _a, _b, _c, _d;
}());

//# sourceMappingURL=statino.js.mapundefined

/***/ }),

/***/ 479:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SplitPane; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/*
  Generated class for the SplitPane provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var SplitPane = (function () {
    function SplitPane(platform) {
        this.platform = platform;
        console.log('Hello SplitPane Provider');
        this.splitPaneState = false;
    }
    SplitPane.prototype.getSplitPane = function () {
        if (localStorage.getItem('userData')) {
            if (this.platform.width() > 850) {
                this.splitPaneState = true;
            }
            else {
                this.splitPaneState = false;
            }
        }
        else {
            this.splitPaneState = false;
        }
        return this.splitPaneState;
    };
    SplitPane = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* Platform */]])
    ], SplitPane);
    return SplitPane;
}());

//# sourceMappingURL=split-pane.js.map

/***/ }),

/***/ 494:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CalendarioPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Generated class for the CalendarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CalendarioPage = (function () {
    function CalendarioPage(navCtrl, navParams, modalCtrl, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.eventSource = [];
        this.selectedDay = new Date();
        this.event = { startTime: new Date().toISOString(), endTime: new Date().toISOString(), allDay: false };
        this.minDate = new Date().toISOString();
        this.calendar = {
            mode: 'month',
            currentDate: new Date()
        };
        var preselectedDate = __WEBPACK_IMPORTED_MODULE_2_moment__(this.navParams.get('selectedDay')).format();
        this.event.startTime = preselectedDate;
        this.event.endTime = preselectedDate;
    }
    CalendarioPage.prototype.addEvent = function () {
        var _this = this;
        var modal = this.modalCtrl.create('EventModalPage', { selectedDay: this.selectedDay });
        modal.present();
        modal.onDidDismiss(function (data) {
            if (data) {
                var eventData = data;
                eventData.startTime = new Date(data.startTime);
                eventData.endTime = new Date(data.endTime);
                var events_1 = _this.eventSource;
                events_1.push(eventData);
                _this.eventSource = [];
                setTimeout(function () {
                    _this.eventSource = events_1;
                });
            }
        });
    };
    CalendarioPage.prototype.onViewTitleChanged = function (title) {
        this.viewTitle = title;
    };
    CalendarioPage.prototype.onEventSelected = function (event) {
        var start = __WEBPACK_IMPORTED_MODULE_2_moment__(event.startTime).format('LLLL');
        var end = __WEBPACK_IMPORTED_MODULE_2_moment__(event.endTime).format('LLLL');
        console.log('gianni');
        var alert = this.alertCtrl.create({
            title: '' + event.title,
            subTitle: 'From: ' + start + '<br>To: ' + end,
            buttons: ['OK']
        });
        alert.present();
    };
    CalendarioPage.prototype.onTimeSelected = function (ev) {
        this.selectedDay = ev.selectedTime;
    };
    CalendarioPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CalendarioPage');
    };
    CalendarioPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-calendario',template:/*ion-inline-start:"C:\Users\berna\Desktop\odonto3_new\src\pages\calendario\calendario.html"*/'<!--\n  Generated template for the CalendarioPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <img ion-right src="assets/imgs/odonto3_header.png" class="navbarLogo" />\n    <ion-title>{{ viewTitle }} </ion-title>\n    <!--\n    <ion-buttons end>\n      <button ion-button icon-only (click)="addEvent()">\n        <ion-icon name="add"></ion-icon>\n      </button>\n    </ion-buttons>\n    -->\n\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n<calendar \n        [eventSource]="eventSource"\n        [calendarMode]="calendar.mode"\n        [currentDate]="calendar.currentDate"\n        (onEventSelected)="onEventSelected($event)"\n        (onTitleChanged)="onViewTitleChanged($event)"\n        (onTimeSelected)="onTimeSelected($event)"\n        step="30"\n        class="calendar">\n      </calendar>\n</ion-content>\n'/*ion-inline-end:"C:\Users\berna\Desktop\odonto3_new\src\pages\calendario\calendario.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]])
    ], CalendarioPage);
    return CalendarioPage;
}());

//# sourceMappingURL=calendario.js.map

/***/ }),

/***/ 495:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(496);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(500);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 500:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(824);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__ = __webpack_require__(435);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_in_app_browser__ = __webpack_require__(825);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_auth_service__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_split_pane__ = __webpack_require__(479);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_common__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_common_http__ = __webpack_require__(846);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_welcome_welcome__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_login_login__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_signup_signup__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_contact_contact__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_home_home__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_tabs_tabs__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_statino_statino__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_native_calendar__ = __webpack_require__(826);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_calendario_calendario__ = __webpack_require__(494);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_status_bar__ = __webpack_require__(477);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ionic_native_splash_screen__ = __webpack_require__(478);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_angular2_moment__ = __webpack_require__(827);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_angular2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_21_angular2_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_angular_linky__ = __webpack_require__(829);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_angular_linky___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_22_angular_linky__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23_ionic2_calendar__ = __webpack_require__(831);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24_ionic_selectable__ = __webpack_require__(437);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









//import { HttpModule } from "@angular/http";








/*Odonto3*/












var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_10__pages_welcome_welcome__["a" /* Welcome */],
                __WEBPACK_IMPORTED_MODULE_11__pages_login_login__["a" /* Login */],
                __WEBPACK_IMPORTED_MODULE_12__pages_signup_signup__["a" /* Signup */],
                __WEBPACK_IMPORTED_MODULE_18__pages_calendario_calendario__["a" /* CalendarioPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_contact_contact__["a" /* ContactPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_home_home__["b" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_statino_statino__["d" /* StatinoPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_statino_statino__["a" /* CercaStatinoPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_statino_statino__["b" /* DettaglioStatinoPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_statino_statino__["c" /* FotoStatinoPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_home_home__["a" /* Dettaglio2StatinoPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_24_ionic_selectable__["b" /* IonicSelectableModule */],
                __WEBPACK_IMPORTED_MODULE_23_ionic2_calendar__["a" /* NgCalendarModule */],
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */], __WEBPACK_IMPORTED_MODULE_9__angular_common_http__["b" /* HttpClientModule */], __WEBPACK_IMPORTED_MODULE_21_angular2_moment__["MomentModule"], __WEBPACK_IMPORTED_MODULE_22_angular_linky__["LinkyModule"],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/calendario/calendario.module#CalendarioPageModule', name: 'CalendarioPage', segment: 'calendario', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/login/login.module#LoginModule', name: 'Login', segment: 'login', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/signup/signup.module#SignupModule', name: 'Signup', segment: 'signup', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/welcome/welcome.module#WelcomeModule', name: 'Welcome', segment: 'welcome', priority: 'low', defaultHistory: [] }
                    ]
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_10__pages_welcome_welcome__["a" /* Welcome */],
                __WEBPACK_IMPORTED_MODULE_11__pages_login_login__["a" /* Login */],
                __WEBPACK_IMPORTED_MODULE_12__pages_signup_signup__["a" /* Signup */],
                __WEBPACK_IMPORTED_MODULE_18__pages_calendario_calendario__["a" /* CalendarioPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_contact_contact__["a" /* ContactPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_home_home__["b" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_statino_statino__["d" /* StatinoPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_statino_statino__["a" /* CercaStatinoPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_statino_statino__["b" /* DettaglioStatinoPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_statino_statino__["c" /* FotoStatinoPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_home_home__["a" /* Dettaglio2StatinoPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_16__pages_statino_statino__["d" /* StatinoPage */],
                __WEBPACK_IMPORTED_MODULE_19__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_20__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__["a" /* Camera */], __WEBPACK_IMPORTED_MODULE_6__providers_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_7__providers_split_pane__["a" /* SplitPane */], __WEBPACK_IMPORTED_MODULE_8__providers_common__["a" /* Common */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_in_app_browser__["a" /* InAppBrowser */], __WEBPACK_IMPORTED_MODULE_17__ionic_native_calendar__["a" /* Calendar */],
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* IonicErrorHandler */] },
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 521:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 216,
	"./af.js": 216,
	"./ar": 217,
	"./ar-dz": 218,
	"./ar-dz.js": 218,
	"./ar-kw": 219,
	"./ar-kw.js": 219,
	"./ar-ly": 220,
	"./ar-ly.js": 220,
	"./ar-ma": 221,
	"./ar-ma.js": 221,
	"./ar-sa": 222,
	"./ar-sa.js": 222,
	"./ar-tn": 223,
	"./ar-tn.js": 223,
	"./ar.js": 217,
	"./az": 224,
	"./az.js": 224,
	"./be": 225,
	"./be.js": 225,
	"./bg": 226,
	"./bg.js": 226,
	"./bm": 227,
	"./bm.js": 227,
	"./bn": 228,
	"./bn.js": 228,
	"./bo": 229,
	"./bo.js": 229,
	"./br": 230,
	"./br.js": 230,
	"./bs": 231,
	"./bs.js": 231,
	"./ca": 232,
	"./ca.js": 232,
	"./cs": 233,
	"./cs.js": 233,
	"./cv": 234,
	"./cv.js": 234,
	"./cy": 235,
	"./cy.js": 235,
	"./da": 236,
	"./da.js": 236,
	"./de": 237,
	"./de-at": 238,
	"./de-at.js": 238,
	"./de-ch": 239,
	"./de-ch.js": 239,
	"./de.js": 237,
	"./dv": 240,
	"./dv.js": 240,
	"./el": 241,
	"./el.js": 241,
	"./en-au": 242,
	"./en-au.js": 242,
	"./en-ca": 243,
	"./en-ca.js": 243,
	"./en-gb": 244,
	"./en-gb.js": 244,
	"./en-ie": 245,
	"./en-ie.js": 245,
	"./en-il": 246,
	"./en-il.js": 246,
	"./en-nz": 247,
	"./en-nz.js": 247,
	"./eo": 248,
	"./eo.js": 248,
	"./es": 249,
	"./es-do": 250,
	"./es-do.js": 250,
	"./es-us": 251,
	"./es-us.js": 251,
	"./es.js": 249,
	"./et": 252,
	"./et.js": 252,
	"./eu": 253,
	"./eu.js": 253,
	"./fa": 254,
	"./fa.js": 254,
	"./fi": 255,
	"./fi.js": 255,
	"./fo": 256,
	"./fo.js": 256,
	"./fr": 257,
	"./fr-ca": 258,
	"./fr-ca.js": 258,
	"./fr-ch": 259,
	"./fr-ch.js": 259,
	"./fr.js": 257,
	"./fy": 260,
	"./fy.js": 260,
	"./gd": 261,
	"./gd.js": 261,
	"./gl": 262,
	"./gl.js": 262,
	"./gom-latn": 263,
	"./gom-latn.js": 263,
	"./gu": 264,
	"./gu.js": 264,
	"./he": 265,
	"./he.js": 265,
	"./hi": 266,
	"./hi.js": 266,
	"./hr": 267,
	"./hr.js": 267,
	"./hu": 268,
	"./hu.js": 268,
	"./hy-am": 269,
	"./hy-am.js": 269,
	"./id": 270,
	"./id.js": 270,
	"./is": 271,
	"./is.js": 271,
	"./it": 272,
	"./it.js": 272,
	"./ja": 273,
	"./ja.js": 273,
	"./jv": 274,
	"./jv.js": 274,
	"./ka": 275,
	"./ka.js": 275,
	"./kk": 276,
	"./kk.js": 276,
	"./km": 277,
	"./km.js": 277,
	"./kn": 278,
	"./kn.js": 278,
	"./ko": 279,
	"./ko.js": 279,
	"./ky": 280,
	"./ky.js": 280,
	"./lb": 281,
	"./lb.js": 281,
	"./lo": 282,
	"./lo.js": 282,
	"./lt": 283,
	"./lt.js": 283,
	"./lv": 284,
	"./lv.js": 284,
	"./me": 285,
	"./me.js": 285,
	"./mi": 286,
	"./mi.js": 286,
	"./mk": 287,
	"./mk.js": 287,
	"./ml": 288,
	"./ml.js": 288,
	"./mn": 289,
	"./mn.js": 289,
	"./mr": 290,
	"./mr.js": 290,
	"./ms": 291,
	"./ms-my": 292,
	"./ms-my.js": 292,
	"./ms.js": 291,
	"./mt": 293,
	"./mt.js": 293,
	"./my": 294,
	"./my.js": 294,
	"./nb": 295,
	"./nb.js": 295,
	"./ne": 296,
	"./ne.js": 296,
	"./nl": 297,
	"./nl-be": 298,
	"./nl-be.js": 298,
	"./nl.js": 297,
	"./nn": 299,
	"./nn.js": 299,
	"./pa-in": 300,
	"./pa-in.js": 300,
	"./pl": 301,
	"./pl.js": 301,
	"./pt": 302,
	"./pt-br": 303,
	"./pt-br.js": 303,
	"./pt.js": 302,
	"./ro": 304,
	"./ro.js": 304,
	"./ru": 305,
	"./ru.js": 305,
	"./sd": 306,
	"./sd.js": 306,
	"./se": 307,
	"./se.js": 307,
	"./si": 308,
	"./si.js": 308,
	"./sk": 309,
	"./sk.js": 309,
	"./sl": 310,
	"./sl.js": 310,
	"./sq": 311,
	"./sq.js": 311,
	"./sr": 312,
	"./sr-cyrl": 313,
	"./sr-cyrl.js": 313,
	"./sr.js": 312,
	"./ss": 314,
	"./ss.js": 314,
	"./sv": 315,
	"./sv.js": 315,
	"./sw": 316,
	"./sw.js": 316,
	"./ta": 317,
	"./ta.js": 317,
	"./te": 318,
	"./te.js": 318,
	"./tet": 319,
	"./tet.js": 319,
	"./tg": 320,
	"./tg.js": 320,
	"./th": 321,
	"./th.js": 321,
	"./tl-ph": 322,
	"./tl-ph.js": 322,
	"./tlh": 323,
	"./tlh.js": 323,
	"./tr": 324,
	"./tr.js": 324,
	"./tzl": 325,
	"./tzl.js": 325,
	"./tzm": 326,
	"./tzm-latn": 327,
	"./tzm-latn.js": 327,
	"./tzm.js": 326,
	"./ug-cn": 328,
	"./ug-cn.js": 328,
	"./uk": 329,
	"./uk.js": 329,
	"./ur": 330,
	"./ur.js": 330,
	"./uz": 331,
	"./uz-latn": 332,
	"./uz-latn.js": 332,
	"./uz.js": 331,
	"./vi": 333,
	"./vi.js": 333,
	"./x-pseudo": 334,
	"./x-pseudo.js": 334,
	"./yo": 335,
	"./yo.js": 335,
	"./zh-cn": 336,
	"./zh-cn.js": 336,
	"./zh-hk": 337,
	"./zh-hk.js": 337,
	"./zh-tw": 338,
	"./zh-tw.js": 338
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 521;

/***/ }),

/***/ 57:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__contact_contact__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__statino_statino__ = __webpack_require__(47);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






//import {CalendarioPage } from '../calendario/calendario' ;
var TabsPage = (function () {
    function TabsPage(platform, actionsheetCtrl, navCtrl) {
        this.platform = platform;
        this.actionsheetCtrl = actionsheetCtrl;
        this.navCtrl = navCtrl;
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_3__home_home__["b" /* HomePage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_4__statino_statino__["a" /* CercaStatinoPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_4__statino_statino__["d" /* StatinoPage */];
        this.tab4Root = __WEBPACK_IMPORTED_MODULE_2__contact_contact__["a" /* ContactPage */];
    }
    TabsPage.prototype.openActionStatinoSheet = function () {
        var _this = this;
        var actionSheet = this.actionsheetCtrl.create({
            title: 'Lavori',
            cssClass: 'action-sheets-basic-page',
            buttons: [
                {
                    text: 'Richiedi preventivo',
                    icon: !this.platform.is('ios') ? 'md-create' : null,
                    handler: function () {
                        //console.log('Create clicked');
                        //let navTransition = actionSheet.dismiss();
                        localStorage.setItem('preventivo', 'true');
                        _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__statino_statino__["d" /* StatinoPage */]);
                        //StatinoPage;
                    }
                },
                {
                    text: 'Inserisci lavoro',
                    icon: !this.platform.is('ios') ? 'md-create' : null,
                    handler: function () {
                        localStorage.setItem('preventivo', 'false');
                        _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__statino_statino__["d" /* StatinoPage */]);
                        //StatinoPage;
                    }
                } /*,
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
                    role: 'cancel',
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: function () {
                        // console.log('Cancel clicked');
                        localStorage.setItem('preventivo', 'false');
                    }
                }
            ]
        });
        actionSheet.present();
    };
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Users\berna\Desktop\odonto3_new\src\pages\tabs\tabs.html"*/'<ion-tabs>\n\n  <ion-tab [root]="tab1Root" tabTitle="Home" tabIcon="home" ></ion-tab>\n\n  <!--ion-tab [root]="tab2Root" tabTitle="Calendario" tabIcon="calendar"></ion-tab-->\n\n  <ion-tab (ionSelect)="openActionStatinoSheet()" tabTitle="Statino" tabIcon="paper"></ion-tab>\n\n  <ion-tab [root]="tab2Root" tabTitle="Cerca" tabIcon="search"></ion-tab> \n\n  <ion-tab [root]="tab4Root" tabTitle="Contatti" tabIcon="contacts"></ion-tab>\n\n</ion-tabs>\n\n'/*ion-inline-end:"C:\Users\berna\Desktop\odonto3_new\src\pages\tabs\tabs.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */]])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 58:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(340);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(846);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(341);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




//let apiUrl = "http://localhost/PHP-Slim-Restful/api/";
//let apiUrl = 'http://www.pitimali.com/api/';
var apiUrl = '/api/';
/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        console.log('Hello AuthService Provider');
    }
    AuthService.prototype.postData = function (credentials, type) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]();
            headers.append('Content-Type', 'application/json');
            headers.append('Access-Control-Allow-Origin', '*');
            _this.http.post(apiUrl + type, JSON.stringify(credentials), { headers: headers }).
                subscribe(function (res) {
                console.log(res);
                resolve(res);
            }, function (err) {
                reject(err);
            });
        });
    };
    AuthService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */]) === "function" && _a || Object])
    ], AuthService);
    return AuthService;
    var _a;
}());

//# sourceMappingURL=auth-service.js.map

/***/ }),

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Welcome; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login_login__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__signup_signup__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__tabs_tabs__ = __webpack_require__(57);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the Welcome page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var Welcome = (function () {
    function Welcome(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        if (localStorage.getItem('userData')) {
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__tabs_tabs__["a" /* TabsPage */]);
        }
    }
    Welcome.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad Welcome');
    };
    Welcome.prototype.login = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__login_login__["a" /* Login */]);
    };
    Welcome.prototype.signup = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__signup_signup__["a" /* Signup */], {}, { animate: false });
    };
    Welcome = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-welcome',template:/*ion-inline-start:"C:\Users\berna\Desktop\odonto3_new\src\pages\welcome\welcome.html"*/'\n\n\n\n\n\n<ion-content padding id="welcome">\n\n\n\n<img src="assets/imgs/odonto3_welcome.png" class="logo"/>\n\n<h1> Benvenuti su Odonto3 </h1>\n\n<div>by Bernard e Mosella</div>\n\n\n\n<button ion-button block class="marginTop" (click)="signup()">Iscriviti</button>\n\n<button ion-button block color="lightprimary" (click)="login()">Login</button>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Users\berna\Desktop\odonto3_new\src\pages\welcome\welcome.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* NavParams */]])
    ], Welcome);
    return Welcome;
}());

//# sourceMappingURL=welcome.js.map

/***/ }),

/***/ 824:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(477);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(478);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_split_pane__ = __webpack_require__(479);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_welcome_welcome__ = __webpack_require__(66);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen, app, splitPane, menu) {
        this.app = app;
        this.splitPane = splitPane;
        this.menu = menu;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_5__pages_welcome_welcome__["a" /* Welcome */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp.prototype.backToWelcome = function () {
        var root = this.app.getRootNav();
        root.popToRoot();
    };
    MyApp.prototype.logout = function () {
        //Api Token Logout 
        var _this = this;
        localStorage.clear();
        this.menu.enable(false);
        setTimeout(function () { return _this.backToWelcome(); }, 1000);
    };
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Users\berna\Desktop\odonto3_new\src\app\app.html"*/'<!--<ion-nav [root]="rootPage"></ion-nav>-->\n\n\n\n<ion-split-pane [when]="splitPane.getSplitPane()">\n\n  <!--  our side menu  -->\n\n  <ion-menu [content]="content">\n\n    <ion-header>\n\n      <ion-toolbar>\n\n        <ion-title>Menu</ion-title>\n\n      </ion-toolbar>\n\n    </ion-header>\n\n   \n\n\n\n     <ion-content>\n\n    <ion-list>\n\n\n\n        <button ion-button color="primary" (click)="logout()">Logout</button>\n\n    </ion-list>\n\n     </ion-content>\n\n\n\n  </ion-menu>\n\n  \n\n\n\n  <!-- the main content -->\n\n  <ion-nav [root]="rootPage" main #content></ion-nav>\n\n</ion-split-pane>\n\n\n\n'/*ion-inline-end:"C:\Users\berna\Desktop\odonto3_new\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* App */], __WEBPACK_IMPORTED_MODULE_4__providers_split_pane__["a" /* SplitPane */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* MenuController */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 835:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[495]);
//# sourceMappingURL=main.js.map