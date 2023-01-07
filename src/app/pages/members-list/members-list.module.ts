import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MembersListPage } from './members-list.page';
import { MembersListRoutingModule } from './members-list-routing.module';
import { SwiperModule } from 'swiper/angular';
import { MembersListDepatureModule } from 'src/app/components/members-list-depature/members-list-depature.module';
import { MembersListArrivalModule } from 'src/app/components/members-list-arrival/members-list-arrival.module';
import { MembersListRoomingModule } from 'src/app/components/members-list-rooming/members-list-rooming.module';
import { MembersListFilterComponent } from 'src/app/components/members-list-filter/members-list-filter.component';
import { MembersListRoomingFilterComponent } from 'src/app/components/members-list-rooming-filter/members-list-rooming-filter.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: MembersListPage }]),
    MembersListRoutingModule,
    SwiperModule,
    MembersListDepatureModule,
    MembersListArrivalModule,
    MembersListRoomingModule
  ],
  declarations: [
    MembersListPage,
    MembersListFilterComponent,
    MembersListRoomingFilterComponent
  ]
})
export class MembersListPageModule { }
