import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global/global.service';
import { DatePipe, Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { currency } from 'src/app/services/utils';
@Component({
  selector: 'app-cross-currency-by-card',
  templateUrl: './cross-currency-by-card.page.html',
  styleUrls: ['./cross-currency-by-card.page.scss'],
})
export class CrossCurrencyByCardPage implements OnInit {
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
  handoverType = 'Card';
  info: any;

  showrecivedCashCurrency = [];
  amtRecived_selected_currency = "";
  outgoingAmt;
  amtRecived_vendor;
  outgoing_selected_currency;
  autoCalculateVlaue;

  exchangeText = "";

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
      { type: 'required', message: 'Date is required!' },
    ]
  };

  constructor(
    private expenseService: ExpensesService,
    private auth: AuthService,
    private location: Location,
    private datePipe: DatePipe,
    private router: Router,
    private globalService: GlobalService) {
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
      transaction_type: new FormControl('cross_currency_by_card', null),
      group_id: new FormControl(this.user.order_id, null),
      driver_id: new FormControl(driver_id, null),
      driver_name: new FormControl(driver_name, null),
      date_of_transaction: new FormControl(
        '', Validators.required
      ),
      exchange_amount_receive: new FormControl('', null),
      exchange_currency: new FormControl('', null),
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

    for (const [key] of Object.entries(currency)) {
      this.showrecivedCashCurrency.push(key);
    }
  }

  setEditData() {
    if (this.router.getCurrentNavigation().extras.state) {
      this.info = this.router.getCurrentNavigation().extras.state.details;
      this.mode = 'edit';
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
    this.exchangeText = this.info?.row;
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
        request.image = this.imgPath;
        request.image_type = true;
      } else {
        request.image = this.info?.debit_image;
        request.image_type = false;
      }
      request.token = this.info?.token;
      request.mode = "edit";
    }

    request.exchange_amount_receive = this.amtRecived_vendor;
    request.exchange_currency = this.amtRecived_selected_currency;
    request.roe = 1 + this.outgoing_selected_currency + ' = ' + this.autoCalculateVlaue + this.amtRecived_selected_currency;

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

  back() {
    this.location.back();
  }

  async autoCalculateCurrency() {
    this.outgoingAmt = this.form.get('transaction_amount').value;
    this.amtRecived_vendor = this.form.get('exchange_amount_receive').value;
    this.amtRecived_selected_currency = this.form.get('exchange_currency').value;
    this.outgoing_selected_currency = this.form.get('currency').value;

    if (this.outgoingAmt == "") {
      this.globalService.presentToast('Please input amount deducted');
      return;
    }
    if (this.amtRecived_vendor == "") {
      this.globalService.presentToast('Please input amount paid');
      return;
    }
    if (this.amtRecived_selected_currency == "") {
      this.globalService.presentToast('Please select Received currency from dropdown');
      return
    }
    if (this.outgoing_selected_currency == "") {
      this.globalService.presentToast('Please select Outgoing currency from dropdown');
      return
    }
    var paidAmount = parseFloat(this.outgoingAmt);
    var recivedAmount = parseFloat(this.amtRecived_vendor);
    let autoCalVal = recivedAmount / paidAmount;
    this.autoCalculateVlaue = autoCalVal.toFixed(4);
  }

}