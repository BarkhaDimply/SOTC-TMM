import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { branches, nonce } from 'src/app/services/utils';
import { GlobalService } from 'src/app/services/global/global.service';
import { FcmService } from 'src/app/services/fcm/fcm.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: UntypedFormGroup;
  errorMessage: any;
  serverMessage = [];
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

  getOtp: any;

  constructor(
    private globalService: GlobalService,
    public router: Router,
    private navController: NavController,
    private auth: AuthService,
    private alertController: AlertController,
    private fomrBuilder: UntypedFormBuilder,
    private fcmService: FcmService,
  ) {
    this.loginForm = this.fomrBuilder.group({
      manager_number: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.selectBranch();
  }

  selectBranch() {
    let options = [];
    const branchOptions = branches;
    branchOptions.forEach((element, index) => {
      options.push({
        type: 'radio',
        label: element,
        value: element,
        checked: index === 0 ? true : false
      });
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
              const url = this.globalService.setBaseURL(data);
              this.auth.baseURLEvent.next(url);
            }
          }
        }
      ]
    }).then(res => {
      res.present();
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

    this.auth.loginManager(request).subscribe(async (result: any) => {
      if (result.status == true) {
        this.OTP_box = true;
        localStorage.setItem('manager_id', result.manager_id);
        localStorage.setItem('manager_name', result.manager_name)
        this.loginResponse = result;
      } else {
        this.globalService.presentToast(result.msg);
        this.loginForm.reset();
      }
    });
  }

  onOtpChange(otp) {
    if (otp.length === 4) {
      this.getOtp = otp;
    }
  }

  async verifyOtp() {
    this.otp = this.getOtp;
    if (typeof this.otp == 'undefined') {
      this.globalService.presentToast('Plase enter otp');
      return false;
    }
    if (atob(this.loginResponse.otp).toString() === this.otp.toString()) {
      this.tourManagerActiveGroup(this.loginResponse.manager_id);
    } else {
      this.globalService.presentToast('Plase enter valid otp');
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
        this.getHubList(result.data[0]);
      } else {
        this.globalService.presentToast(result.error);
        return;
      }
    });
  }

  getHubList(data) {
    let request = {
      'login_code': data['tourCode'],
      'nonce': nonce
    };
    this.auth.login(request).subscribe(async (result: any) => {
      if (result?.status === true) {
        localStorage.setItem('user', JSON.stringify(result.data));
        localStorage.setItem('agency_logo', result.data.agency_logo);
        this.globalService.appLogoEvent.next(result.data.agency_logo);
        this.loadModal(result.data.hub_list);
        // localStorage.setItem('hubList', JSON.stringify(result.data.hub_list)); // no need
      } else {
        this.globalService.presentToast(result.error);
        return;
      }
    });
  }


  loadModal(hub_list) {
    let options = [];
    hub_list.forEach((element, index) => {
      options.push({
        type: 'radio',
        label: element,
        value: element,
        checked: index === 0 ? true : false
      });
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
              // this.getSaveManagerHub();
              this.auth.userLoggedIn.next("loggedin");
              this.getFcmTokenNoty();
              this.getSaveManagerHub();
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
    this.auth.getFcmToken(params).subscribe((result: any) => {
      console.log("notification fcm::::", result);
    });

  }

  getSaveManagerHub() {
    let params: any = {}
    var Users: string = localStorage.getItem("user");
    params.driver_id = localStorage.getItem("manager_id");
    params.hub = localStorage.getItem("selected_hub");
    params.group_id = JSON.parse(Users).order_id;
    params.nonce = nonce;
    this.auth.saveManagerHub(params).subscribe(async (result: any) => {
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
