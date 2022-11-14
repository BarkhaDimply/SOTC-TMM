import { Location } from '@angular/common';
import { Component, NgZone, ViewChild } from '@angular/core';
import { AlertController, IonSegment } from '@ionic/angular';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { TripPageModule } from '../trip/trip.module';
import { empty } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-members-list',
  templateUrl: 'members-list.page.html',
  styleUrls: ['members-list.page.scss']
})
export class MembersListPage {
  [x: string]: any;
  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('segment') segment: IonSegment;
  activeSegment :string;
  config: SwiperOptions = {
    pagination: true,
    height: 400
  };
  user: UserModel;
  selectedHub: string;
  totalMembers = 0;
  callNumber: CallNumber;
  OTP_box: boolean;
  loginResponse: any;
  serverMessage: any;
  //modalService: any;
  closeModal: string;
  getRoomingDataNew: any;
  getRoomingData: any;
  isModal = false;
  isFamily: boolean = false;
  totalDataRoom: any = [];
  totalDataRoomFilter: any = [];
  totalDataRoomFil: any = [];
  itineraryDetails: any;
  isArrivalFilter: boolean = true;
  isRoomingFilter: boolean = false;
  getFlightCode: any = [];
  getFlightDates: any = [];
  getFlightName: any = [];
  getFlightTime: any = [];
  getRoomCategory: any = [];
  filterFlightCode: string = ""
  filterFlightDate:any;
  filterFlightName: string = ""
  isFilter: boolean = false;
  getHoltelLocation: string = "";
  getHoltelName: string = "";
  getselectedRoomCategory: string = "";
  dataStoreSecond1 = [];
  isRoomFilterDone: boolean = false
  filterRoomDetails: any = []
  roomDataArray: any = []
  newRoonData: any;
  roomLength: any;
  searchArrivDept: boolean = true;
  searchArrivflight: boolean = false;
  searchRooming: boolean = false;
  getHotelNames: any = [];
  getHotelNameFilter:any = [];
  getHotelNameFilterNEW:any = [];
  getRoomCat:any = [];
  showsharingDiv = false;
  showLocationDiv = false;
  newFilterArrayName:any[] = [];
  getFilterMemberList:any;
  getFilterMemberListArray:any[] = [];
  getFilterMemberListArrayDep:any[] = [];

  public searchTerm: string = "";
  constructor(private location: Location,
    private alertController: AlertController,
    private apiService: ApiService,
    private ngZone: NgZone,
    private auth: AuthService,
    private globalServices: GlobalService,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) {
    this.selectedHub = localStorage.getItem('selected_hub') || '';
    this.user = this.auth.user;

    this.user.members_data.forEach((element: { hub: any; }) => {
      this.totalMembers++;
      if (element.hub === this.selectedHub) {
      //  this.totalMembers++;
        element['isFamily'] = false;
      }
    });
  
 
  }

