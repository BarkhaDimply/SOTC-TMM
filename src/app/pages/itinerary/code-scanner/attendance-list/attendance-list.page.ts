import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-attendance-list',
  templateUrl: './attendance-list.page.html',
  styleUrls: ['./attendance-list.page.scss'],
})
export class AttendanceListPage implements OnInit {
  user: UserModel;
  fetchAttendance: any;
  getEditValue: any;
  place_id: string = "";
  locationId: string = "";
  day: string = "";
  group_id: any;
  fetchData: any=[];
  timeStamp: number;
  day_new: string = "";
  memberData: any[];
  memberDataLength: number;
  place: any;
  locationName: any;
  paramsCheck: any;
  postId: any;
  fetchAttendancePresent: unknown[];
  fetchDataPresent: unknown[];
  presentListLength: number;
  type: any;
  city: any;
  member_name: any;
  getEditValueOP: any;
  placeId: any;
  postIdNew: any;
  scanActive: boolean;
  
  constructor(private apiServices: ApiService, private actRoute: ActivatedRoute,private alertController: AlertController,
    private router: Router, 
    private globalService: GlobalService,private location: Location,private auth: AuthService) {


    this.actRoute.queryParams.subscribe(params => {

      if(params){
        this.paramsCheck = params;
        this.place_id = params.placeId;
        this.day_new = params.day;
        this.locationId = params.locationId;
        this.city = params.city;
        this.place = params.place;
        this.type = params.type
      }


      if (this.router.getCurrentNavigation().extras.state) {  
       
        this.getEditValue = this.router.getCurrentNavigation().extras.state.details;

        this.getEditValueOP = this.router.getCurrentNavigation().extras.state.details_op;

        this.postIdNew = this.getEditValueOP.postId;
        this.locationId = this.getEditValueOP.locationId;
        this.place_id = this.getEditValueOP.placeId;
        this.day_new = this.getEditValueOP.day;
        this.city = this.getEditValueOP.city;
        this.place = this.getEditValueOP.place;


       // const myObjgroup_id = JSON.parse(this.getEditValue);

      //   this.group_id = myObjgroup_id.groupId;

      //   const myObjPlaceId = JSON.parse(this.getEditValue);
      //   this.place_id = myObjPlaceId.placeId;

      //   const myObjLocation = JSON.parse(this.getEditValue);
      //   this.locationId = myObjLocation.locationId;

      //   const myObjDay = JSON.parse(this.getEditValue);
      //  // this.day = 'day-' + myObjDay.day;
      //   this.day_new = myObjDay.day;

      //   this.place = myObjgroup_id.place;
      //   this.locationName = myObjgroup_id.locationName;
      //   //this.postId = myObjgroup_id.postId;

      }

    });
    this.user = this.auth.user;
  }

  ngOnInit() {
    //  this.getAttendanceListFetch();

    

    if (typeof this.type !== 'undefined'){ 
      this.getAttendancePresentListFetch();
    }else{   
      this.getAttendanceListNew();
    }

   
  }

  back() {
    this.location.back();
  }

  backScanner(){ 
    // window.location.reload();
    return this.router.navigate(['/tabs/itinerary']);
  }

  getAttendanceListFetch() {
  
    let params: any = {
      "group_id": this.group_id,
      "place_id": this.place_id,
      "day": this.day,
      "locationId": this.locationId
    }
    let params_json: any = {}
    params_json = JSON.stringify(params);

 
 
    this.apiServices.getAttendanceList(params).subscribe(async (result: any) => {
      this.fetchAttendance = Array.from(Object.values(result));
      if(this.fetchAttendance.length > 0){

          this.fetchData = Array.from(Object.values(result));
          
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            message: 'Attendance Marked Successfully',
            mode: 'ios',
            buttons: ['OK']
        
          });
        
          await alert.present();
          return;

        }else{
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            message: 'Attendance Not Marked',
            mode: 'ios',
            buttons: ['OK']
        
          });
        
          await alert.present();
          return;
    
        }
      
    });
  
  }

  async updateAttendanceById(traveler_name: any,postId: any) {

    console.log("postId 111:::",postId);

    if(typeof JSON.stringify(postId) == 'undefined'){ 
      this.postId =  this.postIdNew;
    }else{
      this.postId =  postId;
    }

    this.timeStamp = new Date().getTime()/1000;

    var Users:string = localStorage.getItem("user");
    let params: any = {
      "groupId": JSON.parse(Users).order_id,
      "postId": this.postId,
      "placeId": this.place_id,
      "day": this.day_new,
      "locationId": this.locationId,
      "status":1,
      "nonce":"KHsD(PF3JzQfT)nm3l^TERO",
      "timestamp":this.timeStamp,
      "member_name":traveler_name,
      "city":this.city,
      "place":this.place,
      "step":2

    }

    console.log("update attendance new::::",JSON.stringify(params));
  
    this.apiServices.scanAttendanceById(params).subscribe(async (result: any) => {

     console.log("result::::",JSON.stringify(result));

      if(result){
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          message: result.msg,
          mode: 'ios',
          buttons: ['OK']
        });
        await alert.present();
       // window.location.reload();
        return;
      }
  
    })

  }

  getAttendanceListNew(){

    console.log("single name::::",JSON.stringify(this.getEditValue.name));

    let member_data=[];

    if(typeof this.getEditValue.name !== 'undefined'){ 
      member_data.push({member_name:this.getEditValue.name,msg:this.getEditValue.msg})
    }else{ 
      this.getEditValue.forEach((ele:any)=>{  
        member_data.push({postIDNEW1:ele.postID,member_name:ele.name,Relation:ele.Relation,attendance:ele.attendance})
      })
    }

    console.log("member_data::::",JSON.stringify(member_data));

    this.memberData = member_data;
    this.memberDataLength = this.memberData.length
   
  }


  getAttendancePresentListFetch() {

    var Users:string = localStorage.getItem("user");
  
    let params: any = {
      "type": this.type,
      "day": this.day_new,
      "place_id": this.place_id,
      "group_id": JSON.parse(Users).order_id,
      "locationId": this.locationId
    }
  

    this.apiServices.getAttendancePresentList(params).subscribe(async (result: any) => {
      this.fetchAttendancePresent = Array.from(Object.values(result));
      this.presentListLength = this.fetchAttendancePresent.length

      if(this.fetchAttendancePresent.length > 0){

          this.fetchDataPresent = Array.from(Object.values(result.data));

          console.log("fetch att:::",this.fetchDataPresent);
          
        }else{
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            message: result.error,
            mode: 'ios',
            buttons: ['OK']
        
          });
        
          await alert.present();
          return;
    
        }
      
    });
  
  }

}


