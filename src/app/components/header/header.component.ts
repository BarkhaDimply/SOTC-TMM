import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  agency_logo: string;

  constructor(
    private globalService: GlobalService
  ) {
   }

  ngOnInit() {
    this.globalService.getCheckActiveManager();
    this.agency_logo = localStorage.getItem('agency_logo');

    this.globalService.appLogoEvent.subscribe(val => {
      if(val !== null){
        this.agency_logo = val;
      }
    });
  }

}
