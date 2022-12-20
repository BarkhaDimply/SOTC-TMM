import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoadingController, ToastController } from '@ionic/angular';
import { monthsNumbers } from '../utils';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AuthService } from '../auth/auth.service';


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

  constructor(
    private loadingController: LoadingController,
    private http: HttpClient,
    private toastController: ToastController,
    private auth: AuthService,
    

  ) { 
   
  }

  async presentLoading() {
    // this.loading = await this.loadingController.create({
    //   cssClass: 'my-custom-class custom-loading',
    //   message: 'Please wait...',
    //   spinner: "lines-sharp",
    // });
    // await this.loading.present();

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


    // this.isLoading = false;
    // return await this.loadingController.dismiss().then(() => console.log('dismissed'));
 


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


  getCheckActiveManager(){

    this.active_group = JSON.parse(localStorage.getItem('active_group'));

    let request = {
      'login_code': this.active_group[0]['tourCode'],
      'nonce': 'KHsD(PF3JzQfT)nm3l^TERO'
    };

    this.auth.login(request).subscribe(async (result: any) => {

      console.log("aaaaaaa request:::::111",result);

      if(result.data != ''){
        this.agency_logo = result?.data?.agency_logo


        localStorage.setItem('agency_logo',this.agency_logo);

        console.log("agency_logo request:::::111",this.agency_logo);
      }

    });

  }

}
