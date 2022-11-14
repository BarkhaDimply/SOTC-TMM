import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodeScannerPage } from './code-scanner.page';

const routes: Routes = [
  {
    path: '',
    component: CodeScannerPage
  },
  {
    path: 'attendance-list',
    loadChildren: () => import('./attendance-list/attendance-list.module').then( m => m.AttendanceListPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodeScannerPageRoutingModule {}
