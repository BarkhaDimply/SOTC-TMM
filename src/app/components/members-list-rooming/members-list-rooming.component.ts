import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-members-list-rooming',
  templateUrl: './members-list-rooming.component.html',
  styleUrls: ['./members-list-rooming.component.scss'],
})
export class MembersListRoomingComponent implements OnInit {

  @Input() totalDataRoom;
  constructor() { }

  ngOnInit() {}

}
