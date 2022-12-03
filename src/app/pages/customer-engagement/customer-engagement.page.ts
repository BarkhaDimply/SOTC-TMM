import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {AlertController, IonSegment, NavController} from '@ionic/angular';
import {SwiperComponent} from 'swiper/angular';
import {SwiperOptions} from 'swiper';
import { ApiService } from 'src/app/services/api/api.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-customer-engagement',
  templateUrl: './customer-engagement.page.html',
  styleUrls: ['./customer-engagement.page.scss'],
})
export class CustomerEngagementPage implements OnInit {
  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('segment') segment: IonSegment;
  activeSegment = '';
  config: SwiperOptions = {
    pagination: true,
    height: 400
  };
  todayDateTime:any;
  question:string="";
  question_type:string="";
  expire_time:string="";
  getquestion:any=[];
  getValueChange:string="";
  addquestion:string="";
  responseById:any;
  broadcasting:any;
  msg:string="";
  buttonClicked: {[key: number]: boolean} = {};
  
  
 
  constructor(private location: Location,
    private apiServices: ApiService,private datePipe: DatePipe,
    private globalService: GlobalService,private alertController: AlertController) { 


      let dateVar = new Date();
      this.todayDateTime = this.datePipe.transform(dateVar,'YYYY-MM-dd')
     
    }
    

  ngOnInit() {
    setTimeout(() => {
      this.swiper.swiperRef.slideTo(1);
    },200);
    this.getPollingResponsesByGroupID();
  }


 

  segmentChanged(event) {
    if (event.target.value === 'broadcasting') {
      this.activeSegment = 'broadcasting';
      this.swiper.swiperRef.slideTo(0);
    }
    if (event.target.value === 'polling') {
      this.activeSegment = 'polling';
      this.swiper.swiperRef.slideTo(1);
    }
    if (event.target.value === 'responses') {
      this.activeSegment = 'responses';
      this.swiper.swiperRef.slideTo(2);
    }   
  }

  onSlideChange(event) {
    if (event[0].activeIndex === 0) {
      this.activeSegment = 'broadcasting';
      this.segment.value = 'broadcasting';
    }
    if (event[0].activeIndex === 1) {
      this.activeSegment = 'polling';
      this.segment.value = 'polling';
    }
    if (event[0].activeIndex === 2) {
      this.activeSegment = 'responses';
      this.segment.value = 'responses';
    }    
  }

  back(){
    this.location.back();
  }

  async addPolling(){


    if(this.question_type == ''){
      const alert = await this.alertController.create({
       // cssClass: 'my-custom-class',
        message: 'Please Select Polling Type',
        mode: 'ios',
        buttons: ['OK']
    
      });
    
      await alert.present();
      return;
    }


   

  //  if(this.getValueChange != "single" && this.getValueChange != "multiple"){ // removed by dhruv sir
      if(this.expire_time == "") {

        const alert = await this.alertController.create({
          //cssClass: 'my-custom-class',
          message: 'Please enter Expiry Date',
          mode: 'ios',
          buttons: ['OK']
      
        });
      
        await alert.present();
        return false;
      }
   // }

    if(this.question == ""){
      const alert = await this.alertController.create({
       // cssClass: 'my-custom-class',
       // header: 'Delete Transaction!',
        message: 'Please Ask Question',
        mode: 'ios',
        buttons: ['OK']
    
      });
    
      await alert.present();
      return;
    }

    if(this.getquestion == ""){
      const alert = await this.alertController.create({
      //  cssClass: 'my-custom-class',
        message: 'Please ADD Option',
        mode: 'ios',
        buttons: ['OK']
    
      });
    
      await alert.present();
      return;
    }
    
    
   // this.globalService.presentLoading();
   
    var Users:string = localStorage.getItem("user")
    let params:any = {}
    params.group_id = JSON.parse(Users).order_id;
    params.source = 'app';
    params.question = this.question;
    params.options = JSON.stringify(this.getquestion);
    params.agency_id = JSON.parse(Users).agency_id;
    params.nonce = 'KHsD(PF3JzQfT)nm3l^TERO';
    params.question_type = this.getValueChange;
    params.remark = 'remark';
    params.expire_time = this.expire_time;

    

    this.apiServices.postPollingData(params).subscribe(async (result:any) =>{
    //  this.globalService.dismissLoading();
    
       if(result.status) {
      
        const alert = await this.alertController.create({
        //  cssClass: 'my-custom-class',
          message: 'Polling Successful',
          mode: 'ios',
        //  buttons: ['OK']
      
        });
       
        await alert.present();
        window.location.reload();

    
      }else{
        const alert = await this.alertController.create({
         // cssClass: 'my-custom-class',
          message: result.message,
          mode: 'ios',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }
    })
    
  }


  async addquestions(){
  
    if(this.addquestion == ''){
      const alert = await this.alertController.create({
       // cssClass: 'my-custom-class',
        message: 'Please Add Option',
        mode: 'ios',
        buttons: ['OK']
    
      });
    
      await alert.present();
      return;
    }
    
    let params:any = {}
    this.getquestion.push({ 
      option: this.addquestion,
      ans:'false'
    });
    params.addquestion = this.getquestion;
    this.addquestion = '';
    
  }

  onItemValueChange(ev: any) {

    if (ev == 'single') {
      this.getValueChange = 'single';
    }else if (ev == 'multiple') {
      this.getValueChange = 'multiple';
    }else if (ev == 'opt-in') {
      this.getValueChange = 'opt-in';

  }

   
  }


  getPollingResponsesByGroupID(){

    if(localStorage.getItem("listOfRooming") != ''){
    
      this.responseById = localStorage.getItem("listOfPollingResponse");
  
      this.responseById = JSON.parse(this.responseById);

    }
  
    //this.globalService.presentLoading();
    this.apiServices.getPollingResponseById().subscribe((result:any) => {
    //this.globalService.dismissLoading();
    this.responseById = result.data;

    localStorage.setItem("listOfPollingResponse", JSON.stringify(this.responseById));
    });
   
  }


  async getPollingBroadCastingApi(){

   // this.globalService.presentLoading();
    
    if(this.msg == ''){
      const alert = await this.alertController.create({
       // cssClass: 'my-custom-class',
        message: 'Please Write Message',
        mode: 'ios',
        buttons: ['OK']
    
      });
    
      await alert.present();
      return;
    }

    
    var Users:string = localStorage.getItem("user")
    let params:any = {}
    params.group_id = JSON.parse(Users).order_id;
    params.nonce = '173648APz6zQ2jaa^CKIB9rSStj';
    params.type = 'Broadcasta api';
    params.msg = this.msg;
    console.log("parm", params);

    this.apiServices.getPollingBroadcasting(params).subscribe(async (result:any) =>{
      //this.globalService.dismissLoading();
      
      if(result.status == "false"){
        const alert = await this.alertController.create({
          //cssClass: 'my-custom-class', 
          message: result.msg,
          mode: 'ios',
          buttons: ['OK']
      
        });
      
        await alert.present();
      }else if(result.status == "success") {
       
        const alert = await this.alertController.create({
         // cssClass: 'my-custom-class',
          message: 'Broadcasting successful',
          mode: 'ios',
          buttons: ['OK']
      
        });
        
        await alert.present();
        
       
      } this.msg = '';
    })
  }


  onButtonClick(index: number) { 
    
        if(this.buttonClicked[index] != true){
          this.buttonClicked[index] = true;
        }else if(this.buttonClicked[index] == true){
         this.buttonClicked[index] = false;
        }
        
      
  }


}


