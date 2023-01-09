import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembersListPage } from './members-list.page';

const routes: Routes = [
  {
    path: '',
    component: MembersListPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersListRoutingModule { }
