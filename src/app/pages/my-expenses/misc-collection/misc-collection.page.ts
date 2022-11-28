import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-misc-collection',
  templateUrl: './misc-collection.page.html',
  styleUrls: ['./misc-collection.page.scss'],
})
export class MiscCollectionPage implements OnInit {
  paidAmt:any="";
  selectedDate:string="";
  description:string="";
  recivedAmt:string="";
  recivedCurrencySelected:string="";
  imageDisplay: string="";
  imgPath: string="";
  expenseData:any;
  showCashCurrency:any=[];
  currencyFromDropdown:string="";
  autoCalculateVlaue:any;
  showrecivedCashCurrency:any=[];
  getEditValue:any;
  todayDateTime:any;
  isModal: boolean;
  debit_image: any;

  constructor(private globalService:GlobalService,private location: Location,
    private actRoute: ActivatedRoute,private alertController: AlertController,
    private router: Router,private datePipe: DatePipe,
              private apiServices: ApiService) {
    this.expenseData = JSON.parse(localStorage.getItem("expensesData"));
    var currency_code = JSON.parse(localStorage.getItem('currency_code'))
    for (const [key] of Object.entries(currency_code)) {
     this.showrecivedCashCurrency.push(key);
    }


    if(localStorage.getItem('edit_clicked') == 'yes') {
      this.actRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.getEditValue  = this.router.getCurrentNavigation().extras.state.details;

         this.paidAmt =  this.getEditValue.credit;
         this.currencyFromDropdown =  this.getEditValue.creditCurrency;
         this.recivedAmt = this.getEditValue.debit;
         this.recivedCurrencySelected =  this.getEditValue.debitCurrency
         this.selectedDate = this.getEditValue.date;
         this.description = this.getEditValue.description;
        }
        console.log("getEditValue 111:::::", this.getEditValue);
      });
    }

    let dateVar = new Date();
    this.todayDateTime = this.datePipe.transform(dateVar,'YYYY-MM-dd')

  }

  ngOnInit() {
    if(this.expenseData){
      this.expenseData.forEach(element => {
        if(element.balance_cash > 0){
          this.showCashCurrency.push(element.currency_name);


        }
      });
    }

   // this.currencyFromDropdown =  this.showCashCurrency[0];


  }



  back() {
    localStorage.removeItem('edit_clicked')
    return this.router.navigate(['/tabs/my-expenses']);
  }

  selectCurrencyDropdown (name: any): void {
    this.currencyFromDropdown = name.split(': ')[1];;
   }
   selectRecivedCurrencyDropdown (name: any): void {
    this.recivedCurrencySelected = name.split(': ')[1];;
   }
  removeImage(){
    this.debit_image = "";
  }
   async autoCalculateCurrency() {
    this.globalService.presentLoading();
    if(this.recivedCurrencySelected == "") {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please select Recived currency from dropdown',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/misc-collection']);

     }
    if(this.currencyFromDropdown == "") {
      this.currencyFromDropdown =  this.showCashCurrency[0]
    }
     var paidAmount = parseFloat(this.paidAmt);
     var recivedAmount = parseFloat(this.recivedAmt);
     let autoCalVal = recivedAmount / paidAmount
     this.autoCalculateVlaue = autoCalVal.toFixed(2);
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

   async addMiscCollectionExcahnge () {




    if (this.paidAmt < 0) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Negative Value Not Allowed',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/misc-collection']);
     }


    if(this.paidAmt == null) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please enter paid amount',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/misc-collection']);

    } else if(this.selectedDate == ""){

      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please Select Date',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/misc-collection']);
    }


    var Users:string = localStorage.getItem("user")
    if(this.currencyFromDropdown == ""){
      this.currencyFromDropdown =  this.showCashCurrency[0]
    }
    //this.globalService.presentLoading();
   let params:any = {}
    params.group_id = JSON.parse(Users).order_id;
    params.driver_id = localStorage.getItem("manager_id");
    params.transaction_amount = this.paidAmt;

    params.currency = this.currencyFromDropdown;
    params.date_of_transaction = this.selectedDate;
    params.transaction_from = 'Cash';
    params.driver_name = localStorage.getItem("manager_name");
    if(localStorage.getItem('edit_clicked') == 'yes'){
      params.token = this.getEditValue.token;
      params.mode = "edit";

      } else {
        params.token = "";
        params.mode = "create";
      }

    params.transaction_type = "misc_collection";
    params.description = this.description;
    params.exchange_amount_receive = this.recivedAmt;
    params.exchange_currency = this.recivedCurrencySelected;
    params.image = this.imgPath;
    params.image_type = true;

    this.apiServices.postCurrencyExchange(params).subscribe(async (result:any) =>{
      //this.globalService.dismissLoading();
      if(result.status == "false"){

        const alert = await this.alertController.create({
          cssClass: '',
          message: result.message,
          mode: 'ios',
          buttons: ['OK']

        });

        await alert.present();
        localStorage.removeItem('edit_clicked');
        return;
      }
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

       }
    })
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
