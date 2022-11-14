import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewTransactionDetailsPageRoutingModule } from './review-transaction-details-routing.module';

import { ReviewTransactionDetailsPage } from './review-transaction-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewTransactionDetailsPageRoutingModule
  ],
  declarations: [ReviewTransactionDetailsPage]
})
export class ReviewTransactionDetailsPageModule {}
