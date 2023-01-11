import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AtmWithdrawalCrossCurrencyPage } from './atm-withdrawal-cross-currency.page';

const routes: Routes = [
  {
    path: '',
    component: AtmWithdrawalCrossCurrencyPage
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtmWithdrawalCrossCurrencyPageRoutingModule {}
