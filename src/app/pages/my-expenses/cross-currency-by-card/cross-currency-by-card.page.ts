import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { DatePipe, Location } from '@angular/common';
@Component({
  selector: 'app-cross-currency-by-card',
  templateUrl: './cross-currency-by-card.page.html',
  styleUrls: ['./cross-currency-by-card.page.scss'],
})
export class CrossCurrencyByCardPage implements OnInit {
  expenseData:any;
  outgoingAmt:any="";
  outgoing_selected_currency:string="";
  amtRecived_vendor:any="";
  amtRecived_selected_currency:string="";
  selectedDate:string="";
  imageDisplay: string="";
  imgPath: string="";
  showCardCurrency:any = [];
  description:string="";
  showrecivedCashCurrency:any=[];
  getEditValue:any;
  todayDateTime:any;
  autoCalculateVlaue: string;
  selected_category_id:any="";
  sub_category_id: any;
  subCategoryId: any;
  getAllCatergories:any;
  selected_subcategory_id: any;
  category_id: any;
  editMode: boolean;
  isModal: boolean;
  category:any;
  row: any;
  debit_image: any;
  subCategory:any;

  hideSubCat = true;

  constructor(private globalService:GlobalService,private location: Location,
    private actRoute: ActivatedRoute,private alertController: AlertController,
    private router: Router,private datePipe: DatePipe,
    private apiServices: ApiService) {
    this.expenseData = JSON.parse(localStorage.getItem("expensesData"));
    var currency_code = JSON.parse(localStorage.getItem('currency_code'));
    for (const [key] of Object.entries(currency_code)) {
     this.showrecivedCashCurrency.push(key);
    }

    if(localStorage.getItem('edit_clicked') == 'yes') {
      this.actRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.getEditValue  = this.router.getCurrentNavigation().extras.state.details;
          this.outgoingAmt =  this.getEditValue.debit; //credit
         this.outgoing_selected_currency =  this.getEditValue.debitCurrency;
      //   this.amtRecived_vendor = this.getEditValue.debit;
         this.amtRecived_selected_currency =  ''
         this.selectedDate = this.getEditValue.date;
         this.row = this.getEditValue.row;
         this.debit_image = this.getEditValue.debit_image;
         this.description = this.getEditValue.description;
        }
         console.log("getEditValue11111:::::", this.getEditValue);

        this.apiServices.getCategoriesFromServer().subscribe((result:any) => {
          this.getAllCatergories = result.categories;

            this.getAllCatergories.forEach(element => {
              this.category_id = element.id;
              if(this.getEditValue.category == this.category_id){
                this.selected_category_id = element.category;

                element.sub_category.forEach(ele => {
                  if(this.getEditValue.sub_category == ele.id){
                    this.subCategory = ele.category;
                    this.subCategoryId = ele.id;
                  }

                });


                }
            });

        });

      });
    }

    let dateVar = new Date();
    this.todayDateTime = this.datePipe.transform(dateVar,'YYYY-MM-dd')

  }

  ngOnInit() {
    if(this.expenseData){
      this.expenseData.forEach(element => {
        if(element.balance_card > 0){
          this.showCardCurrency.push(element.currency_name);
        }
      });
    }



    this.apiServices.getCategoriesFromServer().subscribe((result:any) => {
      this.getAllCatergories = result.categories;
    });
    if(localStorage.getItem('edit_clicked') == 'yes') {
      this.editMode = true;
    }

  }


  getOutgoingCurrency(name:any):void {
    this.outgoing_selected_currency = name;
  }

  getRecivedCurrency(name:any):void {
    this.amtRecived_selected_currency = name.split(': ')[1];;
  }

  async  openGallery(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos, // Camera, Photos or Prompt!
      saveToGallery: true,
    //  width: 200,
    //  height: 200,
  });

  if (image) {
    this.imageDisplay =image.dataUrl;
    this.imgPath = image.dataUrl;
  }
   }

   async crossCurrencyByCard() {

     if(this.amtRecived_vendor == '' || this.amtRecived_vendor == null){

      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please enter amount paid',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }


    if(localStorage.getItem('edit_clicked') == 'yes') {
      if(this.selected_category_id){
        this.getAllCatergories.forEach(element => {
          if(this.selected_category_id == element.category){

            this.selected_category_id = element.id;
          }
        });

        this.selected_subcategory_id = this.subCategoryId;

      }
    }
     if (this.selected_category_id == ''){

       const alert = await this.alertController.create({
         cssClass: '',
         message: 'Please choose Category',
         mode: 'ios',
         buttons: ['OK']
       });

       await alert.present();
       return this.router.navigate(['/tabs/my-expenses/cross-currency-by-card']);
     }

    if (this.outgoingAmt < 0) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Negative Value Not Allowed',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/cross-currency-by-card']);
     } else if (this.amtRecived_vendor < 0) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Negative Value Not Allowed',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/cross-currency-by-card']);
     }

    if(this.outgoingAmt == null || this.outgoingAmt == '') {

      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please enter outgoing Amount',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/cross-currency-by-card']);
    // } else if(this.amtRecived_vendor == ""){

    //   const alert = await this.alertController.create({
    //     cssClass: '',
    //     message: 'Please enter received Amount',
    //     mode: 'ios',
    //     buttons: ['OK']
    //   });

    //   await alert.present();
    //   return this.router.navigate(['/tabs/my-expenses/cross-currency-by-card']);;
    // }
    }else if(this.selectedDate == ""){

      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please Select Date',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();return this.router.navigate(['/tabs/my-expenses/cross-currency-by-card']);;
    }
    if(this.amtRecived_selected_currency == "") {

      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please select paid currency from dropdown',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();return this.router.navigate(['/tabs/my-expenses/cross-currency-by-card']);;
     }

    //this.globalService.presentLoading();
    var Users:string = localStorage.getItem("user")
    if(this.outgoing_selected_currency == "" || this.outgoing_selected_currency == 'undefined' ){
      this.outgoing_selected_currency =  this.showCardCurrency[0];
    }

    if(this.outgoing_selected_currency == this.amtRecived_selected_currency){
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please choose Different Currency',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();return;
     }


    var paidAmount = parseFloat(this.outgoingAmt);
    var recivedAmount = parseFloat(this.amtRecived_vendor);
    let autoCalVal = recivedAmount / paidAmount;
    this.autoCalculateVlaue = autoCalVal.toFixed(4);

    let params:any = {}
    params.group_id = JSON.parse(Users).order_id;
    params.driver_id = localStorage.getItem("manager_id");
    params.transaction_amount = this.outgoingAmt;

    params.currency = this.outgoing_selected_currency;
    params.date_of_transaction = this.selectedDate;
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

    params.transaction_type = "cross_currency_by_card";
    params.description = this.description;
    params.exchange_amount_receive = this.amtRecived_vendor;
    params.exchange_currency = this.amtRecived_selected_currency;
    // params.image = this.imgPath;

    // params.image_type = true;
    params.category_id = this.selected_category_id;
    params.sub_category = this.selected_subcategory_id;
    params.roe = 1+this.outgoing_selected_currency+' = '+this.autoCalculateVlaue+this.amtRecived_selected_currency;


    //console.log("params::::",params);

    this.apiServices.postCurrencyExchange(params).subscribe(async (result:any) =>{
      //this.globalService.dismissLoading();

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
        //localStorage.removeItem('edit_clicked'); //no need- edit transaction issue change create mode
        const alert = await this.alertController.create({
          cssClass: '',
          message: result.message,
          mode: 'ios',
          buttons: ['OK']
        });

        await alert.present();
      }
    });
   }


   back() {
    localStorage.removeItem('edit_clicked');
    return this.router.navigate(['/tabs/my-expenses']);
  }

  async autoCalculateCurrency() {

    if(this.outgoingAmt == "" || this.outgoingAmt == null){

      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please input amount deducted',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }
    if(this.amtRecived_vendor == "" || this.amtRecived_vendor == null){

      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please input amount paid',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return;
    }

    if(this.amtRecived_selected_currency == ""){

      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please select Received currency from dropdown',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return;
     }
    if(this.outgoing_selected_currency == "") {
      this.outgoing_selected_currency =  this.showCardCurrency[0];
    }

     var paidAmount = parseFloat(this.outgoingAmt);
     var recivedAmount = parseFloat(this.amtRecived_vendor);
     let autoCalVal = recivedAmount / paidAmount;
     this.autoCalculateVlaue = autoCalVal.toFixed(4);
   }

   getSubcatgeory(ev:any):void{

    this.hideSubCat = false;

    console.log("EV::",ev);
    this.selected_category_id = parseInt(ev.target.value);



    //this.subCategory = "";
    this.getAllCatergories.forEach(element => {
      if(this.selected_category_id == element.id){
        if(element.sub_category.length > 0){
        this.subCategory = element.sub_category;

        console.log("subbbtop777",this.subCategory);

        }
      }
    });


    console.log("subbb",this.subCategory);

}
  removeImage(){
    this.debit_image = "";
  }

getSubcatgeoryId(ev:any) :void {
  this.selected_subcategory_id = ev.target.value;
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
