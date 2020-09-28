import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { AlertController, ToastController } from 'ionic-angular';
import { Common } from "../../providers/common";
import { AuthService } from "../../providers/auth-service";
import { TabsPage } from '../tabs/tabs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'page-statino',
  templateUrl: 'statino.html',
})
export class StatinoPage {

  titoloHeader: any;
  preventivo: any;
  tipo_lavori = [];
  bocca = [];

  calendarEvent: any = {};
  validation: any = {};
  attendees = [{
    email: ""
  }];


  resposeData: any;
  public userDetails: any;
  modalita = 'NEW';
  profilo = '';
  visualizzastatini= false;
  event: any ;
  cod_ut = '';
  medico = '';
  paziente = '';
  sesso = '';
  sex = '';
  abilitaSalva: number;
  clientiPostData: any;
  mediciPostData: any;
  aggiornaAbilitaSalva: any;

  public CliResposeData: any;
  public Cod_Statino: any;
  public cli_cod_cli:any;
  public resultSetMaxStatino: any;
  public mediciResponseData: any;
  editPaziente = {};
  customer: any;
  clienti = [];
  odontoiatra = [];
  arrToSend = [];
  noteEmail = [];

  newCustomerForm: FormGroup;
  customerNameControl: FormControl;
  customerSurnameControl: FormControl;
  customerCityControl: FormControl;
  customerBirthdateControl: FormControl;
  customerGenderControl: FormControl;

  customersSubscription: Subscription;
  @ViewChild('customerComponent') customerComponent: IonicSelectableComponent;

