import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtmWithdrawalCrossCurrencyPageRoutingModule } from './atm-withdrawal-cross-currency-routing.module';

import { AtmWithdrawalCrossCurrencyPage } from './atm-withdrawal-cross-currency.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtmWithdrawalCrossCurrencyPageRoutingModule
  ],
  declarations: [AtmWithdrawalCrossCurrencyPage],
  providers:[DatePipe]
})
export class AtmWithdrawalCrossCurrencyPageModule {}
