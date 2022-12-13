import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtmWithdrawalsameCurrencyPageRoutingModule } from './atm-withdrawalsame-currency-routing.module';

import { AtmWithdrawalsameCurrencyPage } from './atm-withdrawalsame-currency.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtmWithdrawalsameCurrencyPageRoutingModule
  ],
  declarations: [AtmWithdrawalsameCurrencyPage],
  providers:[DatePipe]
})
export class AtmWithdrawalsameCurrencyPageModule {}