  constructor(
    params: NavParams,
    public common: Common,
    public nav: NavController,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    
    this.customerNameControl = this.formBuilder.control(null, Validators.required);
    this.customerSurnameControl = this.formBuilder.control(null, Validators.required);
    this.customerCityControl = this.formBuilder.control(null, Validators.required);
    this.customerBirthdateControl = this.formBuilder.control(null, Validators.required);
    this.customerGenderControl = this.formBuilder.control(null, Validators.required);

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



    const data = JSON.parse(localStorage.getItem("userData"));
    this.userDetails = data.userData;
    this.profilo = this.userDetails.profilo;

    this.clientiPostData.cod_ut = this.userDetails.cod_ut;

    this.sesso = '';
    this.preventivo = localStorage.getItem("preventivo")

    this.titoloHeader = 'Inserisci Lavoro'
    if (this.preventivo == 'true') {
      this.titoloHeader = 'Richiedi preventivo'
    }

    this.bocca = this.setBocca()
    this.tipo_lavori = this.setLavori()

    if (this.userDetails.profilo == "1") {
      this.getMedico();
      this.abilitaSalva = 4;
    }
    if (this.userDetails.profilo == "2") {
      if (sessionStorage.getItem("clienti") == null) {
        this.getClienti();        
      } else {
        this.clienti = JSON.parse(sessionStorage.getItem("clienti"));
      }
      this.abilitaSalva = 3;
    }
    if ( params.data.edit == null && (localStorage.getItem('cod_statino') == null || localStorage.getItem('cod_statino') == '') ) {
      console.log('setMaxStatino on');
      this.setMaxStatino();
    } else {
      console.log('MaxStatino is already setted, cod_statino = ' + localStorage.getItem('cod_statino'));
    }

    //Provengo dal cerca lavori    
    if(params.data.edit != null) {
      console.log(params.data.edit)
      let data = params.data.edit;       
      let lavori = data.lavori;
      let griglia_denti = data.griglia_denti;
      this.tipo_lavori = JSON.parse(lavori);
      this.bocca = JSON.parse(griglia_denti);
      this.Cod_Statino = data.Cod_Statino;
      console.log('get Statino from edit , cod_statino = ' + this.Cod_Statino);
      this.cli_cod_cli = data.cli_cod_cli;
      this.modalita = 'EDIT';
      this.titoloHeader ='Modifica Lavoro';
      this.editPaziente = {"sesso":data.sesso,"nome_cli":data.nome_cli,"cognome_cli":data.cognome_cli};      
    }

  }
  setLavori() {
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
        'id_google_event':''
      },
      {
        'title': 'P.Struttura',
        'name': 'p-struttura',
        'de': '',
        'du': '',
        'icon': 'arrow-forward',
        'note': '',
        'color': '#0CA9EA',
        'id_google_event':''
      },
      {
        'title': 'P.Ceramica',
        'name': 'p-ceramica',
        'de': '',
        'du': '',
        'icon': 'arrow-forward',
        'note': '',
        'color': '#F46529',
        'id_google_event':''
      },
      {
        'title': 'P.Mobile',
        'name': 'p-mobile',
        'de': '',
        'du': '',
        'icon': 'arrow-forward',
        'note': '',
        'color': '#F46520',
        'id_google_event':''
      },
      {
        'title': 'Altro',
        'name': 'altro',
        'de': '',
        'du': '',
        'icon': 'arrow-forward',
        'note': '',
        'color': '#FFD439',
        'id_google_event':''
      },
    ]
  }
  setBocca() {
    let bocca = [
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
    ]
    return bocca; 
  }
  searchPaziente(event: {component: IonicSelectableComponent,text: string}) {
    console.log("searchPaziente",event)
    let text = event.text.trim();

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

    event.component.items = this.clienti.filter((item) => {
      var str = item.nome_cognome;
      if (str == undefined) {
        str = this.clienti[this.clienti.length - 1].cognome_nome;   
      }
      
      if (
        str.toUpperCase().indexOf(text) >= 0 || str.toLowerCase().indexOf(text) >= 0 || str.indexOf(text) >= 0) {          
          this.cli_cod_cli = item.cod_cli;
          this.customerNameControl.setValue(item.firstName)
          console.log(str + ' - ' + text);
          console.log(str.indexOf(text));
          return true
      }
      return false
    });
    event.component.endSearch();
  }

  onSearchFail(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    if (event.component.hasSearchText) {
      console.log("onSearchFail",event.component.searchText);
    }
  }
  onSearchSuccess(event: { component: IonicSelectableComponent, text: string}) {
    // Hide form.    
    event.component.hideAddItemTemplate();
  }

  onAddPaziente(event: {
    component: IonicSelectableComponent
  }) {
    // Clean form.
    this.customerSurnameControl.reset();
    this.customerNameControl.reset();
    this.customerCityControl.reset();
    this.customerBirthdateControl.reset();
    this.customerGenderControl.reset();
    event.component.showAddItemTemplate();
  }
  addPaziente(event: {
    component: IonicSelectableComponent
  }) {
    // Create port.
    const data = JSON.parse(localStorage.getItem("userData"));    

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
    this.authService.postData(this.customer, "creaCliente").then(
      (result) => {
        
        console.log("creaCliente");
        let tmpClienti = JSON.parse(sessionStorage.getItem("clienti"));
        tmpClienti.push(result['retGetCli'][0]);
        sessionStorage.setItem("clienti",JSON.stringify(tmpClienti));

        this.clienti.push({
          cod_ut: this.medico != '' ? this.medico : data['userData']['cod_ut'],
          cod_cli: result['cod_cli'],
          cognome: this.customerSurnameControl.value,
          nome: this.customerNameControl.value,
          cognome_nome: this.customerSurnameControl.value + ' ' + this.customerNameControl.value,
          data_nascita: this.customerBirthdateControl.value,
          sesso: this.customerGenderControl.value
        })
        let cli = [];
        cli.push({
          cod_ut: this.medico != '' ? this.medico : data['userData']['cod_ut'],
          cod_cli: result['cod_cli'],
          cognome: this.customerSurnameControl.value,
          nome: this.customerNameControl.value,
          cognome_nome: this.customerSurnameControl.value + ' ' + this.customerNameControl.value,
          data_nascita: this.customerBirthdateControl.value,
          sesso: this.customerGenderControl.value
        })

        this.customerComponent.addItem(cli).then(() => {
          this.customerComponent.search(cli[0].cognome_nome);
        });


        this.customerSurnameControl.reset();
        this.customerNameControl.reset();
        this.customerCityControl.reset();
        this.customerBirthdateControl.reset();

        // Show list.
        this.customerComponent.hideAddItemTemplate();

      }, (err) => {

      });
  }
  setStatino(lavori,griglia_denti,cod_statino,flag,event){
      console.log("1)",lavori)
      this.tipo_lavori = lavori;
      console.log("2)",griglia_denti)
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
  }
  visualizzaListaStatini() {
    console.log("visualizzaListaStatini")
    try {
      this.nav.push(CercaStatinoPage, { event: this.event });      
    } catch (error) {
      console.error(error.stack);
    }
  }
  onChangePaziente(event: {component: IonicSelectableComponent}) {
    console.log("onChangePaziente")
    this.abilitaSalva = 3 ;  
    if (event["value"] != null && event["value"] !== undefined) {
      let flag = 1 ;
      if(event["value"].cod_statino != null) flag--;      
      if (flag > 0) {
        this.tipo_lavori = this.setLavori() ;
        this.bocca = this.setBocca();        
        this.aggiornaAbilitaSalva['paziente'] = false ;
        this.AbilitaSalva('paziente'); 
      } else {
        let alert = this.alertCtrl.create({
          title: 'Il paziente ha già un lavoro in corso.',
          subTitle: '',
          buttons: [{
            text: 'Visualizza gli statini',
            handler: () => { 
              //this.visualizzaListaStatini(event,flag);
              this.event = event;
              this.nav.push(CercaStatinoPage, { event: event }); 
              this.visualizzastatini = true;            
            }
          },{
            text: 'Crea nuovo statino',
            handler: () => {
              this.tipo_lavori = this.setLavori() ;
              this.bocca = this.setBocca();
              this.AbilitaSalva('paziente'); 
              this.event = event;
              this.visualizzastatini = true; 
            }
          }],enableBackdropDismiss: false
        });
        alert.present();        
      }          
    }    
  }
  onSavePaziente(event: {component: IonicSelectableComponent}) {
    // Fill form.
    let item = event['item'] ;
    console.log("onSavePaziente",item)
    this.customer = item
    this.customerNameControl.setValue(item.nome);
    this.customerSurnameControl.setValue(item.cognome);
    this.customerCityControl.setValue(item.luogo_di_nascita);
    this.customerBirthdateControl.setValue(item.data_nascita);
    this.customerGenderControl.setValue(item.sesso);
    // Show form.
    event.component.showAddItemTemplate();
  }
  savePaziente(event: {component: IonicSelectableComponent}) {
    this.customerComponent.showLoading();
    console.log("savePaziente",event);    
    this.customer = {
      sureName: this.customerSurnameControl.value,
      firstName: this.customerNameControl.value,
      customerCity: this.customerCityControl.value,
      birthDate: this.customerBirthdateControl.value,
      gender: this.customerGenderControl.value,      
      cod_ut: this.customer.cli_cod_ut,
      cod_cli: this.customer.cli_cod_cli
    }
    console.log(this.customer)
    // Add port to storage.
    this.authService.postData(this.customer, "creaCliente").then(
      (result) => {
        console.log("result",result)
        this.customerSurnameControl.reset();
        this.customerNameControl.reset();
        this.customerCityControl.reset();
        this.customerBirthdateControl.reset();
        this.customerGenderControl.reset();
        // Show list.
        this.customerComponent.hideAddItemTemplate();

      }, (err) => {
        console.error("creaCliente",err)
      });

    this.customerComponent.hideAddItemTemplate();
    this.customerComponent.hideLoading();
  }
  setMaxStatino() {
    let tmpToSend = this.userDetails;
    console.log('setMaxStatino');
    this.authService.postData(tmpToSend, "setMaxStatino").then(
      (result) => {
        console.log("result", result)
        this.resultSetMaxStatino = result;
        if(this.resultSetMaxStatino.status == 'OK') {
          this.Cod_Statino = this.resultSetMaxStatino.cod_statino;
          localStorage.setItem('cod_statino', this.Cod_Statino)
          localStorage.setItem('id_google_folder', this.resultSetMaxStatino.id_google_folder)
        } else {
          console.log('setMaxStatino error:'+this.resultSetMaxStatino.msg);
        }        
      }, (err) => {
        //gestione errore clienti 
      });
  }

  AbilitaSalva(key, val = '') {
    //console.log('AbilitaSalva',key);
    if (!this.aggiornaAbilitaSalva[key] && key != 'dente') {
      this.aggiornaAbilitaSalva[key] = true;
      console.log('Decremento da '+key);
      this.abilitaSalva--;

    } else {

      if (!this.aggiornaAbilitaSalva[key]) {
        this.aggiornaAbilitaSalva[key] = true;
        console.log('Decremento abilitaSalva');
        this.abilitaSalva--;
      } else if (this.aggiornaAbilitaSalva[key] && val == 'base') {
        var temp = false;
        for (let index = 0; index < this.bocca.length; index++) {
          const arcata = this.bocca[index];
          for (let j = 0; j < arcata.denti.length; j++) {
            const dente = arcata.denti[j];
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
        } else {
          console.log('NON Incremento abilitaSalva');
        }


      } else if (!this.aggiornaAbilitaSalva[key] && val != 'base') {
        console.log('Decremento abilitaSalva');
        this.abilitaSalva--;
      }
    }
  }
  getClienti() {
    console.log("getClienti")
    this.common.presentLoading();

    let tmpToSend = '';
    if (this.medico == '') {
      tmpToSend = this.clientiPostData.cod_ut;
    } else {
      tmpToSend = this.medico;
    }

    this.authService.postData(tmpToSend, "getClienti").then(
      (result) => {
        this.CliResposeData = result;

        if (this.CliResposeData.cliData) {
          this.common.closeLoading();
          this.clienti = this.CliResposeData.cliData;
          console.log("this.clienti",this.clienti)
          sessionStorage.setItem("clienti",JSON.stringify(this.clienti));
        }


      }, (err) => {
        this.common.closeLoading();
        let alert = this.alertCtrl.create({

          title: 'Qualcosa è andato storto!',
          subTitle: err.statusText,
          buttons: [{
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.nav.setRoot(TabsPage);
            }
          }],enableBackdropDismiss: false
        });
        alert.present();
      });
  }
  getMedico() {
    this.common.presentLoading();
    this.authService.postData(this.mediciPostData, "getMedici").then(
      (result) => {
        this.mediciResponseData = result;
        //console.log(this.mediciResponseData) ;
        if (this.mediciResponseData.mediciData) {
          this.common.closeLoading();
          this.odontoiatra = this.mediciResponseData.mediciData;
          console.log('getMedico')
          this.abilitaSalva--;
        }
      }, (err) => {
        this.common.closeLoading();
        let alert = this.alertCtrl.create({

          title: 'Qualcosa è andato storto!',
          subTitle: err.statusText,
          buttons: [{
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.nav.setRoot(TabsPage);
            }
          }]
        });
        alert.present();
      });
  }
  annullaStatino() {
    this.nav.setRoot(TabsPage);
  }

  removeByAttr = function (arr, attr, value) {
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
    return { "arr" : JSON.stringify(arr) , "obj" : obj }
  }

  saveStatino(mod) {
    console.log(mod +" Statino ")
    console.log("tipo_lavori",this.tipo_lavori)
    if (this.Cod_Statino==null) {
      this.Cod_Statino = localStorage.getItem('cod_statino')
    }
    this.arrToSend[0] = this.bocca;
    this.arrToSend[1] = this.tipo_lavori;    
    this.arrToSend[2] = this.paziente['cli_cod_cli'] == undefined ? this.cli_cod_cli : this.paziente['cli_cod_cli'];
    this.arrToSend[3] = this.userDetails.cod_ut;
    if (this.medico == '') {
      this.arrToSend[4] = this.clientiPostData.cod_ut;
    } else {
      this.arrToSend[4] = this.medico;
    }
    this.arrToSend[5] = this.Cod_Statino
    this.arrToSend[6] = this.preventivo;
    this.arrToSend[7] = this.modalita;

    var arrNote = {};
    arrNote['superiore'] = '';
    arrNote['inferiore'] = '';
    for (let index = 1; index <= this.noteEmail.length; index++) {
      if (this.noteEmail[index]!= undefined) {
        arrNote['superiore'] = index <= 28 ? arrNote['superiore'] +', '+ this.noteEmail[index] : arrNote['superiore'];
        arrNote['inferiore'] = index > 28 ? arrNote['inferiore'] +', '+ this.noteEmail[index] : arrNote['inferiore'];  
      }         
    }
    arrNote['superiore'] = arrNote['superiore'].substring(1);
    arrNote['inferiore'] = arrNote['inferiore'].substring(1);
    this.arrToSend[8] = arrNote;
    this.common.presentLoading();
    this.authService.postData(this.arrToSend, "salvaStatino").then(
      (result) => {
        this.resposeData = result;
        console.log(this.resposeData);
        if (this.resposeData.statinoSalvato == 'OK') {
          sessionStorage.removeItem(this.arrToSend[2]);
          //let tmpClienti = JSON.parse(sessionStorage.getItem("clienti"));
          //var retObj = this.removeByAttr(tmpClienti, 'cli_cod_cli', this.arrToSend[2]);
          //console.log("this.resposeData",this.resposeData)
          //tmpClienti.push(result['retGetCli'][0]);
          //sessionStorage.setItem("clienti",JSON.stringify(tmpClienti));
          
          this.common.closeLoading();
          let alert = this.alertCtrl.create({

            title: 'Statino ' + mod == 'EDIT' ? 'aggiornato' : 'salvato' +' correttamente',
            subTitle: 'Codice lavoro : ' + this.Cod_Statino ,
            buttons: [{
              text: 'OK',
              handler: () => {
                this.nav.setRoot(TabsPage);
              }
            }],enableBackdropDismiss: false
          });

          alert.present();
          if( this.Cod_Statino == localStorage.getItem('cod_statino')) {
            localStorage.setItem('cod_statino', '')
            localStorage.setItem('id_google_folder', '')
            this.setMaxStatino();
          }          
        }
      }, (err) => {
        //gestione errore clienti 
        console.log(err)
        this.common.closeLoading();
        let alert = this.alertCtrl.create({

          title: 'Qualcosa è andato storto!',
          subTitle: err.statusText,
          buttons: [{
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.nav.setRoot(TabsPage);
            }
          }],enableBackdropDismiss: false
        });
        alert.present();
      });
  }
  visualizzaData(a) {
    var myData = a.split("-");
    var tmp = myData[2];
    if (tmp.indexOf('T') < 0) {
      return myData[2] + '/' + myData[1] + '/' + myData[0];
    } else {
      var myData2 = tmp.split("T");
      return myData2[0] + '/' + myData[1] + '/' + myData[0];
    }

  }
  verificaDeDu(item) {
    if (item.de != '' && item.du != '') {
      this.AbilitaSalva('lavoro');
      return true;
    }
  }
  openNavDetailsDenti(indice, jndice, item) {

    console.log('Dente:' + item['id']);

    let alert = this.alertCtrl.create();

    alert.setTitle('Dente numero ' + item['id']);
    
    for (let key in item) {
      if (key != 'id' && key != 'classe' && key != 'colonna') {
        let v = item[key];
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
      handler: data => {

        for (let key in item) {
          if (key != 'id' && key != 'classe') {
            this.bocca[indice].denti[jndice][key] = 0;
          }
        }
        this.bocca[indice].denti[jndice]['classe'] = 'base';

        let classe_css = '';
        for (let k in data) {

          this.bocca[indice].denti[jndice][data[k]] = 1;
          classe_css += data[k] + '_';
        }
        classe_css = classe_css.substring(0, classe_css.length - 1);
        if (classe_css == '') classe_css = 'base';
        this.bocca[indice].denti[jndice]['classe'] = classe_css;
        this.AbilitaSalva('dente', this.bocca[indice].denti[jndice]['classe']);
        
        if (this.bocca[indice].denti[jndice]['classe'] === 'base') {
          delete this.noteEmail[item['id']];
        } else {
          this.noteEmail[item['id']] = item['id']+' - '+this.bocca[indice].denti[jndice]['classe'] ;
        }
        console.log(this.noteEmail);
      }
    });
    alert.present();
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  openNavDetailsPage(item) {
    console.log('openNavDetailsPage',item);
    item.cod_statino = this.Cod_Statino;
    item.modalita = this.modalita ;
    this.nav.push(DettaglioStatinoPage, { item: item });
  }
  openFotosPage(item) {

    this.nav.push(FotoStatinoPage, { item: item });
  }
  buildISODate(date, time) {
    var dateArray = date && date.split('-');
    var timeArray = time && time.split(':');
    var normalDate = new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]), parseInt(timeArray[0]), parseInt(timeArray[1]), 0, 0);
    return normalDate.toISOString();
  }

  addAttendees() {
    if (this.attendees[this.attendees.length - 1].email == '') return;
    var newAttendee = { email: "" };
    this.attendees.unshift(newAttendee);
  }

  removeAttendees(itemIndex) {
    this.attendees.splice(itemIndex, 1);
  }

  popLastAttendeeIfEmpty(itemsList) {
    if (!!itemsList.length) {
      return itemsList[0]["email"] == "" ? itemsList.shift(itemsList[0]) : itemsList;
    }
    return [];
  }

  validate() {
    return this.isStringValid(this.calendarEvent.name) &&
      this.isStringValid(this.calendarEvent.name) &&
      this.isStringValid(this.calendarEvent.location) &&
      this.isStringValid(this.calendarEvent.description) &&
      this.isStringValid(this.calendarEvent.startDate) &&
      this.isStringValid(this.calendarEvent.startTime) &&
      this.isStringValid(this.calendarEvent.endDate) &&
      this.isStringValid(this.calendarEvent.endTime) &&
      this.areAttendeesValid(this.attendees);
  }
  isStringValid(str) {
    if (typeof str != 'undefined' && str) {
      return true;
    };
    return false;
  }

  areAttendeesValid(attendees) {
    if (attendees.length == 1 && !this.isStringValid(attendees[0]["email"])) {
      return false;
    }
    return true;
  }
}

