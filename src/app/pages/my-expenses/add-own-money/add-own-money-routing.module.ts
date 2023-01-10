import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddOwnMoneyPage } from './add-own-money.page';

const routes: Routes = [
  {
    path: '',
    component: AddOwnMoneyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOwnMoneyPageRoutingModule {}
