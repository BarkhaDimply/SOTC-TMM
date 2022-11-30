import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { ZBar } from '@ionic-native/zbar/ngx';

import { Network } from '@ionic-native/network/ngx';

import { IonicStorageModule } from '@ionic/storage'


@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        IonicStorageModule.forRoot(),
        HttpClientModule,
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        AngularFireDatabaseModule,
        AppRoutingModule,
    ],
    providers: [{ provide: AngularFireModule },
        ZBar,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        Network
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