@Component({
  templateUrl: 'dettaglio-statino.html',
})
export class DettaglioStatinoPage {

  item;
  description = '';
  startDate = '';
  //startDate: String = new Date().toISOString();
  startTime = '';
  endDate = '';
  endTime = '';

  
  public photos: any;
  public images: any;
  public tempPh: any;
  public resp: any;
  public base64Image: string;
  public i: any;
  public fileImage: string;
  public responseData: any;



  userData = { user_id: "", token: "", cod_statino: "", imageB64: "", tipolavoro: "", id_google_folder: "" };

  constructor(
     
    params: NavParams,
    public navCtrl: NavController,
    private camera: Camera,
    private alertCtrl: AlertController,
    public authService: AuthService
  ) {
    if ( params.data.item.modalita != 'EDIT' || 
      (params.data.item.modalita == 'EDIT' && params.data.item.de == '') 
      ) {
      params.data.item.de = new Date().toISOString();
    }
    this.item = params.data.item;

  }
  openFotosPage(item, startDate, endDate) {
    localStorage.setItem('tipolavoro', item);
  }

    ngOnInit() {
    console.log('ngOnInit')
    this.i = 0;
    this.photos = [];
    this.getPhotos();
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: "Sicuro che vuoi Cancellare la foto? Non si può tornare indietro!",
      message: "",
      buttons: [
        {
          text: "No",
          handler: () => {
            console.log("Disagree clicked");
          }
        },
        {
          text: "Yes",
          handler: () => {
            console.log("Agree clicked");
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }

  getPhotos() {
    console.log('getPhotos');
    var userDataObj = JSON.parse(localStorage.getItem("userData"));
    let cod_statino = localStorage.getItem('cod_statino');

    this.userData.user_id = userDataObj.userData["user_id"];
    this.userData.token = userDataObj.userData["token"];
    this.userData.cod_statino = cod_statino;
    this.userData.tipolavoro = localStorage.getItem("tipolavoro");

    this.authService.postData(this.userData, "getImages").then(
      result => {
        this.resp = result;
        if (this.resp.imageData) {

          var photos = {}
          photos = this.resp;

          var resultArray2 = Object.keys(photos['imageData']).map(function (personNamedIndex) {
            let foto = photos['imageData'][personNamedIndex];
            return "data:image/jpeg;base64," + foto.photo;
          });
          this.photos = resultArray2;
        }
      },
      err => { console.log('err ' + err); }
    );

  }

  takePhoto(item) {
    console.log('takePhoto up', this.photos)
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      //targetWidth: 450,
      //targetHeight: 450,
      //saveToPhotoAlbum: false
      saveToPhotoAlbum: JSON.parse(localStorage.getItem("userData")).userData.saveToPhotoAlbum * 1 ? true : false
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.photos.push(this.base64Image);
        this.images[this.images.length] = "data:image/jpeg;base64," + imageData
        this.photos.reverse();
        this.sendData(imageData);

      },
      err => {
        console.log(err);
      }
    );
  }

  sendData(imageData) {
    var userDataObj = JSON.parse(localStorage.getItem("userData"))
    this.userData.imageB64 = imageData;
    this.userData.user_id = userDataObj.userData["user_id"];
    this.userData.token = userDataObj.userData["token"];
    this.userData.cod_statino = localStorage.getItem('cod_statino');
    this.userData.tipolavoro = localStorage.getItem("tipolavoro");
    this.userData.id_google_folder = localStorage.getItem("id_google_folder");
    console.log("pippo", this.userData)
    this.authService.postData(this.userData, "userImage").then(

      result => {
        this.responseData = result;
        console.log('result ' + result);
      },
      err => {
        // Error log
        console.log('err ' + err);
      }
    );
  }
}

@Component({
  templateUrl: 'cerca-statino.html',
  selector:'CercaStatinoPage  '
})
export class CercaStatinoPage {

