import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MyExpensesPage } from './my-expenses.page';


const routes: Routes = [
  {
    path: '',
    component: MyExpensesPage,
  },
  {
    path: 'record-transaction',
    loadChildren: () => import('./record-transaction/record-transaction.module').then(m => m.RecordTransactionPageModule)
  },
  {
    path: 'atm-withdrawalsame-currency',
    loadChildren: () => import('./atm-withdrawalsame-currency/atm-withdrawalsame-currency.module').then(m => m.AtmWithdrawalsameCurrencyPageModule)
  },
  {
    path: 'cross-currency-by-card',
    loadChildren: () => import('./cross-currency-by-card/cross-currency-by-card.module').then(m => m.CrossCurrencyByCardPageModule)
  },
  {
    path: 'atm-withdrawal-cross-currency',
    loadChildren: () => import('./atm-withdrawal-cross-currency/atm-withdrawal-cross-currency.module').then(m => m.AtmWithdrawalCrossCurrencyPageModule)
  },
  {
    path: 'currency-exchange',
    loadChildren: () => import('./currency-exchange/currency-exchange.module').then(m => m.CurrencyExchangePageModule)
  },
  // {
  //   path: 'misc-collection',
  //   loadChildren: () => import('./misc-collection/misc-collection.module').then( m => m.MiscCollectionPageModule)
  // },
  // {
  //   path: 'tm-transfer',
  //   loadChildren: () => import('./tm-transfer/tm-transfer.module').then( m => m.TmTransferPageModule)
  // },
  // {
  //   path: 'transaction-history',
  //   loadChildren: () => import('./transaction-history/transaction-history.module').then( m => m.TransactionHistoryPageModule)
  // },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyExpensesPageRoutingModule { }
