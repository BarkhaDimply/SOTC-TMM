import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersListRoomingComponent } from './members-list-rooming.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MembersListRoomingComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports:[MembersListRoomingComponent]
})
export class MembersListRoomingModule { }
