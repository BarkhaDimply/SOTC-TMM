import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiscCollectionPage } from './misc-collection.page';

const routes: Routes = [
  {
    path: '',
    component: MiscCollectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiscCollectionPageRoutingModule {}
