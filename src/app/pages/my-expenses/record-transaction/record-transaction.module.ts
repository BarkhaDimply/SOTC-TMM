import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordTransactionPageRoutingModule } from './record-transaction-routing.module';

import { RecordTransactionPage } from './record-transaction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RecordTransactionPageRoutingModule
  
  ],
  declarations: [RecordTransactionPage],
  providers:[DatePipe]
})
export class RecordTransactionPageModule {}
