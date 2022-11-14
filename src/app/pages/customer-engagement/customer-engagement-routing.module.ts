import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerEngagementPage } from './customer-engagement.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerEngagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerEngagementPageRoutingModule {}
