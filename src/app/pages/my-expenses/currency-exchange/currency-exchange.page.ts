import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { GlobalService } from 'src/app/services/global/global.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { DatePipe, Location } from '@angular/common';
import { AlertPromise } from 'selenium-webdriver';

@Component({
  selector: 'app-currency-exchange',
  templateUrl: './currency-exchange.page.html',
  styleUrls: ['./currency-exchange.page.scss'],
})
export class CurrencyExchangePage implements OnInit {
  expenseData: any;
  showCashCurrency: any = [];
  paidAmount: any = "";
  receivedAmount: any = ""
  selectedDate: string = "";
  description: string = "";
  paidCurrency: string = "";
  recivedCurrency: string = "";
  imageDisplay: string = "";
  imgPath: string = "";
  autoCalculateVlaue: any;
  showrecivedCashCurrency: any = [];
  getEditValue: any;
  todayDateTime: any;
  isModal: boolean;
  debit_image: any;
  row: any;
  activeSegment: string;
  debit_image_new: any;
  image_type: boolean;

  constructor(private apiServices: ApiService, private navCtrl: NavController,
    private actRoute: ActivatedRoute, private location: Location,
    private router: Router,
    private globalService: GlobalService,
    private alertController: AlertController,
    private datePipe: DatePipe) {
    this.expenseData = JSON.parse(localStorage.getItem("expensesData"));
    var currency_code = JSON.parse(localStorage.getItem('currency_code'))
    for (const [key] of Object.entries(currency_code)) {
      this.showrecivedCashCurrency.push(key);
    }

    let dateVar = new Date();

    this.todayDateTime = this.datePipe.transform(dateVar, 'YYYY-MM-dd')


    if (localStorage.getItem('edit_clicked') == 'yes') {
      this.actRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {

          this.getEditValue = this.router.getCurrentNavigation().extras.state.details;

          console.log("ddddddddd:::::", this.getEditValue);

          this.paidAmount = this.getEditValue.debit;
          this.paidCurrency = this.getEditValue.debitCurrency;
          this.receivedAmount = this.getEditValue.credit;
          this.recivedCurrency = this.getEditValue.creditCurrency;
          this.selectedDate = this.getEditValue.date;
          this.description = this.getEditValue.description;
          this.debit_image = this.getEditValue.debit_image;
          this.row = this.getEditValue.row;

          console.log("aaa",this.getEditValue);

        }

      });
    }

  }

  ngOnInit() {

    if (this.expenseData) {
      this.expenseData.forEach(element => {
         if(element.balance_cash > 0){
        this.showCashCurrency.push(element.currency_name);


           console.log("curr333",this.showCashCurrency);
         }
      });
    }




  }

  removeImage(){
    this.debit_image = "";
  }

  back() {
    localStorage.removeItem('edit_clicked')
    return this.router.navigateByUrl('/', {skipLocationChange: true})
    .then(() => this.router.navigate(['/tabs/my-expenses']))
  }


  async addCurrencyExcahnge() {


    // this.globalService.presentLoading();

    if (this.paidAmount < 0) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Negative Value Not Allowed',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/currency-exchange']);
    } else if (this.receivedAmount < 0) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Negative Value Not Allowed',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/currency-exchange']);
    } else if (this.paidAmount == "" || this.paidAmount == null) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please enter Paid Amount',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/currency-exchange']);

    } else if (this.receivedAmount == null || this.receivedAmount == "") {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please enter received Amount',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/currency-exchange']);

    } else if (this.selectedDate == "") {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please Select Date',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/currency-exchange']);

    }
    if (this.recivedCurrency == null || this.recivedCurrency == "") {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please select Received currency from dropdown',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/currency-exchange']);

    }


    var Users: string = localStorage.getItem("user")


    if (typeof this.paidCurrency == 'undefined' || this.paidCurrency == '') {
      this.paidCurrency = this.showCashCurrency[0]

    }

    if (this.recivedCurrency == this.paidCurrency) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please Choose different Currency',
        mode: 'ios',
        buttons: ['OK']
      });
      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/currency-exchange']);
    }
    var paidAmount = parseFloat(this.paidAmount);
    var recivedAmount = parseFloat(this.receivedAmount);
    let autoCalVal = recivedAmount / paidAmount
    this.autoCalculateVlaue = autoCalVal.toFixed(4);

    //this.globalService.presentLoading();



    console.log("ddddddddddd111",this.paidCurrency);


    let params: any = {}
    params.group_id = JSON.parse(Users).order_id;
    params.driver_id = localStorage.getItem("manager_id");
    params.transaction_amount = this.paidAmount;

    params.currency = this.paidCurrency;
    params.date_of_transaction = this.selectedDate;
    params.transaction_from = 'Cash';
    params.driver_name = localStorage.getItem("manager_name");


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


    // if (localStorage.getItem('edit_clicked') == 'yes') {
    //   params.token = this.getEditValue.token;
    //   params.mode = "edit";
    //   params.image  = this.getEditValue.debit_image;
    //   params.image_type = false;
    // } else {
    //   params.token = "";
    //   params.mode = "create";
    //   params.image = this.imgPath;
    //   params.image_type = true;
    // }
    params.transaction_type = "Exchange";
    params.description = this.description;
    params.exchange_amount_receive = this.receivedAmount;
    params.exchange_currency = this.recivedCurrency;
    params.roe = 1 + this.paidCurrency + ' = ' + this.autoCalculateVlaue + this.recivedCurrency;

    console.log("params curr:::",params);

    this.apiServices.postCurrencyExchange(params).subscribe(async (result: any) => {
      // this.globalService.dismissLoading();

      if (result.message == "success") {

       this.getAllTransctionHistoryByTime();
        const alert = await this.alertController.create({
          cssClass: '',
          message: 'Transaction successful',
          mode: 'ios',
          buttons: ['OK']

        });

        await alert.present();


        return this.router.navigate(['/tabs/my-expenses']);

        //  console.log(localStorage.getItem('edit_clicked'));
        //  console.log(localStorage.getItem('activeKeyTrans'));
        //  if(localStorage.getItem('edit_clicked') == 'yes' && localStorage.getItem('activeKeyTrans') == 'rejected_trans'){
        //   this.activeSegment = 'rejected_trans';
        //  }

       // this.navCtrl.navigateBack(['/tabs/my-expenses',navigationExtras]);
        //  this.router.navigateByUrl('/', {skipLocationChange: false})
        // .then(() => this.router.navigate(['/tabs/my-expenses']))


      } else {
        const alert = await this.alertController.create({
          cssClass: '',
          message: result.message,
          mode: 'ios',
          buttons: ['OK']

        });
        await alert.present();
        // localStorage.removeItem('edit_clicked');
        return;
      }
    })

  }
//   reloadComponent() {
//
//     this.router.navigate(['/tabs/my-expenses'] ,{
//       queryParams: { filter: 'new' },
//       queryParamsHandling: 'merge' }
//     )
//
// }
  getAllTransctionHistoryByTime() {
    this.apiServices.getAllTransctionHistoryByTime().subscribe((result: any) => {
      console.log("aaaaaaa", result);
    });
  }

  getPaidCurrency(name: any): void {  console.log("paid curr:::",name);
   // this.paidCurrency = name.split(': ')[1];
     this.paidCurrency = name;



  }
  getRecivedCurrency(name: any): void {
    this.recivedCurrency = name.split(': ')[1];
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
    //   source: CameraSource.Photos, // Camera, Photos or Prompt!
    //   saveToGallery: true,
    // });

    // if (image) {
    //   this.imageDisplay = image.dataUrl;
    //   this.imgPath = image.dataUrl;
    // }
  }

  async autoCalculateCurrency() {
    if (this.recivedCurrency == "") {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please select Received currency from dropdown',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return;
    }
    if (this.paidAmount == "" || this.paidAmount == null) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please Fill amount paid',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return;

    }
    if (this.paidCurrency == "") {
      this.paidCurrency = this.showCashCurrency[0];
    }

    var paidAmount = parseFloat(this.paidAmount);
    var recivedAmount = parseFloat(this.receivedAmount);
    let autoCalVal = recivedAmount / paidAmount
    this.autoCalculateVlaue = autoCalVal.toFixed(4);
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