  ngOnInit() {  

    this.auth.getUserStatus.subscribe(val => {
      if (val !== '0') {
        this.user = this.auth.user;
      }
    });

    if(localStorage.getItem("Flight_code")){
      this.actRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {   

        this.getFilterMemberList  = this.router.getCurrentNavigation().extras.state.details;

        console.log("dep:::::",this.router.getCurrentNavigation().extras.state.details_active);

        for(let i=0;i<this.getFilterMemberList.length;i++){

          if(this.router.getCurrentNavigation().extras.state.details_active == 'dep'){
            this.getFilterMemberListArray = [];
            this.getFilterMemberListArrayDep.push(this.getFilterMemberList[i].members) 
          }else{
            this.getFilterMemberListArrayDep = [];
            this.getFilterMemberListArray.push(this.getFilterMemberList[i].members) 
          }

         
          console.log("dep1:::::",this.getFilterMemberListArray);


        }

        
    
      }
    
    });
  }

    

  }

  back(){
    this.location.back();
  }

  callNow(m: { phone: string; }) {
    this.callNumber.callNumber(m.phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));

    // console.log("phone---",this.callNumber);
  }

  segmentChanged(event: { target: { value: string; }; }) { 
    if (event.target.value === 'airline') { 
      this.activeSegment = 'airline';

      this.isRoomingFilter = false
      this.isAirline= true;
      this.isFilter= false;
      this.searchArrivDept = false;
      this.searchArrivflight = true;
      this.searchRooming = false
      this.swiper.swiperRef.slideTo(0);
      this.isRoomingFilter = true;
      this.isArrivalFilter = true;

      this.getHoltelLocation = "";
      this.getHoltelName = "";
      this.getselectedRoomCategory = "";
      this.getFilterMemberListArray = [];
     

    }else if (event.target.value === 'arrival_departure') {
      this.activeSegment = 'arrival_departure';
      this.isArrivalFilter = true;
      this.isRoomingFilter = false
      this.isAirline= false;
      this.searchArrivDept = true;
      this.searchArrivflight = false;
      this.searchRooming = false
      this.swiper.swiperRef.slideTo(1);
      this.isFilter= false;

       this.getHoltelLocation = "";
       this.getHoltelName = "";
       this.getselectedRoomCategory = "";
       this.getFilterMemberListArray = [];
 
    
    }else if (event.target.value === 'rooming') {
      this.activeSegment = 'rooming';
      this.isRoomingFilter = true;
      this.isArrivalFilter = false
      this.searchArrivDept = false;
      this.searchArrivflight = false;
      this.searchRooming = true
      this.isFilter= false;
      this.rooming();
      this.swiper.swiperRef.slideTo(2);

    
    }
  }

  onSlideChange(event: { activeIndex: number; }[]) {
    if (event[0].activeIndex === 0) {
      this.activeSegment = 'airline';
      this.segment.value = 'airline';
      this.isArrivalFilter = true;
      this.isRoomingFilter = false;
     
    }
    if (event[0].activeIndex === 1) {
      this.activeSegment = 'arrival_departure';
      this.segment.value = 'arrival_departure';
      this.isArrivalFilter = true;
      this.isRoomingFilter = false
    }
    if (event[0].activeIndex === 2) {
      this.activeSegment = 'rooming';
      this.segment.value = 'rooming';
      this.isRoomingFilter = true;
      this.isArrivalFilter = false;
    }
  }

  async presentAlert(msg: any) {
    const alert = await this.alertController.create({
      cssClass: 'remark-alert',
      header: 'Remark',

      message: msg,
      mode: 'ios',
      buttons: ['CLOSE']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  rooming() {
    //this.globalServices.presentLoading();
    var d = JSON.parse(localStorage.getItem('active_group'));

    var user = this.auth.user;

    const data = {
      group_id: d[0]["id"],
      city_id: user.itinerary[0]["locationID"],
      city_name: user.itinerary[0]["locationName"],
      //group_id: d["id"],
      //city_id: user.itinerary["locationID"],
     // city_name: user.itinerary["locationName"],
      nonce: 'KHsD(PF3JzQfT)nm3l^TERO'
    };

    this.apiService.apiGetRooming(data).subscribe((result: any) => {
     // this.globalServices.dismissLoading();
     
      let totalDataRoomData = [];
      let dataStoreSecond = [];
      var newRoomary = []

      if(result.status == 'fail'){
        this.roomLength =0;
      }

      Object.entries(result["data"]).forEach(
        ([key1, value]) => {
          var roomVal: any = value
          for (const [key, value] of Object.entries(roomVal.rooms)) {

            var newRoomValue: any = value;
           // console.log("newRoomValue::::", newRoomValue);
            var paxDetails = [];

            newRoomValue.forEach(el => {
              if (key == el.roomno && key1 == el.hotel_name) {
                var paxObj = {
                  name: el.name,
                  room_cat: el.room_cat,
                  special_remark: el.special_remark,
                  meal_pref: el.meal_pref
                }

                paxDetails.push(paxObj);
                el.paxDetails = paxDetails
              }
            })
            newRoomary.push(newRoomValue)

           // console.log("room::::",newRoomary);
          }
        });
      this.newRoonData = newRoomary

      dataStoreSecond = Object.values(newRoomary);
      this.totalDataRoom = newRoomary

      // this.totalDataRoom=JSON.parse(JSON.stringify(dataStoreSecond))
      this.totalDataRoom = dataStoreSecond
      this.roomLength = this.totalDataRoom.length;
      
      var roomCategory: any = [];
      var hotelName: any = [];
      this.totalDataRoom.forEach(item => {
        item.forEach(itemCat => {
          roomCategory.push(itemCat.room_cat)
          hotelName.push(itemCat.hotel_name)
        })
      });
      this.getRoomCategory = roomCategory.filter((c: any, index: any) => {
        return roomCategory.indexOf(c) === index;
      });
      this.getHotelNames = hotelName.filter((c: any, index: any) => {
        return hotelName.indexOf(c) === index;
      });
      this.getRoomingData = result["data"];
     
    });
   
  }

  isFamilyMembers(parentId: any) {
    var memberList: any = this.user.members_data;



    memberList.forEach(item => {  
      item['isFamily'] = false;
      if (parentId == item.parent_id) { 
        item.isFamily = true;
      } else {
        item.isFamily = false;
      }
    })
  }

  asIsOrder(a, b) {
    return 1;
  }

  getSelectedFlDate(event: any) { 
    this.filterFlightDate = event.target.textContent;

    this.filterTimeShow = true;
    localStorage.setItem('filterFlightDateSelected', this.filterFlightDate );
  }

  onItemChange(ev: any) { 
    //get filter values
    if (ev == 'bySector') { 
      localStorage.setItem('filterBySector', 'sector');
      localStorage.removeItem('filterByDate');
      localStorage.removeItem('filterByFltName');
      this.getFlightDates = [];
      this.getFlightName = [];
      var getFlightCodeV: any = [];
      this.user.members_data.forEach((element) => {   
        
     
       // if (element.hub === this.selectedHub) { //removed by druv sir

          if(element.flight != ''){
            var flCode = ""
            element.flight.forEach(item => {
              flCode = item.dep_code + "-" + item.arr_code
              getFlightCodeV.push(flCode);  
            })

          }

       // }
      });  
      this.getFlightCode = getFlightCodeV.filter((c: any, index: any) => {
        return getFlightCodeV.indexOf(c) === index;
      });
      

    } else if (ev == 'byDate') {
      localStorage.setItem('filterByDate', 'date');
      localStorage.removeItem('filterByFltName');
      localStorage.removeItem('filterBySector');
  
      this.getFlightCode = [];
      this.getFlightName = [];
      var getFlightDate: any = [], getFlightTime: any = [];
      this.user.members_data.forEach((element) => {
       // if (element.hub === this.selectedHub) {
          var flDate = ""
          var flTime = ""
          if(element.flight != ''){

           

          element.flight.forEach(item => {

            if(this.activeSegment == 'arrival_departure'){
              flDate = new Date(item.arr_date).toDateString().split(' ').slice(1).join(' ')
             
                flTime = item.arr_time
            
              
            }else{ 

              flDate = new Date(item.dep_date).toDateString().split(' ').slice(1).join(' ')

              //console.log("111::::",flDate);
             // console.log("222::::",localStorage.getItem('filterFlightDateSelected'));

              //if(localStorage.getItem('filterFlightDateSelected') === flDate.trim()){
                flTime = item.dep_time
              //}
             
             
            }

            //flDate = new Date(item.arr_date).toDateString().split(' ').slice(1).join(' ')
            getFlightDate.push(flDate);
            getFlightTime.push(flTime);
          })
        }
       // }
      });
      this.getFlightDates = getFlightDate.filter((c: any, index: any) => {

        new Date(c).toDateString().split(' ').slice(1).join(' ')
        return getFlightDate.indexOf(c) === index;
      });

      this.getFlightTime = getFlightTime.filter((c: any, index: any) => {
        
       
        new Date(c).toDateString().split(' ').slice(1).join(' ')
        return getFlightTime.indexOf(c) === index;
      });

    } else if (ev == 'byFlightName') {
      localStorage.setItem('filterByFltName', 'fltName')
      localStorage.removeItem('filterByDate');
      localStorage.removeItem('filterBySector');

      this.getFlightCode = [];
      this.getFlightDates = [];
      var getFlightName: any = []
      this.user.members_data.forEach((element) => {
       // if (element.hub === this.selectedHub) {
        if(element.flight != ''){
          var flName = ""
          element.flight.forEach(item => {
            flName = item.ticket
            getFlightName.push(flName);
          })
        }
       // }
      });
      this.getFlightName = getFlightName.filter((c: any, index: any) => {
        return getFlightName.indexOf(c) === index;
      });

    }
  }

  getSelectedFlCode(event: any) {
    this.filterFlightCode = event.target.textContent;
  }


  getSelectedFlTime(event: any) {
    this.filterFlightTime = event.target.textContent;

    this.filterTimeShow = true;

  }

  getSelectedFlName(event: any) {
    this.filterFlightName = event.target.textContent;

  }

  resetFilter(){ 

    this.isFilter = false;
    this.getHoltelLocation = "";
    this.getHoltelName = "";
    this.getselectedRoomCategory = "";
    this.filterFlightCode="";
    this.filterFlightDate="";
    this.filterFlightTime="";
    this.filterFlightName="";
    this.data_member="";
     if(this.isArrivalFilter == true){
      this.user = this.auth.user;

    this.user.members_data.forEach((element: { hub: any; }) => {
      this.totalMembers++;
      if (element.hub === this.selectedHub) {
        element['isFamily'] = false;
      }
    });
     }
    if(this.searchArrivflight == true){ 
      this.user;
      
     }
    if(this.isRoomingFilter == true){
      this.rooming();
    }
   
    //window.location.reload();
  }


  filterElements() {
    this.isFilter = true;
  

    localStorage.removeItem('filterByDate');
    localStorage.removeItem('filterBySector');
    localStorage.removeItem('filterByFltName');
   
    this.getFlightCode = [], this.getFlightDates = [], this.getFlightName = [];

    if (this.isRoomingFilter) {
      var newRoomary1 = [];
      var newArray1: any = []

      var d = JSON.parse(localStorage.getItem('active_group'));
      var user = this.auth.user;
      const data = {
        group_id: d[0]["id"],
        city_id: this.getHoltelLocationID,
        city_name: this.getHoltelLocation,
        nonce: 'KHsD(PF3JzQfT)nm3l^TERO'
      };  
      this.apiService.apiGetRooming(data).subscribe((result: any) => {
        let dataStoreSecondnew = [];
      
        if(result.status == 'fail'){
          this.roomLength =0;
        }
        this.getRoomingDataNew = result["data"];

        //console.log("1111111111 ::",this.getRoomingDataNew);

          Object.entries(this.getRoomingDataNew).forEach(
              ([key1, value]) => {  
                if(this.getHoltelName.trim() == key1.trim()){  
                  var roomValD: any = value
                  for (const [key, value] of Object.entries(roomValD.rooms)) {
                    var paxDetails = [];
                    var newRoomValue: any = value;

                    newRoomValue.forEach(el => {   
                   
                      if(el.room_cat == this.getselectedRoomCategory && key == el.roomno){   
                        var paxObj = {
                          name: el.name,
                          room_cat: el.room_cat,
                          special_remark: el.special_remark,
                          meal_pref: el.meal_pref
                        }   
                        paxDetails.push(paxObj);
                        el.paxDetails = paxDetails

                        newRoomary1.push(el);

                        
                      }
                
                    })
             
                   // newRoomary1.push(paxDetails)
                  }
                }
            });
     // });
      
 
   

     this.newArray1 = newRoomary1;
      this.ngZone.run(() => {


        var resArr = [];
        newRoomary1.filter(function(item){
          var i = resArr.findIndex(x => (x.roomno == item.roomno));
          if(i <= -1){
                resArr.push(item);
          }
          return null;
        });

        dataStoreSecondnew = Object.values(resArr);

        this.totalDataRoom = dataStoreSecondnew;
        this.roomLength = this.totalDataRoom.length;
        //this.totalDataRoom.push(this.totalDataRoom)
        var roomCategory: any = [];
        var hotelName: any = [];
        var getRoomCat: any = [];
        this.totalDataRoom.forEach(item => {  
        //  console.log("aaaaaaaa",item);
          roomCategory.push(item.room_cat)
          hotelName.push(item.hotel_name)
          getRoomCat.push(item.roomno)
           
        }); 
        
        // this.totalDataRoom = getRoomCat.filter((c: any, index: any) => { 
         
        //   return getRoomCat.indexOf(c) === index;
        // }); 
      
        //this.totalDataRoom.push(this.totalDataRoom)

   
    
     //   console.log("bbbbbb",this.totalDataRoom );
      
   
        // this.roomLength = this.totalDataRoom.filter(x =>
        //   x.length > 0
        // ).length
      })

//code remove
//Object.entries(this.getRoomingData).forEach(

      
      // Object.entries(this.getRoomingDataNew).forEach(
      //   ([key1, value]) => {
      //     var roomVal: any = value
      //     for (const [key, value] of Object.entries(roomVal.rooms)) {
      //       var newRoomValue: any = value;
      //       var paxDetails = [];

      //       newRoomValue.forEach(el => {
      //         if (key == el.roomno && key1 == this.getHoltelName && el.room_cat == this.getselectedRoomCategory) {
      //           var paxObj = {
      //             name: el.name,
      //             room_cat: el.room_cat,
      //             special_remark: el.special_remark,
      //             meal_pref: el.meal_pref
      //           }
      //           paxDetails.push(paxObj);
      //           el.paxDetails = paxDetails
      //           newRoomary1.push(el);
      //         }
      //       })
      //     }
      //   });

      // newArray1.push(newRoomary1)
      // this.ngZone.run(() => {
      //  this.totalDataRoom = newArray1;

      //   this.roomLength = this.totalDataRoom.filter(x =>
      //     x.length > 0
      //   ).length
      // })

    });
    }
  }

  isFilterOpen() {  
    this.ngZone.run(() => {
      this.user = this.auth.user
    });

  }

  //getHotelLocationName(ev: any,) { 
  getHotelLocationName(locationName: any,locationID:any) {
    

    this.getHotelNameFilter = [];
    this.showLocationDiv = true;

    // const arry_data = ev.target.textContent.split(",");
    // this.getHoltelLocation = arry_data[0]; 
    // this.getHoltelLocationID = arry_data[1]; 

    this.getHoltelLocation = locationName; 
     this.getHoltelLocationID = locationID; 

    var d = JSON.parse(localStorage.getItem('active_group'));
      var user = this.auth.user;
      const data = {
        group_id: d[0]["id"],
        city_id: this.getHoltelLocationID,
        city_name: this.getHoltelLocation,
        nonce: 'KHsD(PF3JzQfT)nm3l^TERO'
      };  

      this.apiService.apiGetRooming(data).subscribe((result: any) => {
        this.getRoomingDataNewFilter = result["data"];

        Object.entries(this.getRoomingDataNewFilter).forEach(
          ([key1, value]) => {  
            this.getHotelNameFilter.push(key1)
    
            var roomVal: any = value
            for (const [key, value] of Object.entries(roomVal.rooms)) {
              var newRoomValueFilter: any = value;
              this.getHotelNameFilterNEW.push(newRoomValueFilter)
            }
          });

      });

  }
  
  getHotelNameFil(ev: any) { 
    this.getHoltelName = ev.target.textContent;
    this.showsharingDiv = true;
  

    Object.entries(this.getHotelNameFilterNEW).forEach(
      ([key1, value]) => {
        var room_cat: any = value
        var roomCategory: any = [];
        for (const [key, value] of Object.entries(room_cat)) { 
        //this.getRoomCat.push(value)
        var hotelName: any = [];
        this.totalDataRoom.forEach(item => {
          item.forEach(itemCat => {
            roomCategory.push(itemCat.room_cat)
           // hotelName.push(itemCat.hotel_name)
          })
        }); 
        this.getRoomCat = roomCategory.filter((c: any, index: any) => { 
         
          return roomCategory.indexOf(c) === index;
        });
   
        }
      });
  }
  getRoomCategoryName(ev: any) {
    this.getselectedRoomCategory = ev.target.textContent
  }

  setFilteredItems(ev:any) {
  
    if (this.searchArrivDept) {
      if (this.searchTerm == "") {
        this.user = this.auth.user
      } else {
        this.user.members_data = this.user.members_data.filter(item => {
          return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        });
      }
    } else if (this.searchArrivflight) { 
      if (this.searchTerm == "") {
        this.user = this.auth.user
      } else {
        this.user.members_data = this.user.members_data.filter(item => {
          return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        });
        // this.user.members_data.filter(item => {   
        //   let a = item.flight.filter(itm => {   
        //    if(item.flight != ''){
        //      return itm.ticket.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        //   }
        //   }) 
        //   item.flight = a; 
        // });
  
        // this.ngZone.run(() => {
        //   this.isFilter = true;
        //   this.user.members_data
        // })

      }
    } else if (this.searchRooming) { 
      if(this.searchTerm == ""){
        this.totalDataRoom = this.totalDataRoom
      } else {

        this.totalDataRoom.filter(item => {
          this.totalDataRoomFilter = item.filter(itemCat => {
           
              return itemCat.hotel_name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      
          }) ;

         
        });  console.log("aaaa",this.totalDataRoomFilter);
      

        // this.totalDataRoom = this.totalDataRoom.filter(item => {     
        //   let a =item.flight.filter(itm => {    
        //   return itm.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        //   });
        // });
       
     

       

      }
    }

  }

  async noShowAlertConfirm(id: any, name: any) {
   

    const alert = await this.alertController.create({
      header: 'Mark as "NO SHOW"?',
      message: '<strong>You will not be able to reverse this to active passenger status later</strong>',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah',blah);
            
          }
        }, {
          text: 'Confirm',
          handler: () => {
            let params: any = {
              "id": id,
              "parent_name": name,
              "member_id": "",
              "member_name": ""
            }
      
            this.apiService.updateNoShowStatus(params).subscribe((result: any) => {
              this.globalServices.presentLoading();
            //console.log("result:::",result);
            if(result.status == 'success'){

              this.user_temp_data = JSON.parse(localStorage.getItem("user"));
              this.user_temp_data['members_data'] =  this.user.members_data
              this.active_group = JSON.parse(localStorage.getItem('active_group'));

              let request = {
                'login_code': this.active_group[0]['tourCode'],
                'nonce': 'KHsD(PF3JzQfT)nm3l^TERO'
              };
              this.auth.login(request).subscribe(async (result: any) => {
                this.globalServices.dismissLoading();
                if (result?.status === true) { 
        
                  localStorage.setItem('user', JSON.stringify(result.data));
                 // window.location.reload();
                
                 this.auth.getUserStatus.subscribe(val => {
                  if (val !== '0') {
                    this.user = this.auth.user;
                  }
                });

              

                } 
              });


            }

            })
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async noShowAlertConfirmtoGroups(par_id:any, par_name, mem_id: any, mem_name: any) {
   // console.log(id, name)
    const alert = await this.alertController.create({
      header: 'Mark as "NO SHOW"?',
      message: '<strong>You will not be able to reverse this to active passenger status later</strong>',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirm',
          handler: () => {
            let params: any = {
              "id": par_id, 
              "parent_name": par_name,
              "member_id": mem_id, 
              "member_name": mem_name
            }
        
            console.log("aaaa",params);



            this.apiService.updateNoShowStatus(params).subscribe((result: any) => {
             

              this.globalServices.presentLoading();
           // console.log("result:::",result);
            if(result.status == 'success'){

              this.user_temp_data = JSON.parse(localStorage.getItem("user"));
              this.user_temp_data['members_data'] =  this.user.members_data
              this.active_group = JSON.parse(localStorage.getItem('active_group'));

              let request = {
                'login_code': this.active_group[0]['tourCode'],
                'nonce': 'KHsD(PF3JzQfT)nm3l^TERO'
              };
              this.auth.login(request).subscribe(async (result: any) => {
                this.globalServices.dismissLoading();
                if (result?.status === true) {
        
                  localStorage.setItem('user', JSON.stringify(result.data));
                  this.auth.getUserStatus.subscribe(val => {
                    if (val !== '0') {
                      this.user = this.auth.user;
                    }
                  });

                  if(localStorage.getItem("Flight_code") != ''){
                 
                  }
                } 
              });
            }
            })
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }



 
}


