import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-expenses-all',
  templateUrl: './expenses-all.component.html',
  styleUrls: ['./expenses-all.component.scss'],
})
export class ExpensesAllComponent implements OnInit {
  @Input() history;
  @Output() transactionEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {}

  editTransaction(details){
    this.transactionEvent.emit(details);
  }
}
