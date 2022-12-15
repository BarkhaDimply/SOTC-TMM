import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';


@Component({
  selector: 'app-tm-transfer',
  templateUrl: './tm-transfer.page.html',
  styleUrls: ['./tm-transfer.page.scss'],
})
export class TmTransferPage implements OnInit {
  selectedTourManager:string="";
  tourManagerEnteredAmount:any="";
  imageDisplay: string="";
  imgPath: string="";
  description:string="";
  selectedCurrency:string=""
  expenseData:any;
  showCashCurrency:any= []
  tourManagerList:any;
  selected_manager_id:string="";
  selectedDate:string="";
  transaction_from:string="";
  todayDateTime:any;
  androidPermissions: any;
  isModal: boolean;
  constructor(private globalService: GlobalService,private router: Router,private location: Location,
    private datePipe: DatePipe,
              private apiServices: ApiService,private alertController: AlertController) {
    this.expenseData = JSON.parse(localStorage.getItem("expensesData"));

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

    this.getAllTourManager();
  }


  back() {
    localStorage.removeItem('edit_clicked')
    return this.router.navigate(['/tabs/my-expenses']);
  }

  getAllTourManager(){
   // this.globalService.presentLoading();
    this.apiServices.getTourManager().subscribe(async (result:any) => {
      console.log("getTourManager", result);
      if(result.handlers.length > 0){
        this.tourManagerList = result.handlers

        console.log("handlr",result.handlers);
      }else {
        const alert = await this.alertController.create({
          cssClass: '',
          message: 'There is no other tour manager associated',
          mode: 'ios',
          buttons: ['OK']

        });

        await alert.present();
        return this.router.navigate(['/tabs/my-expenses']);

      }
     // this.globalService.dismissLoading();
    })
  }

  selectTourManager(ev:any):void {
    this.selected_manager_id = ev.target.value;
  }


  async  openGallery(){

    
    this.globalService.takePhoto().then(result => {
      if (result.imageUrl) {
      this.imageDisplay = result.imageUrl;
      this.imgPath = result.imageUrl;
      }
    });

  //   const image = await Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: false,
  //     resultType: CameraResultType.DataUrl,
  //     source: CameraSource.Photos, // Camera, Photos or Prompt!
  //     saveToGallery: true,

  // });

  // if (image) {
  //     this.imageDisplay =image.dataUrl;
  //     this.imgPath = image.dataUrl;

  // }else{

  //           this.androidPermissions.requestPermissions(
  //               [
  //                   this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
  //                   this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
  //               ]
  //           );

  //   }
  }

   async TMTransfer() {

    if (this.tourManagerEnteredAmount < 0) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Negative Value Not Allowed',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/tm-transfer']);
     }

    if(this.selected_manager_id == ''){
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please Select Handover',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/tm-transfer']);
    }
    if(this.transaction_from == ''){

      this.transaction_from = 'Cash';
    }
    if(this.tourManagerEnteredAmount == "" || this.tourManagerEnteredAmount == null ) {
      const alert = await this.alertController.create({
        cssClass: '',
       // header: 'Delete Transaction!',
        message: 'Please enter amount',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/tm-transfer']);

    }

    if(this.selectedDate == ""){
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please Select Date',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/tm-transfer']);
    }

    //this.globalService.presentLoading();


    var Users:string = localStorage.getItem("user")
    if(this.selectedCurrency == ""){
      this.selectedCurrency =  this.showCashCurrency[0]
    }
   let params:any = {}
    params.group_id = JSON.parse(Users).order_id;
    params.driver_id = localStorage.getItem("manager_id");
    params.transaction_amount = this.tourManagerEnteredAmount;

    params.currency = this.selectedCurrency;
    params.date_of_transaction = this.selectedDate;
    params.transaction_from =  'Cash';
    params.driver_name = localStorage.getItem("manager_name");
    params.token = "";
    params.mode = "create";
    params.transaction_type = "tm_transfer";
    params.description = this.description;
    params.transfer_to_driver_id = this.selected_manager_id;
    params.transfer_to_group_id = JSON.parse(Users).order_id;
    params.image = this.imgPath;
    params.image_type = true;

    this.apiServices.postCurrencyExchange(params).subscribe(async (result:any) =>{
     // this.globalService.dismissLoading();
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
          message: 'Transaction Successful',
          mode: 'ios',
          buttons: ['OK']

        });

        await alert.present();

         return this.router.navigate(['/tabs/my-expenses']);
      }
    });
   }
   selectCurrencyDropdown (name: any): void {
    this.selectedCurrency = name;
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
