import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrossCurrencyByCardPageRoutingModule } from './cross-currency-by-card-routing.module';

import { CrossCurrencyByCardPage } from './cross-currency-by-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrossCurrencyByCardPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CrossCurrencyByCardPage],
  providers:[DatePipe]
})
export class CrossCurrencyByCardPageModule {}
