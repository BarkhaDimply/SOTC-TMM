import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembersListPage } from './members-list.page';

const routes: Routes = [
  {
    path: '',
    component: MembersListPage,
  },  {
    path: 'members-list-filter',
    loadChildren: () => import('./members-list-filter/members-list-filter.module').then( m => m.MembersListFilterPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersListRoutingModule { }
