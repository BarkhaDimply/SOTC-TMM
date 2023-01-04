import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MembersListArrivalComponent } from './members-list-arrival.component';



@NgModule({
  declarations: [MembersListArrivalComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [MembersListArrivalComponent]
})
export class MembersListArrivalModule { }
