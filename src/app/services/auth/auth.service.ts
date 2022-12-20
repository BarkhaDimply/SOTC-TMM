import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { loginUrl, loginUrl2, tourManagerActiveGroup } from '../variables';
import { ApiResponse, handleError } from '../utils';
import { UserModel } from 'src/app/models/user.model';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string;

  httpOptions: any;
  headers = { 'content-type': 'application/json' };
  userLoggedIn = new BehaviorSubject('0');
  urlBaseChange: string = 'https://sotcconnect.travelexic.com';
  public urlBaseChangeEvent = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {

    this.urlBaseChangeEvent.subscribe(val =>{
      if(val !== null){
        this.urlBaseChange = val;
      }
    });

    if (this.isAuthenticated) {
      this.userLoggedIn.next(this.user?.agency_name);
    } else {
      this.userLoggedIn.next('0');
    }
  }

  get isAuthenticated(): boolean {
    const storageItem = localStorage.getItem('user');
    return !!storageItem;
  }

  get getUserStatus() {
    return this.userLoggedIn;
  }

  get jsonheader() {
    const headers = {
      'content-type': 'application/json',
      'Access-Control-Allow': '*',
      'Accept':'application/json',
      //'Access-Control-Allow-Origin': '*'
      //'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      // authorization: 'Bearer ' + this.user?.token
    };
    return headers;
  }

  get headersmultiPartHeader() {
    const headers = {
      'content-type': 'multipart/form-data'
    };
    return headers;
  }

  public get user(): UserModel {
    const storageItem = localStorage.getItem('user');
    if (storageItem) {
      return JSON.parse(storageItem);
    }
    return null;
  }

  loginManager(data): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.urlBaseChange + loginUrl2+'?manager_number='+data.manager_number,{ headers: this.jsonheader }).pipe(
      catchError(handleError),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }

  apiTourManagerActiveGroup(data): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(tourManagerActiveGroup, data, {headers: this.headers}).pipe(
      catchError(handleError)
    );
  }

  login(data): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.urlBaseChange + loginUrl, data, { headers: this.jsonheader }).pipe(
      catchError(handleError)     
    );
  }



  // register(data): Observable<ApiResponse> {
  //   return this.http.post<ApiResponse>(registerUrl, data, {headers: this.headers}).pipe(
  //     catchError(handleError),
  //     map((result: ApiResponse) => {
  //       const listing = new ApiResponse();
  //       Object.assign(listing, result);
  //       if (result.status) {
  //         this.userLoggedIn.next(result.data.firstName);
  //       }
  //       return listing;
  //     })
  //   );
  // }

  // forgot(data): Observable<ApiResponse> {
  //   return this.http.post<ApiResponse>(forgotPasswordUrl, data, {headers: this.headers}).pipe(
  //     catchError(handleError)
  //   );
  // }

  // verifyEmail(data): Observable<ApiResponse> {
  //   return this.http.post<ApiResponse>(verifyEmail, data, {headers: this.headers}).pipe(
  //     catchError(handleError),
  //   );
  // }

  // verifyUsername(data): Observable<ApiResponse> {
  //   return this.http.post<ApiResponse>(verifyUsername, data, {headers: this.headers}).pipe(
  //     catchError(handleError),
  //   );
  // }

  // logout(data) {
  //   return this.http.post(logoutUrl, data, {headers: this.jsonheader}).pipe(
  //     catchError(handleError),
  //   );
  // }
}
