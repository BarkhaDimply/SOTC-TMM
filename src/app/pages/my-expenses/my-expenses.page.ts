import { Component, ComponentRef, NgZone, OnInit, ResolvedReflectiveFactory, ViewChild } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertController, IonSegment, NavController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global/global.service';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
import { element } from 'protractor';
import { SwiperModule } from 'swiper/angular';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper';
import { count } from 'console';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);


@Component({
  selector: 'app-my-expenses',
  templateUrl: 'my-expenses.page.html',
  styleUrls: ['my-expenses.page.scss']
})
export class MyExpensesPage implements OnInit {

  getCurrBalance: any;
  user: UserModel;

  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('expensesSwiper') expensesSwiper: SwiperComponent;

  @ViewChild('segment') segment: IonSegment;
  activeSegment: any;
  config: SwiperOptions = {
    pagination: true,
    height: 400
  };

  expensesConfig: SwiperOptions = {
    pagination: true,
    height: 200
  };

  manager_name: string;
  balanceData = [];
  transctionHistory = [];
  rejectedTransctionHistory = [];
  request: any = {};

  constructor(
    private auth: AuthService,
    private expenseService: ExpensesService,
  ) {
    this.user = this.auth.user;
    this.manager_name = localStorage.getItem("manager_name") || '';
  }

  ngOnInit() {
    this.request.group_id = this.user.order_id;
    this.request.driver_id = localStorage.getItem("manager_id");

    this.loadBalance();
    this.getTransactions();
    this.getRejectedTransactions();
  }

  loadBalance() {
    this.expenseService.getCurrentBalance(this.request).subscribe((result: any) => {
      if (result.data.length > 0) {
        for (let i = 0; i < result.data.length; i++) {
          result.data[i].isChecked = false;
          result.data[i].isCashAmount = false;
        }
      }
      this.balanceData = result.data;
      //localStorage.setItem("expensesData", JSON.stringify(result.data));
    });

  }

  segmentChanged(event) {
    this.activeSegment = event.target.value;
    if (this.activeSegment === 'allTrans') {
      this.swiper.swiperRef.slideTo(0);
    }
    if (this.activeSegment === 'rejected_trans') {
      this.swiper.swiperRef.slideTo(1);
    }
  }

  onSlideChange(event) {
    if (event[0].activeIndex === 0) {
      this.activeSegment = 'allTrans';
      this.segment.value = 'allTrans';
    }
    if (event[0].activeIndex === 1) {
      this.activeSegment = 'rejected_trans';
      this.segment.value = 'rejected_trans';
    }
  }

  getTransactions() {
    this.expenseService.getAllTransctionHistoryByTime(this.request).subscribe((result: any) => {
      this.transctionHistory = [];
      Object.entries(result.data).forEach(
        ([key, value]) => {
          this.transctionHistory.push({ transKey: key, transValue: value });

        });
      this.transctionHistory.forEach(itms => {
        itms.transValue.forEach(itm => {
          // this.btnSubstatus = itm.submission_status;
          // this.btnShowTrans = itm.show_transaction;
        });
      });
      if (result.data.length > 0) {
        this.sortByDate();
      }
    });
  }


  getRejectedTransactions() {
    this.expenseService.getRejectedTransctionHistoryByTime(this.request).subscribe((result: any) => {
      this.rejectedTransctionHistory = [];
      Object.entries(result.data).forEach(
        ([key, value]) => {
          this.rejectedTransctionHistory.push({ transKey: key, transValue: value })
        });

      // plus button hide function
      this.transctionHistory.forEach(itms => {
        itms.transValue.forEach(itm => {
          // this.btnSubstatus = itm.submission_status;
          // this.btnShowTrans = itm.show_transaction;
        });
      });
    });
  }

  sortByDate() {
    this.transctionHistory = this.transctionHistory.sort(function (a, b) {
      var c: any = new Date(a.time_of_transaction);
      var d: any = new Date(b.time_of_transaction);
      return d - c;
    });
  }

  checkHistryDetail(historyDetails) {
    return ((historyDetails.submission_status == 0 || historyDetails.submission_status == 3) && historyDetails.show_transaction == 0) && historyDetails.category != 'BALANCE ADDED'
      && historyDetails.category != 'misc_collection' && historyDetails.category != 'tm_transfer';
  }
}

