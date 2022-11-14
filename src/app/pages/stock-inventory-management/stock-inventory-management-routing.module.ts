import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockInventoryManagementPage } from './stock-inventory-management.page';

const routes: Routes = [
  {
    path: '',
    component: StockInventoryManagementPage
  },
  {
    path: 'carton-details',
    loadChildren: () => import('./carton-details/carton-details.module').then( m => m.CartonDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockInventoryManagementPageRoutingModule {}
