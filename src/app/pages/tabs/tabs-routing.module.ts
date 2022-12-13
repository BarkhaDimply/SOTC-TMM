import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'itinerary',
        loadChildren: () => import('../itinerary/itinerary.module').then(m => m.ItineraryPageModule)
      },
      {
        path: 'my-expenses',
        loadChildren: () => import('../my-expenses/my-expenses.module').then(m => m.MyExpensesPageModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('../chat/chat.module').then(m => m.ChatPageModule)
      },
      {
        path: 'members-list',
        loadChildren: () => import('../members-list/members-list.module').then(m => m.MembersListPageModule)
      },
      {
        path: 'add-expense',
        loadChildren: () => import('../my-expenses/transaction-modal/transaction-modal.module').then(m => m.TransactionModalPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/itinerary',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/itinerary',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
