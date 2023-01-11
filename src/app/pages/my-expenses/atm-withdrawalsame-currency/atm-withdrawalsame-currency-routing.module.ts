import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtmWithdrawalsameCurrencyPage } from './atm-withdrawalsame-currency.page';

const routes: Routes = [
  {
    path: '',
    component: AtmWithdrawalsameCurrencyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtmWithdrawalsameCurrencyPageRoutingModule {}
