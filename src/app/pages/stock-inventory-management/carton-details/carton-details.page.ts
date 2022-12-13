import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-carton-details',
  templateUrl: './carton-details.page.html',
  styleUrls: ['./carton-details.page.scss'],
})
export class CartonDetailsPage implements OnInit {
  getAllData: any;
  getFetchValue: any;
  group_id: any;
  fetchCarton: any;
  name: any;
  fetchCartonName: any;
  title: any;
  fetchCartonTitle: any;
  items: any[] = [];
  fetchCartonRemark: any;
  remark: any;
  countFetch: string;
  getFetchValueParams: any;
  carton_id: any;
  fetchCartonTitleObj: any = {};
  dataItem: any[] = [];
  //fetchCartonUsed:any;
  fetchCartonTitleTitle: string;
  balanceCount: boolean;
  fetchstockCount: any;
  getStockValue: any = [];
  countValue: any;
  totalBalValue: string;
  totalStockValue: string;
  totalStockVal: any;
  afterUpdateBal: boolean;
  fetchCartonStockId: unknown[];
  id: any;
  balanceCountPre: boolean;
  fetchCartonUsed1:any[] = [];
  valueGet:any[] = [];
  valueOfLastItem: any;
  mergeJson: any;
  getData: any;
  balLeft: Number;
  CountBal: any;
  scanActive: boolean;
  cartonForm: UntypedFormGroup;
  itemsNew:  any[] = [];
  roomTitle: any;

