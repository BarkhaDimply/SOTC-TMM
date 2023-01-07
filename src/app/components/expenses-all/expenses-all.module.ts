import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesAllComponent } from './expenses-all.component';

@NgModule({
  declarations: [ExpensesAllComponent],
  imports: [
    CommonModule
  ],
  exports: [ExpensesAllComponent]
})
export class ExpensesAllModule { }
