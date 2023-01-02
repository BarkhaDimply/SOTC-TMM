import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItineraryCheckinoutComponent } from './itinerary-checkinout.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ItineraryCheckinoutComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [ItineraryCheckinoutComponent]
})
export class ItineraryCheckinoutModule { }