  constructor(
    private apiService: ApiService,
    private globalService: GlobalService,
    private router: Router,
    private actRoute: ActivatedRoute, private alertController: AlertController,
    private fomrBuilder: UntypedFormBuilder, private location: Location) {
      this.actRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
  
          this.getFetchValue = this.router.getCurrentNavigation().extras.state.details;
          this.getFetchValueParams = this.router.getCurrentNavigation().extras.state.paramsD;
  
          
  
          const myObjname = JSON.parse(this.getFetchValue);
          this.name = myObjname.name;
  
          const myObjremark = JSON.parse(this.getFetchValue);
          this.remark = myObjremark.remark;
  
          const myObjitems = JSON.parse(this.getFetchValue);
          this.items = myObjitems.items;
  
          const myObjiCartonId = JSON.parse(this.getFetchValueParams);
          this.carton_id = myObjiCartonId.carton_id;
  
          const myObjID = JSON.parse(this.getFetchValue);
          this.id = myObjID.id;
  
         
        }
  
      });

  }

  ngOnInit() {
    this.formBinding();
    this.fetchStock();
  }

  formBinding(){
    this.cartonForm = this.fomrBuilder.group({
      fetchCartonUsed: ['', [ Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
    });
  
  }

  get fetchCartonUsed() {   return this.cartonForm.get('fetchCartonUsed'); }

  back(){
    this.location.back();
  }

  // totalcountBalance(arryValue: any) {
  //   let value = 0;
  //   let myary = JSON.stringify(arryValue);
  //   var mytotalData = []
  //   JSON.parse(myary).forEach(element => {
  //     mytotalData.push(
  //       {
  //         title: element.title,
  //         count: element.count,
  //         left: this.fetchCartonUsed.value,

  //       });
  //   });

  //   let totalValue: any = 0;
  //   totalValue = JSON.parse(JSON.stringify(mytotalData)).forEach(element => {
  //     totalValue = (element.totalCount + totalValue);
  //     this.totalBalValue = JSON.stringify(totalValue)
  //   });


  // }

  fetchStock() {
     this.balanceCount = true;
     this.fetchCartonName = this.name;
     this.fetchCartonRemark = this.remark;
     this.fetchCartonTitle = Array.from(Object.values(this.items));

     console.log("fetch122222:::", JSON.stringify(this.fetchCartonTitle));

    //this.fetchCartonStockId = Array.from(Object.values(this.id));

    /*****************fetch stock total***************************/

    let totalValueSum=0
    this.fetchCartonTitle.forEach((element) => { 
      
      totalValueSum = Number(element.left) + totalValueSum;

      this.totalStockVal = totalValueSum
    });

  //   let value = 0;
  //   let myary = JSON.stringify(this.fetchCartonTitle);
  //   let myary1 = this.fetchCartonTitle;
  
  //   let totalstockValue: any = 0;
  //  // var new_carton_arr = this.valueGet.split(',');

  //   var mytotalData = []
  //   JSON.parse(myary).forEach(element => {  
  //     mytotalData.push(
  //       {
  //         title: element.title,
  //         count: element.count,
  //         left: element.left
  //        // totalCount: element.count - new_carton_arr[0]


  //       });

  //   });

    // let totalValueSum=0
    // totalstockValue = mytotalData.forEach(element => {
    //   let ve = JSON.stringify(element)
    //   totalValueSum= Number(JSON.parse(ve).left) + totalValueSum;
    //   this.totalStockVal = JSON.stringify(totalValueSum);

    // });
  }

  async updatestockData(count:any,title:any,indexUpdate) { 

    if(Math.floor(Number(this.fetchCartonUsed.value)) !== Number(this.fetchCartonUsed.value)){
      const alert = await this.alertController.create({
       // cssClass: 'my-custom-class',
        message: 'Wrong Input',
        mode: 'ios',
        buttons: ['OK']
    
      });
    
      await alert.present();
      return false;
    }else if(Number(this.fetchCartonUsed.value) < 0){ 
      const alert = await this.alertController.create({
       // cssClass: 'my-custom-class',
        message: 'Negative Value Not Allowed',
        mode: 'ios',
        buttons: ['OK']
    
      });
    
      await alert.present();
      return false;
    }else if(Number(this.fetchCartonUsed.value) > count){
      const alert = await this.alertController.create({
       // cssClass: 'my-custom-class',
        message: 'Please Enter Used Value Less Than Instock Value',
        mode: 'ios',
        buttons: ['OK']
    
      });
    
      await alert.present();
      return false;
    }
   

   // this.totalcountBalance(this.fetchCartonTitle)

    var Users: string = localStorage.getItem("user")
    let params: any = {}
    params.group_id = JSON.parse(Users).order_id;
    params.nonce = 'KHsD(PF3JzQfT)nm3l^TERO';
    params.carton_id = this.carton_id;

    const valueOfUpdate = this.valueGet
    const [key, value] = Object.entries(valueOfUpdate).pop();
    var getValue = value
    const getIndexValue = Object.values(getValue)[0];
    const getItemValue = Object.values(getValue)[1];

   // console.log("d11111111111111",JSON.stringify(this.fetchCartonTitle));

    //this.fetchCartonTitle.forEach((element,index) => {

      //console.log("element::::",JSON.stringify(element));
      this.dataItem = [];
      if(indexUpdate == getIndexValue){  
        this.fetchCartonTitle.forEach((value) => {

       // Object.entries(this.fetchCartonTitle).forEach( 
          //async ([key, value]) => { 
           var roomVal: any = value

           //this.roomTitle = roomVal.title;
           
              if(roomVal.title == title){     

               // var minusValue = (roomVal.left - Number(getItemValue))
                this.balLeft = roomVal.left - Number(getItemValue)
                this.CountBal = count

              }else{  
                this.balLeft =  roomVal.left
                this.CountBal = roomVal.count
              } 
              this.dataItem.push(
                {
                  title: roomVal.title,
                  count: this.CountBal,
                  left: this.balLeft 
                  
                });
            
              
          });
        //  console.log("a22222222",JSON.stringify(this.dataItem));

      }

   // });
  

    params.data = JSON.stringify(this.dataItem);

    this.afterUpdateBal = true;

    if(this.id == params.carton_id){ 

      this.apiService.postUpdatestockData(params).subscribe(async (result:any) =>{
        
        if(result.status == 'success'){
         const alert = await this.alertController.create({
        //   cssClass: 'my-custom-class',
           message: 'Updated Successfully',
           mode: 'ios',
           buttons: ['OK']
       
         });
        
         await alert.present();
        // this.scanActive = true;
        // window.location.reload();

      
        this.cartonForm = this.fomrBuilder.group({
          fetchCartonUsed: ['', [ Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
        });
       
    
         this.apiService.getFetchStockInventory(params).subscribe((result:any) => {
          let navigationExtras: NavigationExtras = {
            state: {
              details:JSON.stringify(result.data),
              //paramsD:JSON.stringify(params)
            }
          };

           const myObjitems = JSON.parse(navigationExtras.state.details);
           this.itemsNew = myObjitems.items;
           this.fetchCartonTitle = Array.from(Object.values(this.itemsNew));

           console.log("fetch:::",JSON.stringify(this.fetchCartonTitle));
          
            let totalValueSum=0
            this.fetchCartonTitle.forEach((element) => { 
              
              totalValueSum = Number(element.left) + totalValueSum;

              this.totalStockVal = totalValueSum
            });
         });
  
         
        }else{
         const alert = await this.alertController.create({
           //cssClass: 'my-custom-class',
           message: result.message,
           mode: 'ios',
           buttons: ['OK']
       
         });
       
         await alert.present();
         return;
        }
       
  
      })

    }
     
  }

  fetchUsed(eve:any,idx){ 
  
    this.balanceCountPre = true;

    this.valueGet.push({ 
      indx:idx,
      value: eve.target.value,
      
    });

    
  }

}
