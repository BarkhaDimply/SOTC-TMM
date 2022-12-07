import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { UserModel } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Location } from '@angular/common';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-members-list-filter',
  templateUrl: './members-list-filter.page.html',
  styleUrls: ['./members-list-filter.page.scss'],
})
export class MembersListFilterPage implements OnInit {

  user: UserModel;
  getFlightCode: any = [];
  filterFlightCode: any;
  keyOfDateMemeberFilter: any = [];
  keyOfTimeMemeberFilter: any = [];
  filterFlightDate: any;
  filterFlightTime: any = [];
  getDateFilter: any;
  getTimeFilter: any;
  getSelectedCodeFilter: string;
  getFilterMemberList: any = [];
  keyReview: any;
  activeSegment: any;
  pushData:any = [];
  filterFlightTimenew: any;


  constructor(
    private alertController: AlertController,
    private apiService: ApiService,
    private auth: AuthService,
    private navCtrl: NavController,
    private actRoute: ActivatedRoute,
    private location: Location,
    private globalService: GlobalService,
  ) { 

    this.user = this.auth.user;

    

  }

  ngOnInit() {

    this.getFlightData();

    this.actRoute.queryParams.subscribe(async (params) => {
      this.keyReview = params.activeSegment

      console.log("this.keyReview::::",this.keyReview);

      

    if(this.keyReview == 'arrival_departure'){ 
      this.activeSegment = "arr";
     }else{
      this.activeSegment = "dep";
     }
     
     });

    
  }

  back(){
    this.filterFlightCode='';
    this.location.back();
  }

  getFlightData(){

    var getFlightCodeV: any = [];

    this.user.members_data.forEach((element) => {     console.log("aaa:::",element);
 
      if(element.flight != ''){
        var flCode = ""
        element.flight.forEach(item => {
          flCode = item.dep_code + "-" + item.arr_code
          getFlightCodeV.push(flCode);  
        })
      }
    });
  
    this.getFlightCode = getFlightCodeV.filter((c: any, index: any) => {
      return getFlightCodeV.indexOf(c) === index;
    });

  }

  getSelectedFlCode(event: any) {
    this.filterFlightCode = event.target.textContent;
    this.getFlightDataBySector()
    
  }

  getSelectedFlDate(event: any) { 
    this.keyOfTimeMemeberFilter=[];

    this.filterFlightDate = event.target.textContent;
    localStorage.setItem("Flight_date",this.filterFlightDate);

    this.getSelectedCodeFilter = localStorage.getItem("Flight_code");
    this.getDateFilter = localStorage.getItem("Flight_date");
   
    Object.entries(JSON.parse(this.getSelectedCodeFilter)).forEach(([key,value]) => {

      var keyDate = value

      if(this.getDateFilter === key){

        console.log("date key::::",key);
        console.log("date value::::",value);

        Object.entries(keyDate).forEach(([key,value]) => {
          var keyTime = key
          this.keyOfTimeMemeberFilter.push(keyTime) 

        });
    
      }
    });

  }
  
  getSelectedFlTime(event: any) {
    this.filterFlightTime = event.target.textContent;

  //  this.filterFlightTime.push(event.target.textContent) 
    localStorage.setItem("Flight_time",this.filterFlightTime);
  }

  getFlightDataBySector(){ 
    //this.globalService.presentLoadingMemeber();
    var Users:string = localStorage.getItem("user")
    let params:any = {}
    params.sector =  this.filterFlightCode
    params.grpId =  JSON.parse(Users).order_id
    params.type =  this.activeSegment

    console.log("filter params::",params);

    this.keyOfDateMemeberFilter = [];

    this.apiService.getFlightDataBySector(params).subscribe(async (result: any) => {
    
      if(result.status === true) {
        this.globalService.dismissLoading();
        localStorage.setItem("Flight_code",JSON.stringify(result.data));

        Object.entries(result.data).forEach(([DateKey]) => {
          this.keyOfDateMemeberFilter.push(DateKey)

          console.log("filter data::",this.keyOfDateMemeberFilter);
        });

      }else{
        const alert = await this.alertController.create({
          cssClass: '',
          message: result.msg,
          mode: 'ios',
          buttons: ['OK']
  
        });
  
        await alert.present();
        return false;
      }
      
    })

  }

  filterElementsNew() { 



    localStorage.setItem('isFilterSet', 'true');
    
    this.getDateFilter = localStorage.getItem("Flight_date");
    this.getTimeFilter = localStorage.getItem("Flight_time");
    this.getSelectedCodeFilter = localStorage.getItem("Flight_code");

  //  const split_time = this.getTimeFilter.split(',');
   
    console.log("this.activeSegment:::", this.activeSegment);

    Object.entries(JSON.parse(this.getSelectedCodeFilter)).forEach(([key, value]) => {

         var getDateNew: any = value;
         var getDate: any = key;

         if(this.getDateFilter === getDate){

          Object.entries(getDateNew).forEach(([keyi, valuei]) => {


            if(keyi === this.getTimeFilter){

            // for(let i=0;i<split_time.length;i++){

            //     if(keyi === split_time[i]){

            //       this.pushData.push(valuei)
            
            //     }
            // }
              this.pushData.push(valuei)
          

                let op = {}
                let merged = 
                 op = {
                  ...this.pushData,
                  ...this.activeSegment

                 }
       

                let navigationExtras: NavigationExtras = {
                  state: {
                    details:this.pushData,
                    details_active:this.activeSegment
                  }
                };  
   console.log("navigationExtras:::", navigationExtras);


                this.navCtrl.navigateForward(['/tabs/members-list'], navigationExtras);
               
              } 
         
           });

          

        } 

      });

    }

  

}
