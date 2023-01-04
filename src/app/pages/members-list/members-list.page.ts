import { Location } from '@angular/common';
import { Component, NgZone, ViewChild } from '@angular/core';
import { AlertController, IonSegment, ModalController } from '@ionic/angular';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
//import { TripPageModule } from '../trip/trip.module';
import { empty } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { nonce } from 'src/app/services/utils';
import { MembersService } from 'src/app/services/members/members.service';
import { MembersListFilterComponent } from 'src/app/components/members-list-filter/members-list-filter.component';

@Component({
  selector: 'app-members-list',
  templateUrl: 'members-list.page.html',
  styleUrls: ['members-list.page.scss']
})
export class MembersListPage {
  [x: string]: any;
  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('segment') segment: IonSegment;

  activeSegment: string = 'airline';
  config: SwiperOptions = {
    pagination: true,
    height: 400
  };
  user: UserModel;
  selectedHub: string;
  totalMembers = 0;
  members_data = [];
  userFilter = {} as any;

  public searchTerm: string = "";
  constructor(private location: Location,
    private memberService: MembersService,
    private auth: AuthService,
    private globalServices: GlobalService,
    private modalController: ModalController,
  ) {
    this.selectedHub = localStorage.getItem('selected_hub') || '';
    this.user = this.auth.user;
    this.members_data = this.user.members_data;
    this.user.members_data.forEach((element: { hub: any; }) => {
      this.totalMembers++;
      if (element.hub === this.selectedHub) {
        element['isFamily'] = false;
      }
    });
  }

  ngOnInit() {
    this.auth.getUserStatus.subscribe(val => {
      if (val !== null) {
        this.user = this.auth.user;
      }
    });
  }

  back() {
    this.location.back();
  }


  segmentChanged(event: { target: { value: string; }; }) {
    if (event.target.value === 'airline') {
      this.activeSegment = 'airline';
      this.swiper.swiperRef.slideTo(0);
    } else if (event.target.value === 'arrival_departure') {
      this.activeSegment = 'arrival_departure';
      this.swiper.swiperRef.slideTo(1);
    } else if (event.target.value === 'rooming') {
      this.activeSegment = 'rooming';
      this.rooming();
      this.swiper.swiperRef.slideTo(2);
    }
  }

  onSlideChange(event: { activeIndex: number; }[]) {
    if (event[0].activeIndex === 0) {
      this.activeSegment = 'airline';
      this.segment.value = 'airline';
    }
    if (event[0].activeIndex === 1) {
      this.activeSegment = 'arrival_departure';
      this.segment.value = 'arrival_departure';
    }
    if (event[0].activeIndex === 2) {
      this.activeSegment = 'rooming';
      this.segment.value = 'rooming';
    }
  }

  async presentAlert(msg: any) {
    this.globalServices.presentToast(msg);
  }


  async filterModal() {
    this.membersListFilter = await this.modalController.create({
      component: MembersListFilterComponent,
      backdropDismiss: true,
      mode: 'ios',
      id: 'membersListFilter',
      componentProps: {
        members_data: this.members_data,
        activeSegment: this.activeSegment,
        user: this.user
      }
    });
    await this.membersListFilter.present();

    await this.membersListFilter.onDidDismiss().then(res => {
      if (res.role === 'selected') {
        this.userFilter = res.data;
      }
    });
    return;
  }


  rooming() {

    var d = JSON.parse(localStorage.getItem('active_group'));
    const data = {
      group_id: d[0]["id"],
      city_id: this.user.itinerary[0]["locationID"],
      city_name: this.user.itinerary[0]["locationName"],
      nonce: nonce
    };

    this.memberService.apiGetRooming(data).subscribe((result: any) => {

      let totalDataRoomData = [];
      let dataStoreSecond = [];
      var newRoomary = []

      if (result.status == 'fail') {
        this.roomLength = 0;
      }

      Object?.entries(result["data"])?.forEach(
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

      localStorage.setItem("listOfRooming", JSON.stringify(this.totalDataRoom));
      this.getRoomCategory = roomCategory.filter((c: any, index: any) => {
        return roomCategory.indexOf(c) === index;
      });
      this.getHotelNames = hotelName.filter((c: any, index: any) => {
        return hotelName.indexOf(c) === index;
      });
      this.getRoomingData = result["data"];

    });

  }
}


