import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-expense-type-popup',
  templateUrl: './expense-type-popup.component.html',
  styleUrls: ['./expense-type-popup.component.scss'],
})
export class ExpenseTypePopupComponent implements OnInit {

  constructor(private modalController: ModalController, private router: Router) { }

  ngOnInit() { }


  public async closeModal(): Promise<void> {
    await this.modalController.dismiss(null, 'cancel');
  }

  route(key) {

    this.closeModal();
    if (key === 'record-transaction') {
      this.router.navigate(['/tabs/my-expenses/record-transaction']);
    }
    if (key === 'cross-currency-by-card') {
      this.router.navigate(['/tabs/my-expenses/cross-currency-by-card']);
    }
    if (key === 'atm-withdrawalsame-currency') {
      this.router.navigate(['/tabs/my-expenses/atm-withdrawalsame-currency']);
    }
    if (key === 'atm-withdrawal-cross-currency') {
      this.router.navigate(['/tabs/my-expenses/atm-withdrawal-cross-currency']);
    }
    // if (key === 'currency-exchange') {
    //   this.router.navigate(['/tabs/my-expenses/currency-exchange']);
    // }
    // if (key === 'tm-transfer') {
    //   this.router.navigate(['/tabs/my-expenses/tm-transfer']);
    // }
    // if (key === 'misc-collection') {
    //   this.router.navigate(['/tabs/my-expenses/misc-collection']);
    // }

  };
}
