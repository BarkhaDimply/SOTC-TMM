import { Component, ComponentRef, NgZone, OnInit, ResolvedReflectiveFactory, ViewChild } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertController, IonSegment, IonSlides, NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global/global.service';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
import { element } from 'protractor';

@Component({
  selector: 'app-my-expenses',
  templateUrl: 'my-expenses.page.html',
  styleUrls: ['my-expenses.page.scss']
})
export class MyExpensesPage implements OnInit{

  getCurrBalance:any;
  user: UserModel;
  toggleChecked : boolean = false;
  manager_name : string;


  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('segment') segment: IonSegment;
  activeSegment : any;
  config: SwiperOptions = {
    pagination: true,
    height: 400
  };

  @ViewChild(IonSlides) slides: IonSlides;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false
  };
  deletedTransactionShow: boolean;
  expensesData: string;
  isModal = false;
  transctionHistory:any = [];
  newTranscationList:any;
  indeterminateState: boolean;
  checkParent: boolean;
  Checkboxes: any;
  selectedTrasactionIds:any = [];
  showSelect:boolean=true;
  showSelecthide:boolean=false;
  getAllTrasactionId:any = [];
  getAllTrasactionIds:any = [];
  todayDateTime:any;
  hideSubmitButton:boolean=true;
  datePipe: any;
  keyReview: any;
  varTrue =true;
  varFalse = false;
  varTrue1 =true;
  varFalse1 = false;
  VisibleSect = true;
  NoVisibleSect = true;
  subTrue = true;
  btnSubstatus=' ';
  transctionHistoryNew:any;
  btnShowTrans=' ';
  rejectedTransctionHistory:any=[];
  errorMsgReject: boolean;
  componentRef!: ComponentRef < MyExpensesPage > ;
  getNotiKey: any;
  lengthOfVal: any;
  valueGetLength: any;
  
  constructor(
    private auth: AuthService,
    private apiService: ApiService,
    private globalService: GlobalService,
    private location: Location,
    private navCtrl: NavController,
    private alertController: AlertController,
    private apiServices:ApiService,
    private ngZone: NgZone,
    private actRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.user = this.auth.user;

    console.log("const::::");

  }
  ngOnInit(){
    
    console.log("ngOnlnit::::");

    this.showCurrentBalance();
    setTimeout(() => {
      this.swiper.swiperRef.slideTo(0);
    },200);


    this.getRejectedTransactions();

    localStorage.removeItem('edit_clicked');
    this.getCurrencyCODE();

    this.manager_name=localStorage.getItem("manager_name");

    this.actRoute.queryParams.subscribe(async params => { 

      console.log("params 1111::::",params);

      if (this.router.getCurrentNavigation().extras.state) {
        
        this.getNotiKey = this.router.getCurrentNavigation().extras.state.details;
        
      }
      console.log("getNotiKey:::" ,  this.getNotiKey);

      if(this.getNotiKey == '28'){  console.log("innn 28");
        this.activeSegment = "allTrans";
        this.getTransactions();
      //  this.refRejected();
       
      }else if(this.getNotiKey == '27'){

        this.activeSegment = 'rejected_trans';
        this.getRejectedTransactions();

        //this.valueGetLength = localStorage.getItem('lengthOfVal');
        
        //console.log("aaaaaaaaaa444:::",this.valueGetLength);

        // if(this.valueGetLength == 0 || this.valueGetLength == '' || this.valueGetLength == 1){

        //   const alert = await this.alertController.create({
        //     cssClass: '',
        //     message: 'Your transactions have been deleted and auto-submitted for approval.',
        //     mode: 'ios',
        //     buttons: ['OK']
    
        //   });
         
        //   await alert.present();
        //   localStorage.removeItem('lengthOfVal');
     
        // }
      
        

      }else{
        this.getTransactions();
      }

     // this.refRejected();
      //this.getTransactions();
      this.showCurrentBalance();

      if(params.filter=='new'){ console.log("parms filter in::::");
        this.getRejectedTransactions();
      
        this.showCurrentBalance();
      }
    });


    console.log("tabs::::",this.activeSegment);

  }

  refRejected(){
      this.rejectedTransctionHistory = [];
      this.getRejectedTransactions();
  }

  doRefresh(event) {
   this.refressfunc();

    setTimeout(() => {

      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);}
  refressfunc(){
      this.transctionHistory=[];
      this.getTransactions();
      this.showCurrentBalance();
  }
  soAmount(){

    this.varTrue = false;
    this.varFalse = true;

  }

  soAmount1(){

    this.varTrue1 = false;
    this.varFalse1 = true;

  }

  visibleSec(){
  this.VisibleSect =! this.NoVisibleSect;
    this.NoVisibleSect = this.VisibleSect ;
  }

  showCurrentBalance(){

    this.expensesData=localStorage.getItem("expensesData");
    // if(this.expensesData != ''){
    //   this.getCurrBalance = this.expensesData
    // }



    this.apiService.getCurrentBalance().subscribe ((result:any) =>{

      if(result.data.length > 0) {
        for (let i = 0; i < result.data.length; i++){
          result.data[i].isChecked = false;
          result.data[i].isCashAmount = false;
        }
      }

      this.getCurrBalance = result.data;
      localStorage.setItem("expensesData", JSON.stringify(result.data));
      });


  }

  toggleClicked(id,balance) {




    this.toggleChecked = true;

      for (let i = 0; i < this.getCurrBalance.length; i++){

        if(this.getCurrBalance[i].id == id){

          localStorage.setItem('walletCurrencysign',this.getCurrBalance[i].currency_name);
          this.getCurrBalance[i].isCashAmount = this.getCurrBalance[i].isChecked;

        }


      }

  }

  getCurrencyCODE() {
    this.apiService.getCurrencyCodes().subscribe((result:any) => {
      localStorage.setItem('currency_code',JSON.stringify(result));
    });
  }

  back(){
    this.location.back();
  }

  getTransactions(){

    console.log("getTransactions in::::");


    this.apiServices.getAllTransctionHistoryByTime().subscribe((result:any) => {
      this.transctionHistory = [];

      Object.entries(result.data).forEach(
        ([key, value]) => {
          this.transctionHistory.push({transKey:key,transValue:value});

      });


      // plus button hide function

      this.transctionHistory.forEach(itms=>{
        itms.transValue.forEach(itm=>{
          this.btnSubstatus = itm.submission_status;
          this.btnShowTrans = itm.show_transaction;
        });


      });



      // result.data.forEach(element => {
      //   element.display_date = new Date(element.time_of_transaction).toDateString();
      //   element.compare_date = element.time_of_transaction;
      //   element.isItemChecked = true;

      // });
      //this.transctionHistory = result.data;

      localStorage.setItem("selectedTrasactionIds", JSON.stringify(this.transctionHistory));

      if(result.data.length > 0){
        this.sortByDate();
      }

    });
  }

  sortByDate() {
    // Sort the array by Date
    this.transctionHistory = this.transctionHistory.sort(function(a, b) {
    var c:any = new Date(a.time_of_transaction);
    var d:any = new Date(b.time_of_transaction);

    return d-c;
});


// get all the date to create an array as Key value
    var getAllDates:any=[];
     this.transctionHistory.forEach(element => {
        getAllDates.push(element.time_of_transaction);
      });

      // removing duplicate dates from above array
     let uniqueChars = getAllDates.filter((c:any, index:any) => {
        return getAllDates.indexOf(c) === index;
    });

    // new transaction list with key value pair
    var historyValue:any=[]
    var map = new Map();
  uniqueChars.forEach(element1 => {
    historyValue = []
  this.transctionHistory.forEach(item => {

    if(item.time_of_transaction == element1){
      historyValue.push(item)
      this.newTranscationList =   map.set(item.display_date, historyValue);

    }
  });
});

  }
  asIsOrder(a, b) {
    return 1;
}

editTransaction (details:any){

//this.globalService.presentLoading();
this.apiServices.editTRansctionAPI(details.id).subscribe((result:any) => {
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

});
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
          this.apiServices.deleteTransactionHistory(details.id).subscribe((result:any) =>{


            if(result.message == 'Success'){

              this.globalService.presentToast('Transaction deleted successfully 111');

              this.refressfunc();
              this.refRejected();

              
                
            }
          });
        }
      }
    ]
  });

 // await alert.present();

}

