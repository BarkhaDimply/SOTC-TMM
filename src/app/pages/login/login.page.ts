import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { nonce } from 'src/app/services/utils';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GlobalService } from 'src/app/services/global/global.service';
import { FcmService } from 'src/app/services/fcm/fcm.service';
import { ApiService } from 'src/app/services/api/api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  loginForm: UntypedFormGroup;
  errorMessage: any;
  serverMessage = [];
  myDeviceToken: string;
  loginResponse = {} as any;
  OTP_box = false;
  otp: any;
  validationMessages = {
    login_code: [
      { type: 'required', message: 'Required' },
    ],
    driver_name: [
      { type: 'required', message: 'Required' },
    ],
    manager_number: [
      { type: 'required', message: 'Required' },
    ],
  };
  recaptchaVerifier = "435435";

  getOtp: any;
  urlBaseChange: any;
  agency_logo: string;
  active_group: any;
  
  constructor(
    private globalService: GlobalService,
    private fireAuth: AngularFireAuth,
    public router: Router,
    private navController: NavController,
    private auth: AuthService,
    private alertController: AlertController,
    private fomrBuilder: UntypedFormBuilder,
    private fcmService: FcmService,
    private platform: Platform,
    private apiServices: ApiService,
  ) {
    this.myDeviceToken = localStorage.getItem('deviceToken') || '';
    this.loginForm = this.fomrBuilder.group({
      manager_number: ['', [Validators.required]]
    });

  }

  ngOnInit() {
  
    this.loadModalLogo();
  }


  getCheckActiveManager(){

    this.active_group = JSON.parse(localStorage.getItem('active_group'));

    let request = {
      'login_code': this.active_group[0]['tourCode'],
      'nonce': 'KHsD(PF3JzQfT)nm3l^TERO'
    };

    this.auth.login(request).subscribe(async (result: any) => {

      if(result.data != ''){
        this.agency_logo = result.data.agency_logo

        localStorage.setItem('agency_logo',this.agency_logo);

      }

    });

    console.log("agency_logo itenry:::::",this.agency_logo);

  }


  initializeApp() { 
    this.platform.ready().then(() => {

      // Trigger the push setup
      this.fcmService.initPush();
    });
  }

  demonstateSubmit() {
    this.errorMessage = [];
    this.serverMessage = [];

    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    let request = this.loginForm.value;
    request.nonce = nonce;

    if (request.manager_number) {

      request.manager_number = '91' + request.manager_number;
    }
    console.log(request);

    this.auth.loginManager(request).subscribe(async (result: any) => {

      if (result.status == true) {
        this.OTP_box = true;
        localStorage.setItem('manager_id', result.manager_id);
        localStorage.setItem('manager_name', result.manager_name)
        this.loginResponse = result;


      } else {
        this.serverMessage = result.error;
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          message: result.msg,
          mode: 'ios',
          buttons: ['OK']

        });

        await alert.present();
        this.loginForm.reset();
      }


      // if (result?.status === true) {
      //   this.OTP_box = true;
      //   localStorage.setItem('manager_id', result.manager_id);
      //   localStorage.setItem('manager_name', result.manager_name)
      //   this.loginResponse = result;

      // } else {
      //   this.serverMessage = result.error;
      //   const alert = await this.alertController.create({
      //     cssClass: 'my-custom-class',
      //     message: result.errors,
      //     mode: 'ios',
      //     buttons: ['OK']

      //   });

      //   await alert.present();
      //   this.loginForm.reset();



      // } 
    });
  }

  onOtpChange(otp) {



    if (otp.length === 4) {
      this.getOtp = otp
    }
  }

  async verifyOtp() {

    this.otp = this.getOtp

    if (typeof this.otp == 'undefined') {
      const alert = await this.alertController.create({
        //  cssClass: 'my-custom-class',
        message: 'Plase enter otp',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return false;
    }

    if (atob(this.loginResponse.otp).toString() === this.otp.toString()) {

      this.tourManagerActiveGroup(this.loginResponse.manager_id);




    } else {
      //this.globalService.presentToast("Plase enter valid otp");

      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Plase enter valid otp',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      this.otp = '';
      return;


    }

  }

  tourManagerActiveGroup(id) {
    const data = {
      manager_id: id
    };

    this.auth.apiTourManagerActiveGroup(data).subscribe(async (result: any) => {
      if (result?.status === true) {
        localStorage.setItem('active_group', JSON.stringify(result.data));
        this.login(result.data[0]);
      } else {
        //this.serverMessage = result.error;
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          message: result.error,
          mode: 'ios',
          buttons: ['OK']

        });

        await alert.present();
        return;
      }
    });
  }

  login(data) {
    let request = {
      'login_code': data['tourCode'],
      'nonce': 'KHsD(PF3JzQfT)nm3l^TERO'
    };

    console.log("inside  333", request);

    this.auth.login(request).subscribe(async (result: any) => {

      if (result?.status === true) {

        this.initializeApp();
        this.getFcmTokenNoty();
    
        localStorage.setItem('user', JSON.stringify(result.data));
        localStorage.setItem('hubList', JSON.stringify(result.data.hub_list));
        this.loadModal(result.data.hub_list);

     
       
      } else {
        // this.serverMessage = result.error;
        const alert = await this.alertController.create({
          //cssClass: 'my-custom-class',
          message: result.error,
          mode: 'ios',
          buttons: ['OK']

        });

        await alert.present();
        return;
      }
    });

  }

  loadModalLogo() {

    let options = [];

    const listLogo = ["SOTC", "TC"];

    listLogo.forEach((element, index) => {
      if (index === 0) {
        options.push({
          type: 'radio',
          label: element,
          value: element,
          checked: true
        });
      } else {
        options.push({
          type: 'radio',
          label: element,
          value: element,
        });
      }
    });


    this.alertController.create({
      header: 'Select Branch',
      inputs: options,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Done',
          handler: (data: any) => {
            if (data != '') {

              console.log("data:::", data);

              if (data == 'SOTC') {
                // this.urlBaseChange = 'https://sotcconnect.travelexic.com'
                 localStorage.setItem('urlBaseChange', this.urlBaseChange);

                this.auth.urlBaseChangeEvent.next("https://sotcconnect.travelexic.com");

              } else {
                // this.urlBaseChange = 'https://tcgateway.travelexic.com'
                 localStorage.setItem('urlBaseChange', this.urlBaseChange);
                this.auth.urlBaseChangeEvent.next("https://tcgateway.travelexic.com");
              }

              //const hubList =  JSON.parse(localStorage.getItem('hubList'));
              // this.loadModal(hubList);
              //console.log("hubbbb:::", hubList);
            }
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }

  loadModal(hub_list) {
    let options = [];
    hub_list.forEach((element, index) => {
      if (index === 0) {
        options.push({
          type: 'radio',
          label: element,
          value: element,
          checked: true
        });
      } else {
        options.push({
          type: 'radio',
          label: element,
          value: element,
        });
      }
    });

    this.alertController.create({
      header: 'Select Hub',
      cssClass: 'my-custom-class',
      inputs: options,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Done',
          handler: (data: any) => {
            if (data != '') {
              localStorage.setItem("selected_hub", data);

              //set hub in db -api
              this.getSaveManagerHub();
            
              this.auth.userLoggedIn.next("loggedin");
              this.navController.navigateRoot(['/']);
            }
          }
        }
      ]
    }).then(res => {
      res.present();
    });
  }


  getFcmTokenNoty() {

    let params: any = {}

    params.driver_id = localStorage.getItem("manager_id");
    params.device = 'android'
    params.fcm_token = localStorage.getItem("FCMTokenKey");

    console.log("params333::::", JSON.stringify(params));

    this.apiServices.getFcmToken(params).subscribe((result: any) => {


      console.log("notification fcm::::", result);


    });

  }

  getSaveManagerHub() {

    let params: any = {}

    var Users: string = localStorage.getItem("user");
    params.driver_id = localStorage.getItem("manager_id");
    params.hub = localStorage.getItem("selected_hub");
    params.group_id = JSON.parse(Users).order_id;
    params.nonce = 'KHsD(PF3JzQfT)nm3l^TERO';

    console.log("hub:::", params);

    this.apiServices.saveManagerHub(params).subscribe(async (result: any) => {

      console.log("hub result:::", result);

      if (result.status == false) {

        const alert = await this.alertController.create({
          message: 'Hub Not Selected',
          mode: 'ios',

        });

        await alert.present();

      }


    });

  }




}
