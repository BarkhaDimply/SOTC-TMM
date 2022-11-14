import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReviewFeedbackPage } from './review-feedback.page';

const routes: Routes = [
  {
    path: '',
    component: ReviewFeedbackPage
  },
  {
    path: 'review-transaction-details',
    loadChildren: () => import('./review-transaction-details/review-transaction-details.module').then( m => m.ReviewTransactionDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewFeedbackPageRoutingModule {}
