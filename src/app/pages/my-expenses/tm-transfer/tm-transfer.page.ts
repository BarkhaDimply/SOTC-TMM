import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExpensesService } from 'src/app/services/expenses/expenses.service';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-tm-transfer',
  templateUrl: './tm-transfer.page.html',
  styleUrls: ['./tm-transfer.page.scss'],
})
export class TmTransferPage implements OnInit {
  selectedCurrency: string = "";
  form: FormGroup;
  imgPath;
  showCurrency: any = [];
  tourManagerList: any = [];
  debit_transaction_by = 1;
  todayDateTime: any;
  mode: string = 'create';
  request = {} as any;
  params = {} as any;
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
    transfer_to_driver_id: [
      { type: 'required', message: 'Handover is required!' },
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
    this.params.group_id = this.user.order_id;
    this.params.driver_id = driver_id;

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
      description: new FormControl(
        '', Validators.required
      ),
      transaction_type: new FormControl('tm_transfer', null),
      group_id: new FormControl(this.user.order_id, null),
      driver_id: new FormControl(driver_id, null),
      driver_name: new FormControl(driver_name, null),
      date_of_transaction: new FormControl(
        '', Validators.required
      ),
      transfer_to_group_id: new FormControl(this.user.order_id, null),
      transfer_to_driver_id: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.request.group_id = this.user.order_id;
    this.request.driver_id = localStorage.getItem("manager_id");

    let dateVar = new Date();
    this.todayDateTime = this.datePipe.transform(dateVar, 'YYYY-MM-dd');
    this.loadExpenses();
    this.setEditData();
    this.getAllTourManager();
  }

  getAllTourManager() {  
    this.expenseService.getTourManager(this.params).subscribe(async (result: any) => {
      console.log("getTourManager", result);
      if (result.handlers.length > 0) {
        this.tourManagerList = result.handlers
      } else {
        this.globalService.presentToast('There is no other tour manager associated');
        this.router.navigate(['/tabs/my-expenses']);
      }     
    })
  }


  setEditData() {
    if (this.router.getCurrentNavigation().extras.state) {
      this.info = this.router.getCurrentNavigation().extras.state.details;
      this.mode = 'edit';
      console.log(this.info);
    };
  }

  setValueSomeDelay() {
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
}