import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItineraryPage } from './itinerary.page';
import { ItineraryPageRoutingModule } from './itinerary-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ItineraryPageRoutingModule,
  ],
  declarations: [ItineraryPage]
})
export class ItineraryPageModule { }
