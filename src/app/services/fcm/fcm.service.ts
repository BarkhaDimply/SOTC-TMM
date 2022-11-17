import { Injectable, Component, OnInit } from '@angular/core';

import { NavigationExtras, Router } from '@angular/router';

import {ActionPerformed, PushNotificationSchema, PushNotifications,Token, PushNotificationToken, PushNotification, PushNotificationActionPerformed,} from '@capacitor/push-notifications';

import { Capacitor } from '@capacitor/core';


@Injectable({
  providedIn: 'root'
})
export class FcmService {


  constructor(private router: Router) { }

  initPush() {
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    }
  }


  ngOnInit() {
  }



  private registerPush() {

    PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // No permission for push granted
      }
    });

    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {


        console.log('My token 11: ' + JSON.stringify(token.value));
        localStorage.setItem("FCMTokenKey",token.value);
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        const data = notification.notification.data;

        if(data.key == '27'){
          this.router.navigateByUrl('/tabs/my-expenses');
        }else if(data.key == '25'){
          this.router.navigateByUrl('/notification');
        }else if(data.key == '26'){
          this.router.navigateByUrl('/notification');
        }else if(data.key == '28'){
         // this.router.navigateByUrl('/tabs/my-expenses');
          let navigationExtras: NavigationExtras = {
            state: {
              details:28
            }
          };
         
          console.log("fcm::::",JSON.stringify(navigationExtras));

        this.router.navigate(['/tabs/my-expenses'], navigationExtras);   
        }else{
          this.router.navigateByUrl('/notification');
        }

      
      }
    );
  }

  
}