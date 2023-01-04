import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-members-list-depature',
  templateUrl: './members-list-depature.component.html',
  styleUrls: ['./members-list-depature.component.scss'],
})
export class MembersListDepatureComponent implements OnInit {

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
