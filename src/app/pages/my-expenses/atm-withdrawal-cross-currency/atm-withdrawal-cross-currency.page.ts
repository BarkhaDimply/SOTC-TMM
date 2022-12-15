import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ActivatedRoute,  Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-atm-withdrawal-cross-currency',
  templateUrl: './atm-withdrawal-cross-currency.page.html',
  styleUrls: ['./atm-withdrawal-cross-currency.page.scss'],
})
export class AtmWithdrawalCrossCurrencyPage implements OnInit {
  showCardCurrency: any = [];
  showCashCurrency: any = [];
  selectedCashCurrency: string = "";
  selectedCardCurrency: string = "";
  amtPaidCrossCurrency: any = "";
  amtRecivedCrossCurrency: any = "";
  selectedDateCrossCurrency: string = ""
  descriptionCrossCurrency: string = "";
  expenseData: any;
  imageDisplay: string = "";
  imgPath: string = "";
  showrecivedCashCurrency: any = [];
  getEditValue:any;
  todayDateTime:any;
  autoCalculateVlaue: string;
  paidCurrency: string = "";
  isModal: boolean;
  isTrue= true ;
  row: any;
  recivedCurrency:string="";
  debit_image: any;
  debit_image_new: any;
  image_type: boolean;


  constructor(private apiServices: ApiService,private alertController: AlertController,private location: Location,
    private actRoute: ActivatedRoute,
    private router: Router,private datePipe: DatePipe,
    private globalService: GlobalService) {
    this.expenseData = JSON.parse(localStorage.getItem("expensesData"));
    var currency_code = JSON.parse(localStorage.getItem('currency_code'))
    for (const [key] of Object.entries(currency_code)) {
      this.showrecivedCashCurrency.push(key);
    }

    if (localStorage.getItem('edit_clicked') == 'yes') {
      this.actRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.getEditValue = this.router.getCurrentNavigation().extras.state.details;
          this.amtPaidCrossCurrency = this.getEditValue.debit;
        //  this.selectedCardCurrency = this.getEditValue.creditCurrency;
          this.selectedDateCrossCurrency = this.getEditValue.date;
          this.amtRecivedCrossCurrency =  this.getEditValue.credit;
        //  this.selectedCashCurrency = this.getEditValue.debitCurrency;
          this.row = this.getEditValue.row;
          this.paidCurrency =  this.getEditValue.debitCurrency;
          this.recivedCurrency =  this.getEditValue.creditCurrency;
          this.debit_image = this.getEditValue.debit_image;
          this.descriptionCrossCurrency = this.getEditValue.description;
        }

        console.log("aaaaaa11", this.getEditValue);
      });
    }


    let dateVar = new Date();
    this.todayDateTime = this.datePipe.transform(dateVar,'YYYY-MM-dd')


  }

  ngOnInit() {

    if (this.expenseData) {
      this.expenseData.forEach(element => {  console.log("aaaaaaaaa:::",element);
        if(element.balance_card > 0){
          this.showCashCurrency.push(element.currency_name);
        }
      });
    }


console.log("aaaaaa",this.showCashCurrency);




    // if (this.expenseData) {
    //   this.expenseData.forEach(element => {
    //     if (element.balance_card > 0) {
    //       this.showCardCurrency.push(element.currency_name);
    //     }

    //     if (element.balance_cash > 0) {
    //       this.showCashCurrency.push(element.currency_name);
    //     }
    //   });
    // }

    // this.paidCurrency = this.showCashCurrency[0]
    // console.log("qqqqqqqqqq",this.showCashCurrency);

  }

  removeImage(){
    this.debit_image = "";
  }
  getPaidCurrency(name: any): void {
    //this.paidCurrency = name.split(': ')[1];

    this.paidCurrency = name;

  }
  getRecivedCurrency(name: any): void {
    this.recivedCurrency = name.split(': ')[1];
  }





  onCardCurrencyChange(name: any): void {
   // this.selectedCardCurrency = name.split(': ')[1];;
    this.selectedCardCurrency = name;
  }

  onCashCurrencyChange(name: any): void {
    this.selectedCashCurrency = name.split(': ')[1];;
  }

  async openGallery() {

    this.globalService.takePhoto().then(result => {
      if (result.imageUrl) {
      this.imageDisplay = result.imageUrl;
      this.imgPath = result.imageUrl;
      }
    });


    // const image = await Camera.getPhoto({
    //   quality: 90,
    //   allowEditing: false,
    //   resultType: CameraResultType.DataUrl,
    //   source: CameraSource.Photos, 
    //   saveToGallery: true,
    // });

    // if (image) {
    //   this.imageDisplay =image.dataUrl;
    //   this.imgPath = image.dataUrl;

    // }


  }

  async submitCrossCurrencyData() {
   // this.globalService.presentLoading();
    this.isTrue=false;


    if(this.recivedCurrency == "") {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please select Received currency from dropdown',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/atm-withdrawal-cross-currency']);
    }


   if (this.amtPaidCrossCurrency < 0) {
     this.isTrue=false;
    const alert = await this.alertController.create({
      cssClass: '',
      message: 'Negative Value Not Allowed',
      mode: 'ios',
      buttons: ['OK']
    });

    await alert.present();
     return this.router.navigate(['/tabs/my-expenses/atm-withdrawal-cross-currency']);
   } else if (this.amtRecivedCrossCurrency < 0) {
     this.isTrue=false;
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Negative Value Not Allowed',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
     return this.router.navigate(['/tabs/my-expenses/atm-withdrawal-cross-currency']);

    } else if (this.amtPaidCrossCurrency == null || this.amtPaidCrossCurrency == "") {
     this.isTrue=false;
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please enter amount paid',
        mode: 'ios',
        buttons: ['OK']
      });


      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/atm-withdrawal-cross-currency']);

    } else if (this.amtRecivedCrossCurrency == null || this.amtRecivedCrossCurrency == "") {
     this.isTrue=false;
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please enter received amount',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
     return this.router.navigate(['/tabs/my-expenses/atm-withdrawal-cross-currency']);
    }else if (this.selectedDateCrossCurrency == "") {
     this.isTrue=false;

      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please Select Date',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
     return this.router.navigate(['/tabs/my-expenses/atm-withdrawal-cross-currency']);
    }

    // if(this.amtRecivedCrossCurrency == "") {
    //   this.isTrue=false;
    //   const alert = await this.alertController.create({
    //     cssClass: '',
    //     message: 'Please select Received currency from dropdown',
    //     mode: 'ios',
    //     buttons: ['OK']

    //   });

    //   await alert.present();
    //   return this.router.navigate(['/tabs/my-expenses/atm-withdrawal-cross-currency']);
    //  }
    //  if (this.selectedCashCurrency == "") {
    //    this.isTrue=false;

    //   const alert = await this.alertController.create({
    //     cssClass: '',
    //     message: 'Please select currency from dropdown',
    //     mode: 'ios',
    //     buttons: ['OK']

    //   });

    //   await alert.present();
    //    return this.router.navigate(['/tabs/my-expenses/atm-withdrawal-cross-currency']);
    // }

    var Users: string = localStorage.getItem("user")
    // if (this.selectedCardCurrency == "") {
    //   this.selectedCardCurrency = this.showCardCurrency[0];
    // }


    if (typeof this.paidCurrency == 'undefined'){
      this.paidCurrency =  this.showCashCurrency[0]

    }else if(this.paidCurrency == ''){
      this.paidCurrency =  this.showCashCurrency[0]
    }

    if(this.recivedCurrency == this.paidCurrency) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please Choose different Currency',
        mode: 'ios',
        buttons: ['OK']
      });
      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/atm-withdrawal-cross-currency']);
    }

    // if(this.selectedCashCurrency == this.selectedCardCurrency) {
    //   this.isTrue=false;
    //   const alert = await this.alertController.create({
    //     cssClass: '',
    //     message: 'Please Choose different Currency',
    //     mode: 'ios',
    //     buttons: ['OK']

    //   });

    //   await alert.present();
    //   return this.router.navigate(['/tabs/my-expenses/atm-withdrawal-cross-currency']);

    // }



    var paidAmount = parseFloat(this.amtPaidCrossCurrency);
    var recivedAmount = parseFloat(this.amtRecivedCrossCurrency);
    let autoCalVal = recivedAmount / paidAmount
    this.autoCalculateVlaue = autoCalVal.toFixed(4);


    //this.globalService.presentLoading();
    let params: any = {}
    params.group_id = JSON.parse(Users).order_id;
    params.driver_id = localStorage.getItem("manager_id");
    params.transaction_amount = this.amtPaidCrossCurrency;
   // params.currency = this.selectedCardCurrency;

    params.currency = this.paidCurrency;
    params.date_of_transaction = this.selectedDateCrossCurrency;
    params.transaction_from = 'Card';

    params.driver_name = localStorage.getItem("manager_name");
    // if(localStorage.getItem('edit_clicked') == 'yes'){
    //   params.token = this.getEditValue.token;
    //   params.mode = "edit";
    //   params.image  = this.imgPath;
    //   params.image_type = false;
    // //  params.image  = this.getEditValue.debit_image;
    
    //   } else {
    //     params.token = "";
    //     params.mode = "create";
    //   params.image = this.imgPath;
    //   params.image_type = true;
    //   }


    if (localStorage.getItem('edit_clicked') == 'yes') {

      if(this.debit_image != ''){
        this.debit_image_new = this.getEditValue.debit_image;
        this.image_type = false;
      }else{
        this.debit_image_new = this.imgPath;
        this.image_type = true;
      }

      params.token = this.getEditValue.token;
      params.mode = "edit";
      params.image = this.debit_image_new  
      params.image_type = this.image_type;
    } else {
      params.token = "";
      params.mode = "create";
      params.image = this.imgPath;
      params.image_type = true;
    }




      params.transaction_type = "atm_cross_currency";
    params.description = this.descriptionCrossCurrency;
    params.exchange_amount_receive = this.amtRecivedCrossCurrency;
   // params.exchange_currency = this.selectedCashCurrency;


    params.exchange_currency = this.recivedCurrency;

    if (this.imgPath != '') {
      params.image_type = true;
    } else {
      params.image_type = '';
    }

    params.roe = 1+this.paidCurrency+' = '+this.autoCalculateVlaue+this.recivedCurrency;



    this.apiServices.postCurrencyExchange(params).subscribe(async (result: any) => {
     // this.globalService.dismissLoading();

     console.log("aaaaaa",result.status);

      if (result.message == "success") {

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

      if(result.status == "false"){
        //localStorage.removeItem('edit_clicked'); //no need- edit transaction issue change create mode
        const alert = await this.alertController.create({
          cssClass: '',
          message: result.message,
          mode: 'ios',
          buttons: ['OK']

        });

        await alert.present();
        return false;
       // return this.router.navigate(['/tabs/my-expenses']);
      }
    });

  }
  cardCurrency(arg0: string, cardCurrency: any) {
    throw new Error('Method not implemented.');
  }

  back() {
    localStorage.removeItem('edit_clicked')
    return this.router.navigate(['/tabs/my-expenses']);
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


  async autoCalculateCurrency() {
    if(this.amtRecivedCrossCurrency == "" || this.amtRecivedCrossCurrency == null){
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please fill amount received',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return;
     }
     if(this.amtPaidCrossCurrency == "" || this.amtPaidCrossCurrency == null){
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please Fill amount paid',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return;

     }
     if(this.recivedCurrency == ""){
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please select Received currency from dropdown',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return;
     }

     if(this.recivedCurrency == this.paidCurrency) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please choose different currency',
        mode: 'ios',
        buttons: ['OK']
      });
      await alert.present();
      return false;
    }

     var paidAmount = parseFloat(this.amtPaidCrossCurrency);
     var recivedAmount = parseFloat(this.amtRecivedCrossCurrency);
     let autoCalVal = recivedAmount / paidAmount
     this.autoCalculateVlaue = autoCalVal.toFixed(4);
   }

}
