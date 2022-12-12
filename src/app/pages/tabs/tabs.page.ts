import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import {  Location } from '@angular/common';
import {Platform,AlertController,IonRouterOutlet} from '@ionic/angular';

import { ApiService } from 'src/app/services/api/api.service';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})

export class TabsPage implements OnInit{
  isModal = false;
  routVal='';
  transactionValue:any = [];
  btnSubstatus= true;
  constructor(private globalService: GlobalService,private auth: AuthService, private router: Router,private location: Location,
              private platform : Platform,
              private alertController:AlertController, private apiServices:ApiService,  private actRoute: ActivatedRoute, ) { }

  ngOnInit(): void {

    this.auth.getUserStatus.subscribe(val => {
      if (val === '0') {
        this.router.navigate(['/login']);
      }
    });

    this.actRoute.queryParams.subscribe(params => {

    });


  }

  getDataByTabs(){

    this.apiServices.getAllTransctionHistoryByTime().subscribe((result:any) => {


      Object.entries(result.data).forEach(
        ([key, value]) => {

          this.transactionValue.push({transKey:key,transValue:value});
           
          this.transactionValue.forEach(itms => {
            itms.transValue.forEach(itm=>{

              //if((itm.submission_status == 1 || itm.submission_status == 3) && itm.show_transaction == 0 && itm.category != 'BALANCE ADDED' && itm.category != 'misc_collection' && itm.category != 'tm_transfer' ){
                
              if(itm.submission_status == 1 && itm.show_transaction == 0 && itm.category != 'BALANCE ADDED' && itm.category != 'misc_collection' && itm.category != 'tm_transfer' ){
                
                console.log("aaaaa::::;",itm);
                
                this.btnSubstatus =false;
               


              }


            });


          });


        });
      // plus button hide function
      this.msgFunc();

    });
  }

  async msgFunc(){
    if(this.btnSubstatus){

      console.log("sss",this.btnSubstatus);
      localStorage.removeItem('edit_clicked');
      this.router.navigate(['/tabs/my-expenses/transaction-modal']);
    }
    if(!this.btnSubstatus){
      console.log("mmm",this.btnSubstatus);
      const alert = await this.alertController.create({
        cssClass: '',
        message: 'Transaction Already Submitted',
        mode: 'ios',
        buttons: ['OK']

      });

      await alert.present();}
  }

  setOpen() { 
    this.getDataByTabs();
    console.log("hlo moto");


    };
    

  }