checkCheckbox() {

  this.showSelecthide=true;

  this.ngZone.run(()=>{
    this.transctionHistory.forEach(el =>{
      el.isItemChecked = !el.isItemChecked

    });
  });
}

verifyEvent(id:any) {

  //this.selectedTrasactionIds.push(id);

 // localStorage.setItem("selectedTrasactionIds", this.selectedTrasactionIds);

  //const allItems = this.Checkboxes.length;
  let selected = 0;
 /* this.Checkboxes.map(item => {
    if (item.isItemChecked) selected++;
  });*/
  if (selected > 0) {
    // One item is selected among all checkbox elements
    this.indeterminateState = true;
    this.checkParent = false;
  }  else {
    // No item is selected
    this.indeterminateState = false;
    this.checkParent = false;

  }
}

async addTransactionHistory(){

  this.getAllTrasactionId = (JSON.parse(localStorage.getItem("selectedTrasactionIds")));

  var transValue:any=[];

  this.getAllTrasactionId.forEach(async items => {

    items.transValue.forEach(async item =>{
      this.btnSubstatus = item.submission_status;


      if(item.category != 'BALANCE ADDED' && item.category != 'tm_transfer' && item.show_transaction == 0 && item.submission_status == 0){
        transValue.push(item.id);
        this.hideSubmitButton=false;
      }

    });
    // && item.submission_status == 0 && item.show_transaction == 0

  });

  if(transValue.length == 0){
  
    const alert = await this.alertController.create({
      cssClass: '',
      message: 'No transaction found to submit',
      mode: 'ios',
      buttons: ['OK']

    });

    await alert.present();return;
  }

  let params:any = {}
  var Users:string = localStorage.getItem("user")
  params.group_id =  JSON.parse(Users).order_id
  params.manager_id = localStorage.getItem("manager_id");
  params.transaction_ids = JSON.stringify(transValue);

  this.apiServices.postSendSubmission(params).subscribe(async (result:any) =>{
   // this.globalService.dismissLoading();
    if(result.status == false){

      const alert = await this.alertController.create({
        cssClass: '',
        message: result.message,
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();return;
    }
     if(result.status == true) {


      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Transaction Submit',
        mode: 'ios',
       buttons: ['OK']

      });

      await alert.present();
     this.refressfunc();
      }
  });

}

