import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerEngagementPageRoutingModule } from './customer-engagement-routing.module';

import { CustomerEngagementPage } from './customer-engagement.page';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerEngagementPageRoutingModule,
    SwiperModule
  ],
  declarations: [CustomerEngagementPage],providers:[DatePipe]
})
export class CustomerEngagementPageModule {}
