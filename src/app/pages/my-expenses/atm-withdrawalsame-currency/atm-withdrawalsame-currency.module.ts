import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtmWithdrawalsameCurrencyPageRoutingModule } from './atm-withdrawalsame-currency-routing.module';

import { AtmWithdrawalsameCurrencyPage } from './atm-withdrawalsame-currency.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtmWithdrawalsameCurrencyPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AtmWithdrawalsameCurrencyPage],
  providers:[DatePipe]
})
export class AtmWithdrawalsameCurrencyPageModule {}
