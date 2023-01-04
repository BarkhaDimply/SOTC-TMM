import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global/global.service';
import { MembersService } from 'src/app/services/members/members.service';

@Component({
  selector: 'app-members-list-filter',
  templateUrl: './members-list-filter.component.html',
  styleUrls: ['./members-list-filter.component.scss'],
})
export class MembersListFilterComponent implements OnInit {

  keyOfDateMemeberFilter: any = [];
  keyOfDateMemeberFilterArray: any = [];
  keyOfTimeMemeberFilter: any = [];
  getFlightCode: any = [];
  members_data;
  activeSegment;
  user;
  filterFlightCode;
  filterFlightDate;
  filterFlightTime;

  constructor(private modalController: ModalController,
    private globalService: GlobalService,
    private memberService: MembersService
  ) { }

  ngOnInit() {
    this.getFlightData();
  }



  public async closeModal(): Promise<void> {
    await this.modalController.dismiss(null, 'cancel');
  }


  getFlightData() {
    var getFlightCodeV: any = [];
    this.members_data.forEach((element) => {
      if (element.flight != '') {
        console.log("in:::");
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


  getFlightDataBySector(_filterFlightCode) {
    this.filterFlightCode = _filterFlightCode;
    this.keyOfDateMemeberFilter = [];
    this.keyOfTimeMemeberFilter = [];

    this.globalService.presentLoadingMemeber();
    let params: any = {}
    params.sector = _filterFlightCode;
    params.grpId = this.user.order_id;
    params.type = this.activeSegment;

    this.memberService.getFlightDataBySector(params).subscribe(async (result: any) => {
      if (result.status === true) {
        this.keyOfDateMemeberFilterArray = result.data;
        Object.entries(result.data).forEach(([DateKey]) => {
          this.keyOfDateMemeberFilter.push(DateKey)
        });
        this.globalService.dismissLoading();
      } else {
        this.globalService.presentToast(result.msg);
        return false;
      }
    });
  }


  getSelectedFlDate(selectedKey) {    
    this.filterFlightDate = selectedKey;
    for (const [key, value] of Object.entries(this.keyOfDateMemeberFilterArray)) {
      if(key == selectedKey){        
        Object.entries(value).forEach(([key,value]) => {
          this.keyOfTimeMemeberFilter.push(key) 
        });
      }
    }
  }

  getSelectedFlTime(val) {
    this.filterFlightTime = val;
    localStorage.setItem("Flight_time",this.filterFlightTime);
  }

  async filterElementsNew(){
    await this.modalController.dismiss({filterFlightCode: this.filterFlightCode, 
      filterFlightDate: this.filterFlightDate, 
      filterFlightTime: this.filterFlightTime}, 'selected');
  }
}