segmentChanged(event) { 

    this.activeSegment=event

   if (this.activeSegment === 'allTrans') {
     this.swiper.swiperRef.slideTo(0);
    //this.getTransactions();
  }
  if (this.activeSegment=== 'rejected_trans') {
    this.swiper.swiperRef.slideTo(1);
    
  }
 // localStorage.setItem('activeKeyTrans',this.activeSegment);
}

onSlideChange(event) {



  if (event[0].activeIndex === 0) {
    this.activeSegment = 'allTrans';
    this.segment.value = 'allTrans';
   // this.getTransactions();
  }
  if (event[0].activeIndex === 1) {
    this.activeSegment = 'rejected_trans';
    this.segment.value = 'rejected_trans';
   // this.getRejectedTransactions();
  }

}


/********************Rejected Trans************************/


getRejectedTransactions(){

  this.apiServices.getRejectedTransctionHistoryByTime().subscribe((result:any) => {
    this.rejectedTransctionHistory =[];
   
  //  if(result.data.length>0){+
      Object.entries(result.data).forEach(
        ([key, value]) => {
          this.lengthOfVal = value;
          
          localStorage.setItem('lengthOfVal',this.lengthOfVal.length);

          console.log("sssssssssss:::",this.lengthOfVal.length);

          this.rejectedTransctionHistory.push({transKey:key,transValue:value})

      });



   

    // plus button hide function
    this.transctionHistory.forEach(itms=>{
      itms.transValue.forEach(itm=>{
        this.btnSubstatus = itm.submission_status;
        this.btnShowTrans = itm.show_transaction;
      });

    });

  });  
}


addTransactionHistoryReview(){



  this.getAllTrasactionId = (JSON.parse(localStorage.getItem("selectedTrasactionIds")));
  var transValue:any=[];

  this.rejectedTransctionHistory.forEach(items => {

    items.transValue.forEach(async item =>{

      item.id.forEach(async getId =>{
        transValue.push(getId)

      });

          //if(item.category != 'BALANCE ADDED' && item.category != 'misc_collection' && item.category != 'tm_transfer' && item.show_transaction == 0){
          //transValue.push(item.id)
          //}
    });
  });

  let params:any = {}
  var Users:string = localStorage.getItem("user")
  params.group_id =  JSON.parse(Users).order_id
  params.manager_id = localStorage.getItem("manager_id");
  //params.transaction_ids = JSON.stringify(this.selectedTrasactionIds);
  params.transaction_ids = JSON.stringify(transValue);


  this.apiServices.postSendSubmission(params).subscribe(async (result:any) =>{

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
     if(result.status == true) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Submitted Successfully',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();

       this.refressfunc();
       //this.refRejected();

       return this.router.navigate(['/tabs/itinerary']);
      }
  });

}



editReviewTransaction (details:any){

 // this.globalService.presentLoading();
 // this.globalService.dismissLoading();

  localStorage.setItem("view_details", JSON.stringify(details));

}




}

