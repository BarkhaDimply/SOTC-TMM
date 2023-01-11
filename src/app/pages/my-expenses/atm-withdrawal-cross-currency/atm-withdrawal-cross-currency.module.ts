import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtmWithdrawalCrossCurrencyPageRoutingModule } from './atm-withdrawal-cross-currency-routing.module';

import { AtmWithdrawalCrossCurrencyPage } from './atm-withdrawal-cross-currency.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtmWithdrawalCrossCurrencyPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AtmWithdrawalCrossCurrencyPage],
  providers:[DatePipe]
})
export class AtmWithdrawalCrossCurrencyPageModule {}