  public item;
  ports: any[];
  port: any;

  description = '';
  startDate = '';
  startTime = '';
  endDate = '';
  endTime = '';
  profilo = '';
  buttonDisabled = true;
  clientiPostData: any;
  CliResposeData: any ;
  clienti: any;
  public resposeData: any;
  public dataSet: any;
  public app: App;
  public titleHeader: any;
  customerNameControl: FormControl;
  userPostData = {
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
    cli_cod_cli:""
  };
  cli_cod_cli: any;
  
  @ViewChild('customerComponent') customerComponent: IonicSelectableComponent;

  constructor(
    params: NavParams, 
    public authService: AuthService, 
    public common: Common, 
    public nav: NavController, 
    public toastCtrl: ToastController,
    private alertCtrl: AlertController) {

      this.item = params.data;
      console.log("params.data",params.data)
      if (params.data.event === undefined ) {
        this.dataSet = 'no_data';
        this.titleHeader = 'Cerca Lavori';
      } else {
        
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
      } else {
        this.clienti = JSON.parse(sessionStorage.getItem("clienti"));
      }
      console.log("constructor")
  }
  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('port:', event.value);
  }

  getClienti() {
    console.log("getClienti")
    this.common.presentLoading();

    let tmpToSend = JSON.parse(localStorage.getItem("userData")).userData.cod_ut;

    this.authService.postData(tmpToSend, "getClienti").then(
      (result) => {
        this.CliResposeData = result;

        if (this.CliResposeData.cliData) {
          this.common.closeLoading();
          this.clienti = this.CliResposeData.cliData;          
          sessionStorage.setItem("clienti",JSON.stringify(this.clienti));
        }


      }, (err) => {
        this.common.closeLoading();
        let alert = this.alertCtrl.create({

          title: 'Qualcosa è andato storto!',
          subTitle: err.statusText,
          buttons: [{
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.nav.setRoot(TabsPage);
            }
          }]
        });
        alert.present();
      });
  }

  doCercaStatino(message) {
    
    this.common.presentLoading();
    const data = JSON.parse(localStorage.getItem("userData"));
    this.userPostData = data.userData;
    this.userPostData.startDate = this.startDate;
    this.userPostData.endDate = this.endDate;
    this.userPostData.tipo = message;
    this.userPostData.cli_cod_cli = this.cli_cod_cli ;
    console.log("doCercaStatino", this.userPostData)
    let sessionCli  = JSON.parse(sessionStorage.getItem(this.cli_cod_cli));
    if ( sessionCli == null ) {
      this.authService.postData(this.userPostData, "getStatini").then(
        result => {
          this.resposeData = result;
          this.common.closeLoading();
          if (this.resposeData.statiniData) {
            this.dataSet    = this.resposeData.statiniData;
            console.log("dataSet of "+this.cli_cod_cli,this.dataSet);
            sessionStorage.setItem(this.cli_cod_cli,JSON.stringify(this.dataSet));  
            this.titleHeader = 'Lista Lavori';
          } else {
            const toast = this.toastCtrl.create({
              message: 'Nessun risultato per la tua ricerca',
              showCloseButton: true,
              position: 'top',
              closeButtonText: 'Ok'
            });
            toast.present();
            console.log("No data found");
          }
        },
        err => {
          this.common.closeLoading();
          //Connection failed message
        }
      );
    } else {
        this.dataSet     = sessionCli;
        this.titleHeader = 'Lista Lavori';
        this.common.closeLoading();
    }
  }
  searchPaziente(event: {component: IonicSelectableComponent,text: string}) {
    try {      
      let text = event.text.trim();
  
      event.component.items = this.clienti.filter((item) => {
        var str = item.nome_cognome;
        if (str == undefined) {
          str = this.clienti[this.clienti.length - 1].cognome_nome;   
        }
        
        if (
          str.toUpperCase().indexOf(text) >= 0 || str.toLowerCase().indexOf(text) >= 0 || str.indexOf(text) >= 0) {
            console.log(str + ' - ' + text);
            console.log(str.indexOf(text));
            return true
        }
        return false
      });
      event.component.endSearch(); 
    } catch (error) {
      console.error(error.stack)
    }    
  }

  onSearchSuccess(event: { component: IonicSelectableComponent, text: string}) {
    // Hide form.    
    event.component.hideAddItemTemplate();
  }

  onChangePaziente(event: {component: IonicSelectableComponent}) {
    this.cli_cod_cli = event["value"].cli_cod_cli;
  }

  openNavEditMainStatino(item) {
    var objToSent = {"lavori":"","griglia_denti":"","tipo_lavori":"","bocca":"","Cod_Statino":"","sesso":"","nome_cli":"","cognome_cli":"","cli_cod_cli":""};
    console.log("openNavEditMainStatino",item);
    objToSent.lavori = item.lavori;
    objToSent.griglia_denti = item.griglia_denti;    
    objToSent.tipo_lavori = JSON.parse(objToSent.lavori);
    objToSent.bocca = JSON.parse(objToSent.griglia_denti);
    objToSent.Cod_Statino = item.cod_statino;
    objToSent.sesso = item.sesso;
    objToSent.nome_cli = item.nome_cli;
    objToSent.cognome_cli = item.cognome_cli;
    objToSent.cli_cod_cli = this.cli_cod_cli;
    console.log("objToSent",objToSent);
    this.nav.push(StatinoPage, { edit: objToSent });
  }
  onSearchFail(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    if (event.component.hasSearchText) {
      console.log("onSearchFail",event.component.searchText);
    }
  }
}

