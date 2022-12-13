import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TmTransferPageRoutingModule } from './tm-transfer-routing.module';

import { TmTransferPage } from './tm-transfer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TmTransferPageRoutingModule
  ],
  declarations: [TmTransferPage],
  providers:[DatePipe]
})
export class TmTransferPageModule {}
