import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockInventoryManagementPageRoutingModule } from './stock-inventory-management-routing.module';

import { StockInventoryManagementPage } from './stock-inventory-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockInventoryManagementPageRoutingModule
  ],
  declarations: [StockInventoryManagementPage]
})
export class StockInventoryManagementPageModule {}
