import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItineraryPage } from './itinerary.page';
import { ItineraryPageRoutingModule } from './itinerary-routing.module';
import { ItineraryCheckinoutModule } from 'src/app/components/itinerary-checkinout/itinerary-checkinout.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ItineraryPageRoutingModule,
    ItineraryCheckinoutModule
  ],
  declarations: [ItineraryPage]
})
export class ItineraryPageModule { }