@Component({
  templateUrl: 'foto-statino.html',
})
export class FotoStatinoPage {

  public photos: any;
  public images: any;
  public tempPh: any;
  public resp: any;
  public base64Image: string;
  public i: any;
  public fileImage: string;
  public responseData: any;



  userData = { user_id: "", token: "", cod_statino: "", imageB64: "", tipolavoro: "", id_google_folder: "" };

  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private alertCtrl: AlertController,
    public authService: AuthService
  ) {


  }

  ngOnInit() {
    console.log('ngOnInit')
    this.i = 0;
    this.photos = [];
    this.getPhotos();
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: "Sicuro che vuoi Cancellare la foto? Non si può tornare indietro!",
      message: "",
      buttons: [
        {
          text: "No",
          handler: () => {
            console.log("Disagree clicked");
          }
        },
        {
          text: "Yes",
          handler: () => {
            console.log("Agree clicked");
            this.photos.splice(index, 1);
          }
        }
      ]
    });
    confirm.present();
  }

  getPhotos() {
    console.log('getPhotos');
    var userDataObj = JSON.parse(localStorage.getItem("userData"));
    let cod_statino = localStorage.getItem('cod_statino');

    this.userData.user_id = userDataObj.userData["user_id"];
    this.userData.token = userDataObj.userData["token"];
    this.userData.cod_statino = cod_statino;
    this.userData.tipolavoro = localStorage.getItem("tipolavoro");

    this.authService.postData(this.userData, "getImages").then(
      result => {
        this.resp = result;
        if (this.resp.imageData) {

          var photos = {}
          photos = this.resp;

          var resultArray2 = Object.keys(photos['imageData']).map(function (personNamedIndex) {
            let foto = photos['imageData'][personNamedIndex];
            return "data:image/jpeg;base64," + foto.photo;
          });
          this.photos = resultArray2;
        }
      },
      err => { console.log('err ' + err); }
    );

  }

  takePhoto(item) {
    console.log('takePhoto', this.photos)
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      //targetWidth: 450,
      //targetHeight: 450,
      //saveToPhotoAlbum: false
      saveToPhotoAlbum: JSON.parse(localStorage.getItem("userData")).userData.saveToPhotoAlbum * 1 ? true : false
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.images.push(imageData)
        this.photos.push(this.base64Image);
        this.photos.reverse();
        this.sendData(imageData);

      },
      err => {
        console.log(err);
      }
    );
  }

  sendData(imageData) {
    var userDataObj = JSON.parse(localStorage.getItem("userData"))
    this.userData.imageB64 = imageData;
    this.userData.user_id = userDataObj.userData["user_id"];
    this.userData.token = userDataObj.userData["token"];
    this.userData.cod_statino = localStorage.getItem('cod_statino');
    this.userData.tipolavoro = localStorage.getItem("tipolavoro");
    this.userData.id_google_folder = localStorage.getItem("id_google_folder");
    console.log("pippo", this.userData)
    this.authService.postData(this.userData, "userImage").then(

      result => {
        this.responseData = result;
        console.log('result ' + result);
      },
      err => {
        // Error log
        console.log('err ' + err);
      }
    );
  }
}