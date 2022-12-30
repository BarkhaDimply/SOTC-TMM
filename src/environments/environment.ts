// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  webserviceSOTC: 'https://sotcconnect.travelexic.com',
  webserviceTcil: 'https://tcgateway.travelexic.com',
  //webserviceNew: 'https://cors-anywhere.herokuapp.com/https://new.travelexic.com',
  //webserviceTcil: 'https://tcil-sotc.travelexic.com', //for test server
  //webserviceTcil: 'https://sotcconnect.travelexic.com',
  firebaseConfig : {
    apiKey: "AIzaSyATuK2tzjGc_y1Gn6XLwR5T-nCX3DeYRHE",
    authDomain: "ionic-tourmanager-app.firebaseapp.com",
    databaseURL: "https://ionic-tourmanager-app-default-rtdb.firebaseio.com/",
    projectId: "ionic-tourmanager-app",
    storageBucket: "ionic-tourmanager-app.appspot.com",
    messagingSenderId: "335326943172",
    appId: "1:335326943172:android:bf8c867a216dec8dbfb691"
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
