import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartonDetailsPage } from './carton-details.page';


const routes: Routes = [
  {
    path: '',
    component: CartonDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartonDetailsPageRoutingModule {}
