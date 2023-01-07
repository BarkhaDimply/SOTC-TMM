import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseCardComponent } from './expense-card.component';



@NgModule({
  declarations: [ExpenseCardComponent],
  imports: [
    CommonModule
  ],
  exports: [ExpenseCardComponent]
})
export class ExpenseCardModule { }
