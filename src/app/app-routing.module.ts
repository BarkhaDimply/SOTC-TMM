import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'customer-engagement',
    loadChildren: () => import('./pages/customer-engagement/customer-engagement.module').then( m => m.CustomerEngagementPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'stock-inventory-management',
    loadChildren: () => import('./pages/stock-inventory-management/stock-inventory-management.module').then( m => m.StockInventoryManagementPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./pages/notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'trip',
    loadChildren: () => import('./pages/trip/trip.module').then( m => m.TripPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'my-expenses',
    loadChildren: () => import('./pages/my-expenses/my-expenses.module').then( m => m.MyExpensesPageModule)
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
