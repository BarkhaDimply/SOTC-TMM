import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiscCollectionPageRoutingModule } from './misc-collection-routing.module';

import { MiscCollectionPage } from './misc-collection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiscCollectionPageRoutingModule
  ],
  declarations: [MiscCollectionPage],
  providers:[DatePipe]
})
export class MiscCollectionPageModule {}
