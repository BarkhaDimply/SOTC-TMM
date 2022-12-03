import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertController, IonSegment, IonSlides, NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global/global.service';
import { Location } from '@angular/common';
import { NavigationExtras } from '@angular/router';
import { SwiperComponent } from 'swiper/angular';
import Swiper from 'swiper';


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
  numLimit  = 3;
 
  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('segment') segment: IonSegment;
  activeSegment = '';
  
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

  constructor(
    private auth: AuthService,
    private apiService: ApiService,
    private globalService: GlobalService,
    private location: Location,
    private navCtrl: NavController,
    private alertController: AlertController,
    private apiServices:ApiService,
    private ngZone: NgZone
  ) {
    this.user = this.auth.user;
  }
 

  ngOnInit(){
    this.getTransactions(); 
    this.showCurrentBalance();
    localStorage.removeItem('edit_clicked');
    this.getCurrencyCODE()
    this.manager_name=localStorage.getItem("manager_name");

  }

  setOpen(isOpen: boolean) { 
    this.isModal = isOpen; 
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
      })
  }

  toggleClicked(id,balance) {

    this.toggleChecked = true;

      for (let i = 0; i < this.getCurrBalance.length; i++){
      
        if(this.getCurrBalance[i].id == id){ 
       
          localStorage.setItem('walletCurrencysign',this.getCurrBalance[i].currency_name)
          this.getCurrBalance[i].isCashAmount = this.getCurrBalance[i].isChecked;
         
          console.log("getCurrBalance::::",this.getCurrBalance[i]);
          console.log("toggle111::::",this.toggleChecked);
        }
  
        
      }
    
  }

  getCurrencyCODE() {
    this.apiService.getCurrencyCodes().subscribe((result:any) => {
      //console.log("CODE::::",result);
      localStorage.setItem('currency_code',JSON.stringify(result));
    })
  }


  back(){
    this.location.back();
  }

  getTransactions(){
 
    this.apiServices.getAllTransctionHistoryByTime().subscribe((result:any) => {

      Object.entries(result.data).forEach( 
        ([key, value]) => { 

          console.log("key:::",key);
          console.log("value:::",value);

          this.transctionHistory.push({transKey:key,transValue:value})
         

      });  

      // result.data.forEach(element => {
      //   element.display_date = new Date(element.time_of_transaction).toDateString();
      //   element.compare_date = element.time_of_transaction;
      //   element.isItemChecked = true;

      // });
      //this.transctionHistory = result.data;

      localStorage.setItem("selectedTrasactionIds", JSON.stringify(this.transctionHistory));

      console.log("ttttt::",this.transctionHistory);
      
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
  console.log("details::::",details);
//this.globalService.presentLoading();
this.apiServices.editTRansctionAPI(details.id).subscribe((result:any) => {
 // this.globalService.dismissLoading();
  localStorage.setItem("edit_clicked", 'yes');
  if(details.category == 'Exchange') {
    let navigationExtras: NavigationExtras = {
      state: {
        details:result.data,
       
      } 
    };
   this.navCtrl.navigateForward(['/tabs/my-expenses/currency-exchange'], navigationExtras);
  } else if(details.category == 'misc_collection') {
    let navigationExtras: NavigationExtras = {
      state: {
        details:result.data,
       
      } 
    };
   this.navCtrl.navigateForward(['/tabs/my-expenses/misc-collection'], navigationExtras);
    
  } else if(details.category == 'cross_currency_by_card') {
    let navigationExtras: NavigationExtras = {
      state: {
        details:result.data,
       
      } 
    };
   this.navCtrl.navigateForward(['/tabs/my-expenses/cross-currency-by-card'], navigationExtras);
    
  } else if(details.category == 'atm_cross_currency') {
    let navigationExtras: NavigationExtras = {
      state: {
        details:result.data,
       
      } 
    };
   this.navCtrl.navigateForward(['/tabs/my-expenses/atm-withdrawal-cross-currency'], navigationExtras);
    
  } else if(details.category == 'atm_same_currency') {
    let navigationExtras: NavigationExtras = {
      state: {
        details:result.data,
       
      } 
    };
   this.navCtrl.navigateForward(['/tabs/my-expenses/atm-withdrawalsame-currency'], navigationExtras);
    
  } else if(details.category == 'OTHERS') {
    let navigationExtras: NavigationExtras = {
      state: {
        details:result.data,
       
      } 
    };
   this.navCtrl.navigateForward(['/tabs/my-expenses/atm-withdrawalsame-currency'], navigationExtras);
    
  }

})
}

async deleteTRansactionHistory(details:any) {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
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
            //this.globalService.dismissLoading();
            console.log("delete:::::",result)
            if(result.message == 'Success'){

              this.globalService.presentToast('Transaction deleted successfully');
              this.getTransactions();
              window.location.reload();
            }
          })
        }
      }
    ]
  });

  await alert.present();
 
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
  //console.log("id-----",id);
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
  this.getAllTrasactionId.forEach(async item => {

    // && item.submission_status == 0 && item.show_transaction == 0

    if(item.category != 'BALANCE ADDED' && item.category != 'misc_collection' && item.category != 'tm_transfer' && item.show_transaction == 0 && item.submission_status == 0){
      transValue.push(item.id)
      
      console.log("id---------",transValue);
      this.hideSubmitButton=false;
    }
    
  });

  if(transValue == ''){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Transaction Already Submitted',
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
    if(result.status == "false"){
  
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        message: result.message,
        mode: 'ios',
        buttons: ['OK']
    
      });
    
      await alert.present();return;
    }
     if(result.status == true) {
    

      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        message: 'Transaction Submit',
        mode: 'ios',
       // buttons: ['OK']
    
      });
    
      await alert.present();
      window.location.reload();
      }
  })

}



segmentChanged(event) {
  if (event.target.value === 'allTrans') {
    this.activeSegment = 'allTrans';
    this.swiper.swiperRef.slideTo(0);
  }
  if (event.target.value === 'rejected_trans') {
    this.activeSegment = 'rejected_trans';
    this.swiper.swiperRef.slideTo(1);
  }
  
}

}

