import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { identity } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-itinerary',
  templateUrl: 'itinerary.page.html',
  styleUrls: ['itinerary.page.scss']
})
export class ItineraryPage implements OnInit{
  user: UserModel;
  ShowOthersIcon: boolean = false;
  hideAddButton:boolean = true;
  getbydate :any;
  key_itinerary: any;
  showData: any;
  merber_name: any[];
  newArray: number;
  user_temp_data: string;
  user_data: any;
  active_group: any;

  constructor(private auth: AuthService, private alertController: AlertController,private globalService: GlobalService) {
    this.user = this.auth.user;
 
    console.log("user::",this.user.itinerary.length);
  }
  ngOnInit(): void {
    this.auth.getUserStatus.subscribe(val => {
      if (val !== '0') {
        this.user = this.auth.user;
      }
    });

    this.getByDayswise();


    var t = new Date().getTime()/1000;
    console.log("tttt", t);
  

  }

  doRefresh(event) {
    console.log('Begin async operation');
    
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async askCity() {

    let inputs = [] as any;

    this.user.hub_list.forEach((element,index) => {
      inputs.push({
        name: 'radio'+index,
        type: 'radio',
        label: element,
        value: element,
        handler: () => {
          console.log('Radio  selected'+index);
        },
        checked: false
      });
    });

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Select city',
      inputs: inputs,
      // buttons: [
      //   {
      //     text: 'Cancel',
      //     role: 'cancel',
      //     cssClass: 'secondary',
      //     handler: () => {
      //       console.log('Confirm Cancel');
      //     }
      //   }, {
      //     text: 'Ok',
      //     handler: () => {
      //       console.log('Confirm Ok');
      //     }
      //   }
      // ]    
    });

    await alert.present();
  }

  getByDayswise(){

    let iti_data=[];
    let iti_data1=[];
   
      this.user.itinerary.forEach((city,index)=> {  

        let key2= 0;

         Object.entries(city).forEach( 
           ([key1, value]) => { 
            var roomVal: any = value
             

          if(value && typeof value =='object'){ 
              
               iti_data.push({index,date:key1,dayplan:value,key3:key2})
               key2++;

             } 
        
           });

      });

      console.log("data::",iti_data);
      this.getbydate =iti_data;
    
    // iti_data.forEach((ele:any)=>{  console.log("data ele::",ele);
    //   ele.dayplan.forEach((ele2:any)=>{
    //     iti_data1.push(ele2.attendance)
    //   })
     
    // })

    // console.log("data iti_data1::",iti_data1);

    // let nameArry=[]
    
    // for (const [key, value] of Object.entries(iti_data1)) {
    //   value.forEach(ele3=>{nameArry.push(ele3)
    //   }) 
    // }
    // this.merber_name = nameArry;

    // this.getbydate =iti_data;

    
  }

  getLocationsArray(itinerary,date){

    //console.log("date",date);
   
    return itinerary[date.replaceAll("-","/")];
  }
  getLocationsLen(itinerary,date){
   
    return itinerary[date.replaceAll("-","/")]?.length;
  }

  refreshPage(){
    this.globalService.presentLoading();
 
  this.user_temp_data = JSON.parse(localStorage.getItem("user"));

  console.log("this.user_data----",this.user_temp_data);

  this.user_temp_data['itinerary'] =  this.user.itinerary

  //localStorage.setItem('',this.user_temp_data['itinerary']);

  console.log("this.user_data----",this.user_temp_data);

  this.active_group = JSON.parse(localStorage.getItem('active_group'));

      let request = {
        'login_code': this.active_group[0]['tourCode'],
        'nonce': 'KHsD(PF3JzQfT)nm3l^TERO'
      };

      this.auth.login(request).subscribe(async (result: any) => {

        if (result?.status === true) {

          localStorage.setItem('user', JSON.stringify(result.data));
          window.location.reload();

          //this.loadModal(result.data.hub_list);
        } else {
          this.globalService.dismissLoading();
          const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            message: result.error,
            mode: 'ios',
            buttons: ['OK']
        
          });
        
          await alert.present();
          return;
        }
      });

      
 
  }

  logout() {   
    this.auth.getUserStatus.next('0');
    localStorage.removeItem('user');
    window.location.reload();
  }

  onButtonClickAdd() {

    this.ShowOthersIcon = !this.ShowOthersIcon;
    this.hideAddButton = false;
  }
  onButtonClickClose(){
    this.hideAddButton = true;
    this.ShowOthersIcon=false;
  }

  async checkAttendanceStatus(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Attendance Not Allowed',
      mode: 'ios',
      buttons: ['OK']
  
    });
  
    await alert.present();
    return;
  }
  
}
