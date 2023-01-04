import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { branches, monthsNumbers, nonce } from '../utils';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AuthService } from '../auth/auth.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { Plugins, Capacitor } from '@capacitor/core';
const { Network } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  loading: HTMLIonLoadingElement;
  selectedLang: string;
  isLoading = false;
  fileUploadSize = 6291456;
  active_group: any;
  agency_logo: any;
  valueGetLength: any;
  public appLogoEvent = new BehaviorSubject<any>(null);

  constructor(
    private loadingController: LoadingController,
    private http: HttpClient,
    private toastController: ToastController,
    private auth: AuthService,
    private alertController: AlertController,
  
  ) { }

  public setBaseURL(val) {
    let base_url = '';
    if (val === branches[0]) {
      base_url = environment.webserviceSOTC;
      localStorage.setItem('baseURL', base_url);
    } else {
      base_url = environment.webserviceTcil;
      localStorage.setItem('baseURL', base_url);
    }
    return base_url;
  }

  public setAPPLogo(val) {

  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async presentLoadingMemeber() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Please wait...',
      duration: 4000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }



  async dismissLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class custom-loading',
      message: 'Please wait...',
      spinner: "lines-sharp",
      duration: 2000
    });
    await this.loading.dismiss();
  }

  public async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }



  dateFormatted(dateFromIonDatetime) {
    const date = new Date(dateFromIonDatetime);
    return date.getDate() + '.' + monthsNumbers[date.getMonth()] + '.' + date.getFullYear();
  }

  dateTimeFormatted(dateFromIonDatetime) {
    const date = new Date(dateFromIonDatetime);
    const hours = date.getHours();
    // hours = hours % 12;
    // hours = hours ? hours : 12;
    // const ampm = date.getHours() >= 12 ? 'pm' : 'am';
    // + ' ' + ampm
    return date.getDate() + '.' + monthsNumbers[date.getMonth()] + '.' +
      date.getFullYear() + ' ' + hours + ':' + date.getMinutes();
  }


  async takePhoto() {
    let imageUrl = '';
    const errorMessage = [];
    const permission = await Camera.checkPermissions();

    if (permission.photos !== 'granted') {
      await Camera.requestPermissions();
    }

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });

    imageUrl = image.dataUrl;
    const selectedFile = await fetch(imageUrl).then(r => r.blob());

    return { selectedFile, imageUrl, errorMessage };
  }


  calculateImageSize(base64String) {
    let padding;
    if (base64String.endsWith('==')) {
      padding = 2;
    } else if (base64String.endsWith('=')) {
      padding = 1;
    } else {
      padding = 0;
    }
    const base64StringLength = base64String.length;
    return (base64StringLength / 4) * 3 - padding;
  }


  getCheckActiveManager() {
    this.active_group = JSON.parse(localStorage.getItem('active_group')) || null;
    if (this.active_group) {
      let request = {
        'login_code': this.active_group[0]['tourCode'],
        'nonce': nonce
      };
      this.auth.login(request).subscribe(async (result: any) => {
        if (result.data != '') {
          this.agency_logo = result.data.agency_logo
          localStorage.setItem('agency_logo', this.agency_logo);
        }
      });
    }
  }

  async getAlertNotifyRejection() {
    this.valueGetLength = localStorage.getItem('lengthOfValRejc');
    console.log("get legth:::", this.valueGetLength);
    if (this.valueGetLength == 1) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Your transactions have been deleted and auto-submitted for approval.',
        mode: 'ios',
        buttons: ['OK']

      });
      await alert.present();
      localStorage.removeItem('lengthOfValRejc');
    }
  }



  async checkPermission() {
    //return new Promise(async (resolve, reject) => {
    if (Capacitor.platform !== 'web') {
      const status = await BarcodeScanner.checkPermission({ force: true });
      console.log("checkPermission status:::", JSON.stringify(status));

      if (status.granted) {
        return true;
      } else if (status.denied) {
        return false;
      } else if (status.neverAsked) {
        const c = await this.alertController.create({
          cssClass: 'my-custom-class',
          message: 'Please give permission for camera to use expense module',
          mode: 'ios',
          buttons: ['OK']

        });
        await c.present();
        if (!c) { return false; }
      } else if (status.restricted || status.unknown) {
        return false;
      } else {
        BarcodeScanner.checkPermission();

      }
    }
  }

  callNow(m: { phone: string; }) {
    // this.callNumber.callNumber(m.phone, true)
    //   .then(res => console.log('Launched dialer!', res))
    //   .catch(err => console.log('Error launching dialer', err));
    // console.log("phone---",this.callNumber);
  }
}
