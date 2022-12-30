import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MembersListPage } from './members-list.page';
import { MembersListRoutingModule } from './members-list-routing.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: MembersListPage }]),
    MembersListRoutingModule,
    SwiperModule
  ],
  declarations: [MembersListPage]
})
export class MembersListPageModule { }
