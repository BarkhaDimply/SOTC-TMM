import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { AuthService } from 'src/app/services/auth/auth.service';

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
  request = {} as any;
  user: any;
  handoverType = 'Cash';
  info: any;
  validationMessages = {
    transaction_amount: [
      { type: 'required', message: 'Amount is required!' },
      { type: 'pattern', message: 'Enter valid amount!' },
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
    private auth: AuthService,
    private location: Location, private datePipe: DatePipe,
    private alertCtrl: AlertController, private router: Router,
    private globalService: GlobalService, private alertController: AlertController,
    private actRoute: ActivatedRoute) {
    this.user = this.auth.user;

    this.initializeForm();
  }

  initializeForm() {
    const driver_id = localStorage.getItem("manager_id");
    const driver_name = localStorage.getItem("manager_name");

    this.form = new FormGroup({
      transaction_amount: new FormControl(
        '', [Validators.required, Validators.pattern("^[0-9]*$")]
      ),
      currency: new FormControl(
        '', Validators.required
      ),
      transaction_from: new FormControl(
        this.handoverType, Validators.required
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
      transaction_type: new FormControl('Debit', null),
      group_id: new FormControl(this.user.order_id, null),
      driver_id: new FormControl(driver_id, null),
      driver_name: new FormControl(driver_name, null),
      date_of_transaction: new FormControl(
        '', Validators.required
      ),
    });
  }

  ngOnInit() {
    this.request.group_id = this.user.order_id;
    this.request.driver_id = localStorage.getItem("manager_id");

    let dateVar = new Date();
    this.todayDateTime = this.datePipe.transform(dateVar, 'YYYY-MM-dd');
    this.loadCategories();
    this.loadExpenses();
    this.setEditData();
  }

  setEditData() {
    if (this.router.getCurrentNavigation().extras.state) {
      this.info = this.router.getCurrentNavigation().extras.state.details;
      this.mode === 'edit';
      console.log(this.info);
    };
  }

  setValueSomeDelay() {
    this.selectedCategory(this.info?.category);
    this.form.get("transaction_amount").setValue(this.info?.debit);
    this.form.get("currency").setValue(this.info?.debitCurrency);
    this.form.get("category_id").setValue(this.info?.category);
    this.form.get("sub_category").setValue(this.info?.sub_category);
    this.form.get("description").setValue(this.info?.description);
    this.form.get("date_of_transaction").setValue(this.info?.date);
  }

  loadExpenses() {
    this.expenseService.getCurrentBalance(this.request).subscribe((result: any) => {
      if (result.data.length > 0) {
        for (let i = 0; i < result.data.length; i++) {
          this.showCurrency.push(result.data[i].currency_name);
        }
      }
    });
  }

  loadCategories() {
    this.expenseService.getCategoriesFromServer().subscribe((result: any) => {
      this.categories = result.categories;
      this.setValueSomeDelay();
    });
  }

  async takePhoto() {
    this.imgPath = '';
    this.globalService.takePhoto().then(result => {
      this.imgPath = result.imageUrl;
    });
  }

  selectCurrencyDropdown(name: any): void {
    this.selectedCurrency = name;
  }

  selectedCategory(value): void {
    this.categories.forEach(element => {
      if (value == element.id) {
        if (element.sub_category.length > 0) {
          this.subcategories = element.sub_category;
        }
      }
    });
  }

  submitPost() {
    console.log(this.form.value);
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    let request: any = this.form.value;
    if (this.mode === 'create') {
      request.token = "";
      request.mode = "create";
      request.image = this.imgPath;
      request.image_type = true;
    } else {
      if (this.imgPath != '') {
        request.image = this.imgPath
        request.image_type = true;
      } else {
        request.image = this.info?.debit_image;
        request.image_type = false;
      }
      request.token = this.info?.token;
      request.mode = "edit";
    }

    this.expenseService.postCurrencyExchange(request).subscribe(async (result: any) => {
      if (result.status == 'true') {
        this.globalService.presentToast('Transaction Successful');
        this.router.navigate(['/tabs/my-expenses']);
      } else {
        this.globalService.presentToast(result.message);
      }
    });
  }

  removeImage() {
    this.imgPath = "";
  }
}




