import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { appendFile } from 'fs';

@Component({
  selector: 'app-record-transaction',
  templateUrl: './record-transaction.page.html',
  styleUrls: ['./record-transaction.page.scss'],
})

export class RecordTransactionPage implements OnInit {
  amtPaid:any="";
  selectedCurrency: string = "";
  handoverType: string = ""
  getAllCatergories: any = "";
  subCategory: any = [];
  subCategoryEdit:string = "";

  selected_category_id: any = "";
  selected_subcategory_id: any = "";

  expenseData: any;
  showCurrency: any = [];
  selectedDate: string = "";
  description: string = "";
  imageDisplay: string = "";
  imagebase64: string = "";
  imagefetched: boolean = false;
  imgPath: any = "";
  todayDateTime: any;
  getEditValue: any;
  Category_id: any;
  editMode: boolean;
  sub_category_id: any;
  subCategoryId: any;
  token: any;
  loginForm: UntypedFormGroup;
  debit_image: any;
  base64textString: any;
  getCurrBalance: any;
  isModal = false;
  debit_transaction_by: any;
  credit_transaction_by: any;
  transctionHistory: any = [];
  hideSubCat = true;
  image_type: boolean;
  debit_image_new: any;

  constructor(private apiService: ApiService, private location: Location, private datePipe: DatePipe,
    private alertCtrl: AlertController, private router: Router,
    private globalService: GlobalService, private alertController: AlertController,
    private actRoute: ActivatedRoute,
    private fomrBuilder: UntypedFormBuilder) {

    this.expenseData = JSON.parse(localStorage.getItem("expensesData"));
    let dateVar = new Date();
    this.todayDateTime = this.datePipe.transform(dateVar, 'YYYY-MM-dd')

  }

  ngOnInit() {

    /*******************edit transacrtion***********************/

    if (localStorage.getItem('edit_clicked') == 'yes') {
      this.actRoute.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.getEditValue = this.router.getCurrentNavigation().extras.state.details;
          this.amtPaid =this.getEditValue.debit;
          this.description = this.getEditValue.description;
          this.selectedCurrency = this.getEditValue.debitCurrency;
          this.token = this.getEditValue.token;
          this.debit_image = this.getEditValue.debit_image;
          this.debit_transaction_by = this.getEditValue.debit_transaction_by;
          this.credit_transaction_by = this.getEditValue.credit_transaction_by;

          //this.base64textString.push('data:image/png;base64,' + btoa(this.debit_image));

          console.log("debit_image::::",this.debit_image);



          this.apiService.getCategoriesFromServer().subscribe((result: any) => {
            this.getAllCatergories = result.categories;

            

            this.getAllCatergories.forEach(element => {
              this.Category_id = element.id;
              if (this.getEditValue.category == this.Category_id) {
                this.selected_category_id = element.category;

                element.sub_category.forEach(ele => {
                  if(this.getEditValue.sub_category == ele.id) {

 console.log("cat ele::",ele);


                    this.subCategory = ele.category;
                    this.subCategoryId = ele.id;
                  }
                });
              }
            });
          }); 

          this.selectedDate = this.getEditValue.date;
        }
      });
    }
    this.apiService.getCategoriesFromServer().subscribe((result: any) => {
      this.getAllCatergories = result.categories;

     
    });     
    if (this.expenseData) {
      this.expenseData.forEach(element => {
        if(element.balance_cash > 0){
          this.showCurrency.push(element.currency_name);


          //console.log("curr333",this.showCurrency);
        }
      });
    }


    // if (this.expenseData) {
    //   this.expenseData.forEach(element => {
    //
    //     this.showCurrency.push(element.currency_name);
    //
    //   });
    // }

    if (localStorage.getItem('edit_clicked') == 'yes') {
      this.editMode = true;
    }

  }



  getSubcatgeory(ev: any): void {
    this.hideSubCat = false;

    this.selected_category_id = parseInt(ev.target.value);
    //this.subCategory = "";
    this.getAllCatergories.forEach(element => {
      if (this.selected_category_id == element.id) {
        if (element.sub_category.length > 0) {
          this.subCategory = element.sub_category;
        }
      }
    });
  }

  getSubcatgeoryId(ev: any): void {
    this.selected_subcategory_id = ev.target.value;


  }

  selectedHandoverType(type: any): void {
    this.handoverType = type
  }

  selectCurrencyDropdown(name: any): void {
    this.selectedCurrency = name
  }

  async postRegularPayment() {


    if (localStorage.getItem('edit_clicked') == 'yes') {
      if (this.selected_category_id) {
        this.getAllCatergories.forEach(element => {
          if (this.selected_category_id == element.category) {

            this.selected_category_id = element.id
          }
        });

        this.selected_subcategory_id = this.subCategoryId

      }
    }
    if (this.amtPaid === 0) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please Enter Valid Amount',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/record-transaction']);
    }
    if (this.amtPaid == null || this.amtPaid == "") {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please enter amount paid',
        mode: 'ios',
        buttons: ['OK']
    });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/record-transaction']);
    }

    if (this.amtPaid < 0) {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Negative Value Not Allowed',
        mode: 'ios',
        buttons: ['OK']
      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/record-transaction']);
    }

    if (this.selected_category_id == "") {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please Select Category',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/record-transaction']);
    }
    if (this.selectedDate == "") {
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Please Select Date',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();
      return this.router.navigate(['/tabs/my-expenses/record-transaction']);
    }

    // if(this.selected_subcategory_id != '38' && this.selected_subcategory_id != '4'){

    //   if(this.selected_subcategory_id == ''){
    //     const alert = await this.alertController.create({
    //       cssClass: '',
    //       message: 'Please Select Sub Category',
    //       mode: 'ios',
    //       buttons: ['OK']

    //     });

    //     await alert.present();
    //     return this.router.navigate(['/tabs/my-expenses/record-transaction']);
    //   }

    // }


    console.log("curr::::",this.selectedCurrency );
    var Users: string = localStorage.getItem("user")
     if (typeof this.selectedCurrency == 'undefined' || this.selectedCurrency == '') {

      console.log("aaaaaaaaaa",this.showCurrency[0]);

      if(typeof this.showCurrency[0] == 'undefined'){

        const alert = await this.alertController.create({
          cssClass: '',
          message: 'You do not have sufficient Balance',
          mode: 'ios',
          buttons: ['OK']
        });
  
        await alert.present();
        return this.router.navigate(['/tabs/my-expenses/record-transaction']);

      }
      this.selectedCurrency = this.showCurrency[0]

    }
 
    if (this.handoverType == "") {
      this.handoverType = 'Cash'
    }


    let params: any = {}
    params.group_id = JSON.parse(Users).order_id;
    params.driver_id = localStorage.getItem("manager_id");
    params.transaction_amount = this.amtPaid;
    params.currency = this.selectedCurrency;
    params.date_of_transaction = this.selectedDate;
    params.transaction_from = this.handoverType;
    params.driver_name = localStorage.getItem("manager_name");

    // if (localStorage.getItem('edit_clicked') == 'yes') {
    //   params.token = this.token;
    //   params.mode = "edit";
    //   //this.imgPath = this.debit_image     
    //   if(this.imgPath)
    //   {
    //     params.image  = this.imgPath;
    //     params.image_type = true;
    //   }else{     
    //     params.image_type = false;
    //   }
    // } else {
    //   params.token = "";
    //   params.mode = "create";
    //   params.image = this.imgPath;
    //   params.image_type = true;
    // }


    if (localStorage.getItem('edit_clicked') == 'yes') {

      if(this.debit_image != ''){
        this.debit_image_new = this.debit_image;
        this.image_type = false;
      }else{
        this.debit_image_new = this.imgPath;
        this.image_type = true;
      }

      params.token = this.token;
      params.mode = "edit";
      params.image = this.debit_image_new  
      params.image_type = this.image_type;
    } else {
      params.token = "";
      params.mode = "create";
      params.image = this.imgPath;
      params.image_type = true;
    }

    params.transaction_type = "Debit";
    params.description = this.description;
    params.category_id = this.selected_category_id;
    params.sub_category = this.selected_subcategory_id;
    // params.image = this.imgPath;

    // if (this.imgPath != '') {
    //   params.image_type = true;
    // } else {
    //   params.image_type = false;
    // }

    console.log("params:::: ",params);

    localStorage.setItem("addRecordTransaction",params);

    


    this.apiService.postCurrencyExchange(params).subscribe(async (result: any) => {


      if (result.status == 'true') {
        const alert = await this.alertController.create({
          cssClass: '',
          message: 'Transaction Successful',
          mode: 'ios',
          buttons: ['OK']

        });

        await alert.present();

        return this.router.navigate(['/tabs/my-expenses']);


      } else {
        const alert = await this.alertController.create({
          cssClass: '',
          message: result.message,
          mode: 'ios',
          buttons: ['OK']

        });

        await alert.present();
        return;
      }

    })
  }


  back() {
    localStorage.removeItem('edit_clicked')
    return this.router.navigate(['/tabs/my-expenses']);
  }

  async openGallery() {

    this.globalService.takePhoto().then(result => {
      if (result.imageUrl) {
      this.imageDisplay = result.imageUrl;
      this.imgPath = result.imageUrl;
      }
    });

    // const image = await Camera.getPhoto({
    //   quality: 90,
    //   allowEditing: false,
    //   resultType: CameraResultType.DataUrl,
    //   source: CameraSource.Photos, // Camera, Photos or Prompt!
    //   saveToGallery: true,
    // });

    // console.log("aaaaaaaaaaaa:::",image);

    // if (image) {
    //   this.imageDisplay = image.dataUrl;
    //   this.imgPath = image.dataUrl;

    // }
  }

  keyPressNumbers(event) {
    console.log("event", event);
    var charCode = (event.which) ? event.which : event.keyCode;

    console.log("charCode", charCode);

    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57 || charCode == '')) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  removeImage(){
    this.debit_image = "";
  }

}




