import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyExpensesPage } from './my-expenses.page';
import { MyExpensesPageRoutingModule } from './my-expenses-routing.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { SwiperModule } from 'swiper/angular';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MyExpensesPageRoutingModule,
    HeaderModule,
    SwiperModule

  ],
  declarations: [MyExpensesPage],providers:[DatePipe]
})
export class MyExpensesPageModule { }
