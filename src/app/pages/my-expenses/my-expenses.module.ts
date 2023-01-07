import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyExpensesPage } from './my-expenses.page';
import { MyExpensesPageRoutingModule } from './my-expenses-routing.module';
import { SwiperModule } from 'swiper/angular';
import { ExpenseCardModule } from 'src/app/components/expense-card/expense-card.module';
import { ExpensesAllModule } from 'src/app/components/expenses-all/expenses-all.module';
import { ExpensesRejectModule } from 'src/app/components/expenses-reject/expenses-reject.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MyExpensesPageRoutingModule,
    SwiperModule,
    ExpenseCardModule,
    ExpensesAllModule,
    ExpensesRejectModule
  ],
  declarations: [
    MyExpensesPage
  ],
  providers:[DatePipe]
})
export class MyExpensesPageModule { }
