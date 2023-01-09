import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';

@Component({
  selector: 'app-record-transaction',
  templateUrl: './record-transaction.page.html',
  styleUrls: ['./record-transaction.page.scss'],
})

export class RecordTransactionPage implements OnInit {
  selectedCurrency: string = "";
  form: FormGroup;
  imgPath;
  showCurrency: any = [];
  categories: any = [];
  subcategories: any = [];
  debit_transaction_by = 1;
  todayDateTime: any;
  mode: string = 'create';

  validationMessages = {
    transaction_amount: [
      { type: 'required', message: 'Amount is required!' },
    ],
    currency: [
      { type: 'required', message: 'Currency is required!' },
    ],
    transaction_from: [
      { type: 'required', message: 'Type is required!' },
    ],
    category_id: [
      { type: 'required', message: 'Category is required!' },
    ],
    sub_category: [
      { type: 'required', message: 'Subcategory is required!' },
    ],
    description: [
      { type: 'required', message: 'Description is required!' },
    ],
    date_of_transaction: [
      { type: 'required', message: 'Description is required!' },
    ]
  };

  constructor(
    private expenseService: ExpensesService,
    private location: Location, private datePipe: DatePipe,
    private alertCtrl: AlertController, private router: Router,
    private globalService: GlobalService, private alertController: AlertController,
    private actRoute: ActivatedRoute) {
    this.form = new FormGroup({
      transaction_amount: new FormControl(
        '', Validators.required
      ),
      currency: new FormControl(
        '', Validators.required
      ),
      transaction_from: new FormControl(
        '', Validators.required
      ),
      category_id: new FormControl(
        '', Validators.required
      ),
      sub_category: new FormControl(
        '', Validators.required
      ),
      description: new FormControl(
        '', Validators.required
      ),
      transaction_type: new FormControl('', null),
      group_id: new FormControl('', null),
      driver_id: new FormControl('', null),
      driver_name: new FormControl('', null),
      date_of_transaction: new FormControl(
        '', Validators.required
      ),
    });
  }

  ngOnInit() {
    let dateVar = new Date();
    this.todayDateTime = this.datePipe.transform(dateVar, 'YYYY-MM-dd');
    this.loadCategories();
  }

  loadCategories() {
    this.expenseService.getCategoriesFromServer().subscribe((result: any) => {
      this.categories = result.categories;
    });
  }

  async takePhoto() {
    this.imgPath = '';
    this.globalService.takePhoto().then(result => {
      this.imgPath = result.imageUrl;
      console.log(this.imgPath);
    });
  }

  selectCurrencyDropdown(name: any): void {
    this.selectedCurrency = name;
  }

  selectedCategory(event): void {
    this.categories.forEach(element => {
      if (event.target.value == element.id) {
        if (element.sub_category.length > 0) {
          this.subcategories = element.sub_category;
        }
      }
    });
  }

  selectedSubcatgory(event): void {

  }

  submitPost() {
    console.log(this.form.value);
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

  }


  removeImage() {
    this.imgPath = "";
  }
}




