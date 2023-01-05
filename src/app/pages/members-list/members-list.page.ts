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
  airline_members_data = [];
  arival_members_data = [];
  userFilter = {} as any;
  pageAirline: number;
  pageArrival: number;
  searchFilter = false;

  public searchTerm: string = "";
  constructor(private location: Location,
    private memberService: MembersService,
    private auth: AuthService,
    private globalServices: GlobalService,
    private modalController: ModalController,
  ) {
    this.selectedHub = localStorage.getItem('selected_hub') || '';
    this.user = this.auth.user;
    this.user.members_data.forEach((element: { hub: any; }) => {
      this.totalMembers++;
      if (element.hub === this.selectedHub) {
        element['isFamily'] = false;
      }
    });
    this.firstLoad();
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

  firstLoad(_airline = true, _arrival = true) {
    this.searchTerm = '';
    if (_airline === true) {
      this.pageAirline = 2;
      this.airline_members_data = this.staticPagination(this.user.members_data, 1);
    }
    if (_arrival === true) {
      this.pageArrival = 2;
      this.arival_members_data = this.staticPagination(this.user.members_data, 1);
    }
  }

  segmentChanged(event: { target: { value: string; }; }) {
    if (event.target.value === 'airline') {
      this.activeSegment = 'airline';
      this.swiper.swiperRef.slideTo(0);
      this.resetFilter();
    } else if (event.target.value === 'arrival_departure') {
      this.activeSegment = 'arrival_departure';
      this.swiper.swiperRef.slideTo(1);
      this.resetFilter();
    } else if (event.target.value === 'rooming') {
      this.activeSegment = 'rooming';
      this.rooming();
      this.swiper.swiperRef.slideTo(2);
      this.resetFilter();
    }
  }

  onSlideChange(event: { activeIndex: number; }[]) {
    if (event[0].activeIndex === 0) {
      this.activeSegment = 'airline';
      this.segment.value = 'airline';
      this.resetFilter();
    }
    if (event[0].activeIndex === 1) {
      this.activeSegment = 'arrival_departure';
      this.segment.value = 'arrival_departure';
      this.resetFilter();
    }
    if (event[0].activeIndex === 2) {
      this.activeSegment = 'rooming';
      this.segment.value = 'rooming';
      this.resetFilter();
    }
  }

  resetFilter() {
    this.firstLoad();
    if (this.activeSegment == 'rooming') {
      this.searchFilter = true;
    } else {
      this.searchFilter = false;
    }
  }

  async filterModal() {
    this.membersListFilter = await this.modalController.create({
      component: MembersListFilterComponent,
      backdropDismiss: true,
      mode: 'ios',
      id: 'membersListFilter',
      componentProps: {
        members_data: this.user.members_data,
        activeSegment: this.activeSegment,
        user: this.user
      }
    });
    await this.membersListFilter.present();

    await this.membersListFilter.onDidDismiss().then(res => {
      if (res.role === 'selected') {
        this.userFilter = res.data;
        if (this.activeSegment === 'airline') {
          this.airline_members_data = this.userFilter.selectedMembers.members;
        } else {
          this.arival_members_data = this.userFilter.selectedMembers.members;
        }
      }
    });
    return;
  }

  filterData() {
    this.user.members_data.forEach((element) => {
      var flDate = "";
      var flTime = "";
      if (element.flight != '') {
        element.flight.forEach(item => {
          if (this.activeSegment == 'arrival_departure') {
            flDate = new Date(item.arr_date).toDateString().split(' ').slice(1).join(' ');
            flTime = item.arr_time;
          } else {
            flDate = new Date(item.dep_date).toDateString().split(' ').slice(1).join(' ');
            flTime = item.dep_time;
          }
        });
      }
    });
  }


  loadPagination() {
    if (this.activeSegment == 'arrival_departure') {
      const arrivalData = this.staticPagination(this.user.members_data, this.pageArrival);
      arrivalData.forEach(element => {
        this.arival_members_data.push(element);
      });
      this.pageArrival++;
    } else {
      const airlineData = this.staticPagination(this.user.members_data, this.pageAirline);
      airlineData.forEach(element => {
        this.airline_members_data.push(element);
      });
      this.pageAirline++;
    }
  }

  staticPagination(data, page = 1) {
    let start = 0;
    let end = 20;
    let size = 20;
    if (page == 1) {
      start = 0;
      end = 20;
    } else {
      start = ((page - 1) * size) + 1;
      end = start + end - 1;
    }
    return data.slice(start, end);
  }

  loadMorePosts(event) {
    if (this.searchTerm === '') {
      this.loadPagination();
    }
    event.target.complete();
  }

  setFilteredItems(ev: any) {
    if (this.activeSegment == 'arrival_departure') {
      if (this.searchTerm == "") {
        this.firstLoad(false, true);
      } else {
        this.arival_members_data = this.user.members_data.filter(item => {
          return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        });
      }
    } else {
      if (this.searchTerm == "") {
        this.firstLoad(true, false);
      } else {
        this.airline_members_data = this.user.members_data.filter(item => {
          return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        });
      }
    }
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
      var newRoomary = [];
      Object?.entries(result["data"])?.forEach(
        ([key1, value]) => {
          var roomVal: any = value
          for (const [key, value] of Object.entries(roomVal.rooms)) {
            var newRoomValue: any = value;
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

      this.totalDataRoom = newRoomary;
      var roomCategory: any = [];
      var hotelName: any = [];
      this.totalDataRoom.forEach(item => {
        item.forEach(itemCat => {
          roomCategory.push(itemCat.room_cat)
          hotelName.push(itemCat.hotel_name)
        })
      });

      // this.getRoomCategory = roomCategory.filter((c: any, index: any) => {
      //   return roomCategory.indexOf(c) === index;
      // });
      // this.getHotelNames = hotelName.filter((c: any, index: any) => {
      //   return hotelName.indexOf(c) === index;
      // });
      // this.getRoomingData = result["data"];

    });

  }

}


