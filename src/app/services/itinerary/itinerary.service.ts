import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { loginUrl, loginUrl2, tourManagerActiveGroup } from '../variables';
import { ApiResponse, handleError } from '../utils';
import { UserModel } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {

  httpOptions: any;
  headers = { 'content-type': 'application/json' };
  baseURL: string = '';

  constructor(private http: HttpClient) {
    this.baseURL = localStorage.getItem('baseURL') || '';
    this.baseURLEvent.subscribe(val => {
      if (val !== null) {
        this.baseURL = val;   
      }
    });
   
  }

}
