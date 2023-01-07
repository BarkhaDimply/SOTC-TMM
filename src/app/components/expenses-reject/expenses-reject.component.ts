import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expenses-reject',
  templateUrl: './expenses-reject.component.html',
  styleUrls: ['./expenses-reject.component.scss'],
})
export class ExpensesRejectComponent implements OnInit {
  @Input() history;
  constructor() { }

  ngOnInit() {}

}
