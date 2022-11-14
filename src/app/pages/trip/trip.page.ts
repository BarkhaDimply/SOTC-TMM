import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.page.html',
  styleUrls: ['./trip.page.scss'],
})
export class TripPage implements OnInit {
  myTrip: any;


  constructor(
    private globalService: GlobalService,
    private apiServices:ApiService
  ) { }

  ngOnInit() {
    this.getMyTrip();
  }

  getMyTrip(){
   
  
    //this.globalService.presentLoading();
    this.apiServices.getMyTrip().subscribe((result:any) => {
    //this.globalService.dismissLoading();
     
    this.myTrip = result.data;
    console.log("trip::::",result);
     
     
    });
   
  }

}
