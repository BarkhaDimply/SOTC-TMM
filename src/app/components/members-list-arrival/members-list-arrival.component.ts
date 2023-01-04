import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-members-list-arrival',
  templateUrl: './members-list-arrival.component.html',
  styleUrls: ['./members-list-arrival.component.scss'],
})
export class MembersListArrivalComponent implements OnInit {

  @Input() members_data;
  constructor() { }

  ngOnInit() {}


  isFamilyMembers(parentId: any) {
   
    this.members_data.forEach(item => {  
      item['isFamily'] = false;
      if (parentId == item.parent_id) { 
        item.isFamily = true;
      } else {
        item.isFamily = false;
      }
    })
  }
}
