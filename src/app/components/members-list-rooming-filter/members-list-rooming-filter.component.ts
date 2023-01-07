import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MembersService } from 'src/app/services/members/members.service';
import { nonce } from 'src/app/services/utils';

@Component({
  selector: 'app-members-list-rooming-filter',
  templateUrl: './members-list-rooming-filter.component.html',
  styleUrls: ['./members-list-rooming-filter.component.scss'],
})
export class MembersListRoomingFilterComponent implements OnInit {

  itinerary: any;
  activeSegment: any;
  user: any;
  getHotelNameFilter = [];
  showLocationDiv = false;
  getHoltelLocation;
  getHoltelLocationID;
  getHotelNameFilterNEW = [];
  getRoomCat;
  totalDataRoom;
  showsharingDiv = false;
  getHoltelName;
  getselectedRoomCategory;
  returnRoomsData = [];
  getRoomingDataNew = [];

  constructor(
    private memberService: MembersService,
    private modalController: ModalController) { }

  ngOnInit() {  
  }

  public async closeModal(): Promise<void> {
    await this.modalController.dismiss(null, 'cancel');
  }

  getHotelLocationName(locationName: any, locationID: any) {

    this.getHotelNameFilter = [];
    this.showLocationDiv = true;
    this.getHoltelLocation = locationName;
    this.getHoltelLocationID = locationID;

    var d = JSON.parse(localStorage.getItem('active_group'));
    const data = {
      group_id: d[0]["id"],
      city_id: this.getHoltelLocationID,
      city_name: this.getHoltelLocation,
      nonce: nonce
    };

    this.memberService.apiGetRooming(data).subscribe((result: any) => {
      this.getRoomingDataNew = result["data"];

      Object.entries(result["data"]).forEach(
        ([key1, value]) => {
          this.getHotelNameFilter.push(key1);
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
          this.totalDataRoom.forEach(item => {
            item.forEach(itemCat => {
              roomCategory.push(itemCat.room_cat)
            })
          });
          this.getRoomCat = roomCategory.filter((c: any, index: any) => {
            return roomCategory.indexOf(c) === index;
          });
        }
      });
  }

  async getRoomCategoryName(ev: any) {
    this.getselectedRoomCategory = ev.target.textContent;
    this.returnRoomsData = [];

    Object.entries(this.getRoomingDataNew).forEach(
      ([key1, value]) => {
        if(this.getHoltelName.trim() == key1.trim()){  
          var roomValD: any = value;
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
                el.paxDetails = paxDetails;
                this.returnRoomsData.push(Array(el));
              }
            }); 
          }
        }
      });
     await this.modalController.dismiss({ roomsData: this.returnRoomsData }, 'selected');
  }
}
