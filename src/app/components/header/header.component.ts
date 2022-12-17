import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  agency_logo: string;

  constructor() { }

  ngOnInit() {

    this.agency_logo = localStorage.getItem('agency_logo');
  }

}
