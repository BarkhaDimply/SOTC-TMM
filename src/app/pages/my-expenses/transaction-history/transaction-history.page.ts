import { Component, NgZone, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.page.html',
  styleUrls: ['./transaction-history.page.scss'],
})
export class TransactionHistoryPage implements OnInit {
  transctionHistory:any;
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


  constructor(private globalService: GlobalService,private location: Location,
              private navCtrl: NavController,
              private alertController: AlertController,
              private apiServices:ApiService,
              private ngZone: NgZone) {  

  }

  ngOnInit() {
    
    this.getTransactions(); 
   
  }

  back(){
    this.location.back();
  }

  getTransactions(){
    //this.globalService.presentLoading();
    this.apiServices.getAllTransctionHistory().subscribe((result:any) => {
     // this.globalService.dismissLoading();
      result.data.forEach(element => {
        element.display_date = new Date(element.time_of_transaction).toDateString();
        element.compare_date = element.time_of_transaction;
        element.isItemChecked = true;

      });
      this.transctionHistory = result.data;

      console.log("transctionHistory1111::",this.transctionHistory);

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




}
