import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-itinerary-checkinout',
  templateUrl: './itinerary-checkinout.component.html',
  styleUrls: ['./itinerary-checkinout.component.scss'],
})
export class ItineraryCheckinoutComponent implements OnInit {
  @Input() data;
  @Input() dayIndex;
  @Input() itinerary;
  constructor(private alertController: AlertController) { }

  ngOnInit() {    
  }

  async checkAttendanceStatus() {
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
