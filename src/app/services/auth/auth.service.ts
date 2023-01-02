import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { getFcmToken, loginUrl, loginUrl2, saveManagerHub, tourManagerActiveGroup } from '../variables';
import { ApiResponse, handleError } from '../utils';
import { UserModel } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions: any;
  headers = { 'content-type': 'application/json' };
  userLoggedIn = new BehaviorSubject<any>(null);
  baseURL: string = '';
  public baseURLEvent = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.baseURL = localStorage.getItem('baseURL') || '';
    this.baseURLEvent.subscribe(val => {
      if (val !== null) {
        this.baseURL = val;
      }
    });
    if (this.isAuthenticated) {
      this.userLoggedIn.next(this.user?.agency_name);
    } else {
      this.userLoggedIn.next(null);
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
      'Accept': 'application/json',
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
    return this.http.get<ApiResponse>(this.baseURL + loginUrl2 + '?manager_number=' + data.manager_number, { headers: this.jsonheader }).pipe(
      catchError(handleError),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);
        return listing;
      })
    );
  }

  apiTourManagerActiveGroup(data): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseURL + tourManagerActiveGroup, data, { headers: this.headers }).pipe(
      catchError(handleError)
    );
  }

  login(data): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseURL + loginUrl, data, { headers: this.jsonheader }).pipe(
      catchError(handleError)
    );
  }

  saveManagerHub(data) {
    return this.http.post<ApiResponse>(this.baseURL + saveManagerHub, data, { headers: this.jsonheader }).pipe(
      catchError(handleError),
    );
  }

  getFcmToken(data) {
    return this.http.post<ApiResponse>(this.baseURL + getFcmToken, data, { headers: this.jsonheader }).pipe(
      catchError(handleError),
    );
  }

  // logout(data) {
  //   return this.http.post(logoutUrl, data, {headers: this.jsonheader}).pipe(
  //     catchError(handleError),
  //   );
  // }
}
