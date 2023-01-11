import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatePipe, Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { currency } from 'src/app/services/utils';

@Component({
  selector: 'app-atm-withdrawal-cross-currency',
  templateUrl: './atm-withdrawal-cross-currency.page.html',
  styleUrls: ['./atm-withdrawal-cross-currency.page.scss'],
})
export class AtmWithdrawalCrossCurrencyPage implements OnInit {
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
  amtRecivedCrossCurrency = "";
  paidAmount;
  recivedAmount;
  amtPaidCrossCurrency;
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
    credit: [
      { type: 'required', message: 'Receiving Amount is required!' },
      { type: 'pattern', message: 'Enter valid amount!' },
    ],
    creditCurrency: [
      { type: 'required', message: 'Receiving current is required!' },
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
      credit: new FormControl(
        '', [Validators.required, Validators.pattern("^[0-9]*$")]
      ),
      creditCurrency: new FormControl(
        '', Validators.required
      ),
      description: new FormControl(
        '', Validators.required
      ),
      transaction_type: new FormControl('atm_cross_currency', null),
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
      this.setValueSomeDelay();
    };
  }

  setValueSomeDelay() {
    this.form.get("transaction_amount").setValue(this.info?.debit);
    this.form.get("currency").setValue(this.info?.debitCurrency);
    this.form.get("description").setValue(this.info?.description);
    this.form.get("date_of_transaction").setValue(this.info?.date);
    this.form.get("credit").setValue(this.info?.credit);
    this.form.get("creditCurrency").setValue(this.info?.creditCurrency);
    this.exchangeText = this.info?.row;;
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

  async takePhoto() {
    this.imgPath = '';
    this.globalService.takePhoto().then(result => {
      this.imgPath = result.imageUrl;
    });
  }

  selectCurrencyDropdown(name: any): void {
    this.selectedCurrency = name;
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
    request.roe = 1 + this.amtPaidCrossCurrency+' = ' + this.autoCalculateVlaue+ this.amtRecivedCrossCurrency;
    request.exchange_amount_receive = request.credit;
    request.exchange_currency = request.creditCurrency;

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
    this.paidAmount = this.form.get('transaction_amount').value;
    this.recivedAmount = this.form.get('credit').value;
    this.amtRecivedCrossCurrency = this.form.get('creditCurrency').value;
    this.amtPaidCrossCurrency = this.form.get('currency').value;

    if (this.paidAmount == "") {
      this.globalService.presentToast('Please input amount deducted');
      return;
    }
    if (this.recivedAmount == "") {
      this.globalService.presentToast('Please input amount paid');
      return;
    }
    if (this.amtRecivedCrossCurrency == "") {
      this.globalService.presentToast('Please select Received currency from dropdown');
      return
    }
    if (this.amtPaidCrossCurrency == "") {
      this.globalService.presentToast('Please select Outgoing currency from dropdown');
      return
    }
    if (this.amtRecivedCrossCurrency == this.amtPaidCrossCurrency) {
      this.globalService.presentToast('Please choose different currency');
      return false;
    }
    var paidAmount = parseFloat(this.paidAmount);
    var recivedAmount = parseFloat(this.recivedAmount);
    let autoCalVal = recivedAmount / paidAmount;
    this.autoCalculateVlaue = autoCalVal.toFixed(4);
  }

}