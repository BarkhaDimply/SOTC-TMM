import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CartonDetailsPageRoutingModule } from './carton-details-routing.module';

import { CartonDetailsPage } from './carton-details.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CartonDetailsPageRoutingModule
  ],
  declarations: [CartonDetailsPage]
})
export class CartonDetailsPageModule {}
