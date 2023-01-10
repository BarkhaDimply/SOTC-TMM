import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-add-own-money',
  templateUrl: './add-own-money.page.html',
  styleUrls: ['./add-own-money.page.scss'],
})
export class AddOwnMoneyPage implements OnInit {

  currencyFromDropdown:string="";
  showrecivedCashCurrency:any=[];
  expenseData:any;
  paidAmt:any="";
  selectedDate:string="";
  description:string="";
  recivedAmt:string="";
  showCashCurrency:any=[];
  debit_image: any;
  debit_image_new: any;
  imgPath: string="";
  image_type: boolean;
  token: any;
  getEditValue:any;
  recivedCurrencySelected:string="";
  typeDisplayFromDropdown:string="";
  typeDisplay:string="";
  typeSelected:any=[];
  todayDateTime:any;

    constructor(private globalService:GlobalService,
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
         this.token =  this.getEditValue.token;
         this.typeDisplayFromDropdown =  this.getEditValue.sub_category;
        }

        console.log("getEditValue 111:::::", this.getEditValue);
      });
    }

    let dateVar = new Date();
    this.todayDateTime = this.datePipe.transform(dateVar,'YYYY-MM-dd')

    console.log("date::::",this.todayDateTime);

  }
  
  ngOnInit() {

    if(this.expenseData){
      this.expenseData.forEach(element => {
        if(element.balance_cash > 0){
          this.showCashCurrency.push(element.currency_name);
        }
      });
    }

    this.typeForSelection();

    
  }

  back() {
    localStorage.removeItem('edit_clicked')
    return this.router.navigateByUrl('/', {skipLocationChange: true})
    .then(() => this.router.navigate(['/tabs/my-expenses']))
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

  selectCurrencyDropdown (name: any): void {
    this.currencyFromDropdown = name.split(': ')[1];;
  }

  typeForSelection(){
    this.typeSelected = [ "self", "collection" ];

  }

  async addMiscCollectionExcahnge () {

    if(this.paidAmt == ""){
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please enter Amount Received',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/add-own-money']);
    }

    if (this.paidAmt < 0) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Negative Value Not Allowed',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/add-own-money']);
     }


    if(this.paidAmt == null) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please enter amount Received',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/add-own-money']);

    } 


    var Users:string = localStorage.getItem("user")
    if(this.currencyFromDropdown == ""){
      this.currencyFromDropdown =  this.showCashCurrency[0]
    }

    let params:any = {}
    params.group_id = JSON.parse(Users).order_id;
    params.driver_id = localStorage.getItem("manager_id");
    params.transaction_amount = this.paidAmt;

    params.currency = this.currencyFromDropdown;
    params.date_of_transaction = this.todayDateTime;
    params.transaction_from = 'Cash';
    params.driver_name = localStorage.getItem("manager_name");

    if (localStorage.getItem('edit_clicked') == 'yes') {

      params.token = this.getEditValue.token;
      params.mode = "edit";
    } else {
      params.token = "";
      params.mode = "create";
    }

    params.image = "";
    params.image_type = "";
    params.transaction_type = "own_money";
    params.description = this.description;
    params.exchange_amount_receive = this.recivedAmt;
    params.exchange_currency = this.recivedCurrencySelected;
    params.image = this.imgPath;
    params.sub_category = "self";


    console.log("params add::::",params);

  

    this.apiServices.postCurrencyExchange(params).subscribe(async (result:any) =>{

      console.log("result::::",result);
 
      if(result.status == "false"){

        const alert = await this.alertController.create({
          cssClass: '',
          message: result.message,
          mode: 'ios',
          buttons: ['OK']

        });

        await alert.present();
        return;
      }
       if(result.message == "success") {

        const alert = await this.alertController.create({
          cssClass: '',
          message: this.currencyFromDropdown + ' ' +this.paidAmt + ' ' +" has been added to your wallet balance. You may go ahead and complete your transaction",
          mode: 'ios',
          buttons: ['OK']

        });

        await alert.present();
        localStorage.removeItem('edit_clicked');

         return this.router.navigate(['/tabs/my-expenses']);

       }
    })
   }

}
