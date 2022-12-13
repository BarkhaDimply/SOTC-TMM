import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-modal',
  templateUrl: './transaction-modal.page.html',
  styleUrls: ['./transaction-modal.page.scss'],
})
export class TransactionModalPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  route(key){


    if(key === 'record-transaction'){
      this.router.navigate(['/tabs/my-expenses/record-transaction']);
      console.log('hlo');
    }
    if(key ==='cross-currency-by-card'){
      this.router.navigate(['/tabs/my-expenses/cross-currency-by-card']);
    }
    if(key ==='atm-withdrawalsame-currency'){
      this.router.navigate(['/tabs/my-expenses/atm-withdrawalsame-currency']);
    }
    if(key ==='atm-withdrawal-cross-currency'){
      this.router.navigate(['/tabs/my-expenses/atm-withdrawal-cross-currency']);
    }
    if(key ==='currency-exchange'){
      this.router.navigate(['/tabs/my-expenses/currency-exchange']);
    }
    if(key ==='tm-transfer'){
      this.router.navigate(['/tabs/my-expenses/tm-transfer']);
    }
    if(key ==='misc-collection'){
      this.router.navigate(['/tabs/my-expenses/misc-collection']);
    }

  };
  back() {
    localStorage.removeItem('edit_clicked');
    return this.router.navigate(['/tabs/my-expenses']);
  }


}
