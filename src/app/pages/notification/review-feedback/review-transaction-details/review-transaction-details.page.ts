import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { NavigationExtras } from '@angular/router';
import {AlertController, NavController} from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-review-transaction-details',
  templateUrl: './review-transaction-details.page.html',
  styleUrls: ['./review-transaction-details.page.scss'],
})
export class ReviewTransactionDetailsPage implements OnInit {

  transctionHistory:any;
  newTranscationList:any;
  reviewTransctionHistory: any;
  getEditReviewValue: any = [];
  valueGetLength: any;


  constructor(
    private globalService: GlobalService, private router: Router, 
    private apiServices:ApiService, private navCtrl: NavController, private alertController:AlertController
  ) { }

  ngOnInit() {
    this.getReviewTransactionHist();

  }

  getReviewTransactionHist() {
    this.globalService.presentLoading();
  //  this.globalService.dismissLoading();
    var dataView = JSON.parse(localStorage.getItem('view_details'));
    this.getEditReviewValue = dataView;

    console.log("edit review11:",this.getEditReviewValue.id.length);

  }

  editTransaction (details:any){

    //this.globalService.presentLoading();
    this.apiServices.editTRansctionAPI(details.id[0]).subscribe((result:any) => {
     // this.globalService.dismissLoading();
      localStorage.setItem("edit_clicked", 'yes');

      if(result.data.type == 'Exchange' ) {
        let navigationExtras: NavigationExtras = {
          state: {
            details:result.data,

          }
        };
       this.navCtrl.navigateForward(['/tabs/my-expenses/currency-exchange'], navigationExtras);

      } else if(result.data.type == 'misc_collection' ) {
        let navigationExtras: NavigationExtras = {
          state: {
            details:result.data,

          }
        };
       this.navCtrl.navigateForward(['/tabs/my-expenses/misc-collection'], navigationExtras);

      } else if(result.data.type == 'cross_currency_by_card' ) {
        let navigationExtras: NavigationExtras = {
          state: {
            details:result.data,

          }
        };
       this.navCtrl.navigateForward(['/tabs/my-expenses/cross-currency-by-card'], navigationExtras);

      } else if(result.data.type == 'atm_cross_currency' ) {
        let navigationExtras: NavigationExtras = {
          state: {
            details:result.data,

          }
        };
       this.navCtrl.navigateForward(['/tabs/my-expenses/atm-withdrawal-cross-currency'], navigationExtras);

      } else if(result.data.type == 'atm_same_currency') {
        let navigationExtras: NavigationExtras = {
          state: {
            details:result.data,

          }
        };
       this.navCtrl.navigateForward(['/tabs/my-expenses/atm-withdrawalsame-currency'], navigationExtras);

      } else {
        let navigationExtras: NavigationExtras = {
          state: {
            details:result.data,

          }
        };
       this.navCtrl.navigateForward(['/tabs/my-expenses/record-transaction'], navigationExtras);

      }

    })
    }


 async deleteTRansactionHistory(details:any) {
    
    const alert = await this.alertController.create({
        cssClass: '',
        header: 'Delete Transaction!',
        message: 'Are you sure, you want to delete this transaction!!!',
        mode: 'ios',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            id: 'cancel-button',

            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Yes',
            id: 'confirm-button',
            handler: () => {
              console.log('Confirm Okay');


              //this.globalService.presentLoading();
              this.apiServices.deleteTransactionHistory(details.id[0]).subscribe(async (result:any) =>{
                //this.globalService.dismissLoading();

                if(result.message == 'Success'){


                  this.apiServices.getAllTransctionHistoryByTime().subscribe(async (result:any) => {

                    let navigationExtras: NavigationExtras = {
                      state: {
                        details:27
                      }
                    };
                    
                    this.router.navigate(['/tabs/my-expenses'], navigationExtras);   

         
                  });
                 // return this.router.navigate(['/tabs/my-expenses']);
                }
              })
            }
          }
        ]
      });

      await alert.present();

    }

    getTransactions(){


      this.apiServices.getAllTransctionHistoryByTime().subscribe((result:any) => {

        Object.entries(result.data).forEach(
          ([key, value]) => {
            this.transctionHistory.push({transKey:key,transValue:value})

        });
        localStorage.setItem("selectedTrasactionIds", JSON.stringify(this.transctionHistory));

      });
    }


}
function details(details: any, any: any) {
  throw new Error('Function not implemented.');
}

