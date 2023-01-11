import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurrencyExchangePageRoutingModule } from './currency-exchange-routing.module';

import { CurrencyExchangePage } from './currency-exchange.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrencyExchangePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CurrencyExchangePage],
  providers:[DatePipe]
})
export class CurrencyExchangePageModule {}
