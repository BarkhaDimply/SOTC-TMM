import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersListRoomingFilterComponent } from './members-list-rooming-filter.component';



@NgModule({
  declarations: [MembersListRoomingFilterComponent],
  imports: [
    CommonModule
  ],
  exports:[MembersListRoomingFilterComponent]
})
export class MembersListRoomingFilterModule { }
