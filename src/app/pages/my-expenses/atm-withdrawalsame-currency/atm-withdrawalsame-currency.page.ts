import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { DatePipe, Location } from '@angular/common';
@Component({
  selector: 'app-atm-withdrawalsame-currency',
  templateUrl: './atm-withdrawalsame-currency.page.html',
  styleUrls: ['./atm-withdrawalsame-currency.page.scss'],
})
export class AtmWithdrawalsameCurrencyPage implements OnInit {
  amtWithdraw:any="";
  expenseData:any;
  showCashCurrency:any=[];
  cashRecived:any="";
  atmWithdrawFee:any="";
  withdrawDate:string="";
  withdrawDescription:string="";
  imageDisplay: string="";
  imgPath: string="";
  currencyFromDropdown1:string="";
  getEditValue:any;
  todayDateTime:any;
  autoCalculateVlaue: string;
  isModal: boolean;
  debit_image: any;


  constructor(private apiServices:ApiService,private location: Location,
    private actRoute: ActivatedRoute,
    private router: Router,private alertController: AlertController,private datePipe: DatePipe,
              private globalService: GlobalService) {

    this.expenseData = JSON.parse(localStorage.getItem("expensesData"));
    if(localStorage.getItem('edit_clicked') == 'yes') {
      this.actRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.getEditValue  = this.router.getCurrentNavigation().extras.state.details;
          this.amtWithdraw =  this.getEditValue.credit;
         this.currencyFromDropdown1 =  this.getEditValue.creditCurrency;
         this.cashRecived = this.getEditValue.debit;
         this.currencyFromDropdown1 =  this.getEditValue.debitCurrency;
         this.withdrawDate = this.getEditValue.date;
         this.atmWithdrawFee = this.getEditValue.fees;
         this.debit_image = this.getEditValue.debit_image;
         this.withdrawDescription= this.getEditValue.description;

        }
        console.log("getEditValue:::::", this.getEditValue);
      });
    }


    let dateVar = new Date();
    this.todayDateTime = this.datePipe.transform(dateVar,'YYYY-MM-dd')


   }

  ngOnInit() {

    if(this.expenseData){
      this.expenseData.forEach(element => {
        if(element.balance_card > 0){
          this.showCashCurrency.push(element.currency_name);
        }
      });
    }



  }



  back() {
    localStorage.removeItem('edit_clicked')
    return this.router.navigate(['/tabs/my-expenses']);
  }

  async  openGallery(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos, // Camera, Photos or Prompt!
      saveToGallery: true,
     // width: 200,
     // height: 200,
  });

  if (image) {
    this.imageDisplay =image.dataUrl;
    this.imgPath = image.dataUrl;

  }
   }

   async atmWithdrawSameCurrency(){

    if (this.atmWithdrawFee < 0) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Negative Value Not Allowed',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/atm-withdrawalsame-currency']);
     } if(this.cashRecived < 0){
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Negative Value Not Allowed',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return false;
     } if(this.amtWithdraw < 0){
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Negative Value Not Allowed',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
       return this.router.navigate(['/tabs/my-expenses/atm-withdrawalsame-currency']);
     }

   if(this.amtWithdraw === 0 ){
       const alert = await this.alertController.create({
         cssClass: '',
         message: 'Please enter valid amount',
         mode: 'ios',
         buttons: ['OK']

       });

       await alert.present();
     return this.router.navigate(['/tabs/my-expenses/atm-withdrawalsame-currency']);

     }
   if(this.amtWithdraw == null || this.amtWithdraw == ''){
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please enter Withdrawal amount',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
     return this.router.navigate(['/tabs/my-expenses/atm-withdrawalsame-currency']);

    }




     if(this.atmWithdrawFee == '' || this.atmWithdrawFee == null){
      this.atmWithdrawFee = 0;
    }

    if(this.cashRecived == null || this.cashRecived == ''){

      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please enter cash received amount',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/atm-withdrawalsame-currency']);
    }

     if(this.withdrawDate == ""){

      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please Select Date',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/atm-withdrawalsame-currency']);
    }
    var Users:string = localStorage.getItem("user");

     if (typeof this.currencyFromDropdown1 == 'undefined' || this.currencyFromDropdown1 == '') {
       this.currencyFromDropdown1 = this.showCashCurrency[0];

     }
    //this.globalService.presentLoading();
    let params:any = {}
    params.group_id = JSON.parse(Users).order_id;
    params.driver_id = localStorage.getItem("manager_id");
    params.transaction_amount = this.amtWithdraw;
    params.currency = this.currencyFromDropdown1;
    params.date_of_transaction = this.withdrawDate;
    params.transaction_from = 'Card';
    params.driver_name = localStorage.getItem("manager_name");
    if(localStorage.getItem('edit_clicked') == 'yes'){
      params.token = this.getEditValue.token;
      params.mode = "edit";
      params.image  = this.getEditValue.debit_image;
      params.image_type = false;
      } else {
        params.token = "";
        params.mode = "create";
      params.image = this.imgPath;
      params.image_type = true;
      }

    params.transaction_type = "atm_same_currency";
    params.description = this.withdrawDescription;
    params.exchange_amount_receive = this.cashRecived;
    params.exchange_currency = this.currencyFromDropdown1;
    //params.image = this.imgPath;
   // params.image_type = true;
    params.atm_withdrawl_fees = this.atmWithdrawFee;


    console.log("aaaaaaaaa:::",params);

    this.apiServices.postCurrencyExchange(params).subscribe(async (result:any) =>{
    //  this.globalService.dismissLoading()
       console.log("bbbbbbbb:::",result);

      if(result.message == "success") {
        const alert = await this.alertController.create({
          cssClass: '',
          message: 'Transaction Successful',
          mode: 'ios',
          buttons: ['OK']

        });

        await alert.present();
        localStorage.removeItem('edit_clicked');

        return this.router.navigate(['/tabs/my-expenses']);


     }else{
      localStorage.removeItem('edit_clicked');
      const alert = await this.alertController.create({
        cssClass: '',
        message: result.message,
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return;
     }
   })
   }
  removeImage(){
    this.debit_image = "";
  }
   selectCurrencyDropdown (name: any): void {
   // this.currencyFromDropdown1 = name.split(': ')[1];
    this.currencyFromDropdown1 = name;
   }



   keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

}
