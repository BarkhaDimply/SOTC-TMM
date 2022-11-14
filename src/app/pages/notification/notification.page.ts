import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Location } from '@angular/common';



import { ActivatedRoute } from '@angular/router';

import { Plugins } from '@capacitor/core';
const { PushNotifications } = Plugins;

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  notificationHistory: any;
  noNotification: boolean;
  id = null;


  constructor(
    private globalService: GlobalService,
    private apiServices:ApiService,
    private alertController: AlertController,
    private location: Location,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.getNorification();
    console.log('notifi');
   
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });


    
    
  }

  resetBadgeCount() {
    PushNotifications.removeAllDeliveredNotifications();
  }

 

  back(){
    this.location.back();
  }

  getNorification(){

   // this.globalService.presentLoading();
    this.apiServices.getHistoryNotification().subscribe((result:any) => {
     // this.globalService.dismissLoading();

      this.notificationHistory = result.data;
      console.log("notification::::",result);

      if(result.data == ''){

        this.noNotification = true;
      }
    });

  }


  async notifyAlert(title:any,msg:any,id:any) {

    const alert = await this.alertController.create({
      header: title,
      message: msg,
      mode: 'ios',
      buttons: [
        {
          text: 'Reject',
          //role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            let params: any = {
              "transaction_id": id,
              "status": 'Reject'

            }

            this.apiServices.tmStatusUpdateAccept(params).subscribe(async (result: any) => {

              if(result.status == 'false'){
                const alert = await this.alertController.create({
                  cssClass: 'my-custom-class',
                  message: result.message,
                  mode: 'ios',
                  buttons: ['OK']
                });
                await alert.present();
                return false;
              }else{
              const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                message: 'Transaction Rejected',
                mode: 'ios',
                buttons: ['OK']
              });
              await alert.present();
              window.location.reload();
            }
            })


          }
        }, {
          text: 'Accept',
          handler: () => {
            let params: any = {
              "transaction_id": id,
              "status": 'Accept'

            }

            this.apiServices.tmStatusUpdateAccept(params).subscribe(async (result: any) => {


              if(result.status == 'false'){
                const alert = await this.alertController.create({
                  cssClass: 'my-custom-class',
                  message: result.message,
                  mode: 'ios',
                  buttons: ['OK']
                });
                await alert.present();
                return false;
              }else{

              const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                message: 'Transaction Accepted',
                mode: 'ios',
                //buttons: ['OK']
              });
              await alert.present();
              window.location.reload();
            }
          })

          }
        }
      ]
    });

    await alert.present();

  }


}
