import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MembersListFilterPageRoutingModule } from './members-list-filter-routing.module';

import { MembersListFilterPage } from './members-list-filter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MembersListFilterPageRoutingModule
  ],
  declarations: [MembersListFilterPage]
})
export class MembersListFilterPageModule {}
