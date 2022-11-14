import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodeScannerPageRoutingModule } from './code-scanner-routing.module';

import { CodeScannerPage } from './code-scanner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodeScannerPageRoutingModule
  ],
  declarations: [CodeScannerPage]
})
export class CodeScannerPageModule {}
