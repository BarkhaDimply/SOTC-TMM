import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expenses-all',
  templateUrl: './expenses-all.component.html',
  styleUrls: ['./expenses-all.component.scss'],
})
export class ExpensesAllComponent implements OnInit {
  @Input() history;
  constructor() { }

  ngOnInit() {}

}
