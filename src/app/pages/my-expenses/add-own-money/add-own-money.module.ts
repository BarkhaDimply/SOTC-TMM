import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddOwnMoneyPageRoutingModule } from './add-own-money-routing.module';

import { AddOwnMoneyPage } from './add-own-money.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddOwnMoneyPageRoutingModule
  ],
  declarations: [AddOwnMoneyPage]
})
export class AddOwnMoneyPageModule {}
