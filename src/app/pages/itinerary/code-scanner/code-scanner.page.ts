import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { timestampInMin } from 'src/app/services/utils';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';


@Component({
  selector: 'app-code-scanner',
  templateUrl: './code-scanner.page.html',
  styleUrls: ['./code-scanner.page.scss'],
})
export class CodeScannerPage implements OnInit {

  user: UserModel;
  scanActive: boolean = true;
  getScannerData: any;
  postId: string;
  merber_name: any[]=[];
  attendance_member: any;
  params_obj: any;
  opData: any;
  locationID: any;
  placeId: any;
  day: any;
  locationName: any;
  place: any;
  city: any;
 

  constructor(private router:Router,private apiServices: ApiService,private location: Location,
    private actRoute: ActivatedRoute,private auth: AuthService,private alertController: AlertController,
  
    ) {
    this.user = this.auth.user;

  }

  ngOnInit() {  

    console.log("bcakkk", this.scanActive);
   
    this.startScanner();
    this.auth.getUserStatus.subscribe(val => {
      if (val !== '0') {
        this.user = this.auth.user;
      }
    });

    //manual attendance

    this.actRoute.queryParams.subscribe(async (params) => {
     
     this.placeId = params.placeId
     this.day =params.day
     this.locationID =params.locationId
     this.city=params.city
     this.place=params.place
     
    });
   
  }

  back() {
    this.location.back();
    this.scanActive = true;
  }

  async checkPermission() {  
    //return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      console.log("checkPermission status:::",JSON.stringify(status));


      if (status.granted) {return true;
      }else if (status.denied) {return false;
      }else if (status.neverAsked) {
        const c = await this.alertController.create({
          cssClass: 'my-custom-class',
          message: 'Please give permission for camera to use expense module',
          mode: 'ios',
          buttons: ['OK']
      
        });
      
        await c.present();
        if (!c) {return false;}
      }else if (status.restricted || status.unknown) {return false;
      }else{
        //BarcodeScanner.openAppSettings();

        BarcodeScanner.checkPermission();

        //return false;
      }
    
    //});
  }

  async startScanner() {
    const allowed = await this.checkPermission();
   
    console.log("checkPermission:::",allowed);
   
    if (allowed) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) { 
        //this.scanActive = false;

        let paramsP:any = {}
        paramsP.postId = result.content;

        let iti_data=[];
        let iti_data1=[];
        this.user.itinerary.forEach((city) => {
          Object.entries(city).forEach(
            ([key1, value]) => {
              var roomVal: any = value
              if(value && typeof value =='object'){
                iti_data.push({date:key1,dayplan:value})
              }

              // iti_data.forEach((ele:any)=>{
              //   ele.dayplan.forEach((ele2:any)=>{
              //     ele2.attendance.forEach(element => {
              //       iti_data1.push(element)

              //     });

              //   })
               
              // }) 
              
            });
        });

      
        // iti_data1.forEach(element => {

        //   if(element.postID == paramsP.postId){
        //     this.attendance_member=element.name;
        //   }
        // });

        var Users:string = localStorage.getItem("user");
        paramsP.groupId = JSON.parse(Users).order_id;
       // paramsP.member_name = 'SUSANTA KUMAR PRUSTY';
        paramsP.status = '1';
        paramsP.nonce = 'KHsD(PF3JzQfT)nm3l^TERO';
        paramsP.step = '1';
        let currentDate=new Date(); 
        paramsP.timestamp = currentDate.getTime();
       
        var x =  {postId: paramsP.postId};
        var y =  {groupId: paramsP.groupId};
        var b =  {step: paramsP.step};
        var c =  {timestamp: paramsP.timestamp};
        var d =  {status: paramsP.status};
        var e =  {nonce: paramsP.nonce};
        var z = Object.assign( {}, x, y, c, b, d, e);
        let op = {}
        this.actRoute.queryParams.subscribe(async (params) => {
          let merged = 
            op = {
              ...paramsP,
              ...params
            }
          });

          console.log("update new attt111:::::",JSON.stringify(op));

        this.apiServices.scanAttendanceById(op).subscribe(async (result:any) => {

        //  console.log("scan result111:::::",JSON.stringify(result));
         

          if(result.status == true){

            if(typeof JSON.stringify(result.name) !== 'undefined'){ 
              let navigationExtras: NavigationExtras = {
                state: {
                  details:result
                }
              };
             

            this.router.navigate(['/tabs/itinerary/code-scanner/attendance-list'], navigationExtras);   
            }
            if (typeof JSON.stringify(result.name) == 'undefined'){ 
              let navigationExtras: NavigationExtras = {
                state: {
                  details:result.data,
                  details_op:op
                }
              };
              console.log("data not blank::::",JSON.stringify(navigationExtras));

              this.router.navigate(['/tabs/itinerary/code-scanner/attendance-list'], navigationExtras);   
            }
          }else{
            const alert = await this.alertController.create({
              cssClass: 'my-custom-class',
              message: result.msg,
              mode: 'ios',
              buttons: ['OK']
          
            });
          
            await alert.present();
            return;
          }

          

                 
      });
      

      } else {
        alert('NO DATA FOUND!');
      }
     } else { 
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        message: 'Please give permission for camera to use expense module',
        mode: 'ios',
        buttons: ['OK']
    
      });
    
      await alert.present();
      BarcodeScanner.openAppSettings();
    }
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    //this.scanActive = false;
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    //this.scanActive = false;
  }

  


}


