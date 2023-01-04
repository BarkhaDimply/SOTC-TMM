import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { identity } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { nonce } from 'src/app/services/utils';

@Component({
  selector: 'app-itinerary',
  templateUrl: 'itinerary.page.html',
  styleUrls: ['itinerary.page.scss']
})
export class ItineraryPage implements OnInit {
  user: UserModel;
  showData: any;
  user_data: any;
  agency_logo: string;
  itineraries = [] as any;

  constructor(private auth: AuthService, private alertController: AlertController, private globalService: GlobalService) {

  }
  ngOnInit(): void {
    this.user = this.auth.user;
    this.globalService.checkPermission();
    this.firstLoad();
    this.auth.getUserStatus.subscribe(val => {
      if (val !== null) {
        this.user = this.auth.user;
        this.firstLoad();
      }
    });
  }

  firstLoad() {
    this.itineraries = this.user.itinerary;
  }

  getByDayswise(itinerary) {
    let iti_data = [];
    let key = 0;
    Object.entries(itinerary).forEach(([key1, value]) => {
      var roomVal: any = value
      if (value && typeof value == 'object') {
        iti_data.push({ key, date: key1, dayplan: value });
        key++;
      }
    });
    return iti_data;
  }

  getLocationsLen(itinerary, date) {
    return itinerary[date.replaceAll("-", "/")]?.length;
  }

  refreshPage() {
    this.globalService.presentLoading();
    const active_group = JSON.parse(localStorage.getItem('active_group'));
    let request = {
      'login_code': active_group[0]['tourCode'],
      'nonce': nonce
    };
    this.auth.login(request).subscribe(async (result: any) => {
      this.globalService.dismissLoading();
      if (result?.status === true) {
        localStorage.setItem('user', JSON.stringify(result.data));
        this.user = result.data;
        this.firstLoad();
      } else {
        this.globalService.presentToast(result.error);
      }
    });

  }

}
