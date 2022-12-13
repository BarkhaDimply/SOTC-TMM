import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewFeedbackPageRoutingModule } from './review-feedback-routing.module';

import { ReviewFeedbackPage } from './review-feedback.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewFeedbackPageRoutingModule
  ],
  declarations: [ReviewFeedbackPage]
})
export class ReviewFeedbackPageModule {}
