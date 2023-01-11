import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TmTransferPage } from './tm-transfer.page';

const routes: Routes = [
  {
    path: '',
    component: TmTransferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TmTransferPageRoutingModule {}
