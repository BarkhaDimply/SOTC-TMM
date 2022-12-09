import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-stock-inventory-management',
  templateUrl: './stock-inventory-management.page.html',
  styleUrls: ['./stock-inventory-management.page.scss'],
})
export class StockInventoryManagementPage implements OnInit {

  scanActive: boolean = true;

  constructor(private apiService: ApiService,private router:Router) {
   
  }

  ngOnInit() {
    this.startScanner();
    this.scanActive = true;
    localStorage.setItem('isFilterSet', 'false');
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    const allowed = await this.checkPermission();

    if (allowed) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scanActive = false;
      
        let cartonId = result.content
        var new_carton_arr = cartonId.split(',');
      
     // var Users:string = localStorage.getItem("user")
      let params:any = {}
        params.group_id = new_carton_arr[0];
        params.nonce = 'KHsD(PF3JzQfT)nm3l^TERO';
        params.carton_id = new_carton_arr[1];


        // params.group_id = 323;
        // params.nonce = 'KHsD(PF3JzQfT)nm3l^TERO';
        // params.carton_id = 1659506384037;


   
      this.apiService.getFetchStockInventory(params).subscribe((result:any) => {

    
        let navigationExtras: NavigationExtras = {
          state: {
            details:JSON.stringify(result.data),
            paramsD:JSON.stringify(params)
          }
        };

        this.router.navigate(['/stock-inventory-management/carton-details'], navigationExtras);
      });



      } else {
        alert('NO DATA FOUND!');
      }
    } else {
      alert('NOT ALLOWED!');
    }
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }



}