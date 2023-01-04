import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersListDepatureComponent } from './members-list-depature.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MembersListDepatureComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [MembersListDepatureComponent]
})
export class MembersListDepatureModule { }
