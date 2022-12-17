import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import {Platform,AlertController,IonRouterOutlet} from '@ionic/angular';
import {Location} from "@angular/common";

//import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
//import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FcmService } from 'src/app/services/fcm/fcm.service';

import { NetworkService, ConnectionStatus } from './services/network/network.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OfflineManagerService } from './services/offlineManager/offline-manager.service';
import { GlobalService } from './services/global/global.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})



export class AppComponent implements OnInit{

@ViewChild(IonRouterOutlet,{static:true})routerOutlet: IonRouterOutlet;

  menuVisible = true;
  active_group: any;
  agency_logo: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private platform : Platform,
    private alertController:AlertController,
    private location : Location,
   // private splashScreen: SplashScreen,
   // private statusBar: StatusBar,
    private fcmService: FcmService,
    private offlineManager: OfflineManagerService,
    private networkService: NetworkService,
    private globalService: GlobalService

  ) {
    this.initializeApp();
  }
  

  ngOnInit(): void {


    this.agency_logo = localStorage.getItem('agency_logo');


    this.auth.getUserStatus.subscribe(val => {
      if (val === '0') {
        this.menuVisible = false;
      }else{
        this.menuVisible = true;
      }
    });



  }


 
  
 


  initializeApp() {
    this.platform.ready().then(() => {
    //  this.statusBar.styleDefault();
   

     // this.splashScreen.hide();

      // Trigger the push setup
      this.fcmService.initPush();
    });

    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.offlineManager.checkForEvents().subscribe();
      }
    });
    
  }

  logout() {
    this.auth.getUserStatus.next('0');
    localStorage.removeItem('user');
    window.location.reload();
  }
}
