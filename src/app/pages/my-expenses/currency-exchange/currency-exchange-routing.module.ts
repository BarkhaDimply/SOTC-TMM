import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CurrencyExchangePage } from './currency-exchange.page';

const routes: Routes = [
  {
    path: '',
    component: CurrencyExchangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrencyExchangePageRoutingModule {}
