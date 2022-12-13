import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationPage } from './notification.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationPage
  },
  {
    path: 'review-feedback',
    loadChildren: () => import('./review-feedback/review-feedback.module').then( m => m.ReviewFeedbackPageModule)
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationPageRoutingModule {}
