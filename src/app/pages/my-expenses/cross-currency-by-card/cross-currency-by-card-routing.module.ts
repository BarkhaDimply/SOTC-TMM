import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrossCurrencyByCardPage } from './cross-currency-by-card.page';

const routes: Routes = [
  {
    path: '',
    component: CrossCurrencyByCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrossCurrencyByCardPageRoutingModule {}
