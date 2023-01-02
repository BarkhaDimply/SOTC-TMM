import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItineraryPage } from './itinerary.page';

const routes: Routes = [
  {
    path: '',
    component: ItineraryPage,
  },
  {
    path: 'code-scanner',
    loadChildren: () => import('./code-scanner/code-scanner.module').then( m => m.CodeScannerPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItineraryPageRoutingModule {}
