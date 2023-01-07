import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expense-card',
  templateUrl: './expense-card.component.html',
  styleUrls: ['./expense-card.component.scss'],
})
export class ExpenseCardComponent implements OnInit {
  @Input() showBalance;
  VisibleSect;

  constructor() { }

  ngOnInit() { }


  visibleSec() {
    this.VisibleSect = !this.VisibleSect;
  }
}
