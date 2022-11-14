import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoadingController, ToastController } from '@ionic/angular';
import { monthsNumbers } from '../utils';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  loading: HTMLIonLoadingElement;
  selectedLang: string;
  isLoading = false;
  

  constructor(
    private loadingController: LoadingController,
    private http: HttpClient,
    private toastController: ToastController,

  ) { }

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




}
