import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TmTransferPageRoutingModule } from './tm-transfer-routing.module';

import { TmTransferPage } from './tm-transfer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TmTransferPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TmTransferPage],
  providers:[DatePipe]
})
export class TmTransferPageModule {}
