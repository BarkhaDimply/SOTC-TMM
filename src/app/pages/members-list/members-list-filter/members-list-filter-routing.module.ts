import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MembersListFilterPage } from './members-list-filter.page';

const routes: Routes = [
  {
    path: '',
    component: MembersListFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembersListFilterPageRoutingModule {}
