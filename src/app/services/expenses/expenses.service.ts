import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ApiResponse, handleError } from '../utils';
import { getRejectedTransactionDeatilsByTime, getTransactionDeatilsByTime, showCurrentBalance } from '../variables';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  httpOptions: any;
  headers = { 'content-type': 'application/json' };
  baseURL: string = '';

  constructor(private http: HttpClient, private auth: AuthService) {
    this.baseURL = localStorage.getItem('baseURL') || '';
    this.auth.baseURLEvent.subscribe(val => {
      if (val !== null) {
        this.baseURL = val;
      }
    });
  }

  getCurrentBalance(data) {
    return this.http.post<ApiResponse>(this.baseURL + showCurrentBalance, data, { headers: this.auth.jsonheader }).pipe(
      catchError(handleError)
    );
  }


  getAllTransctionHistoryByTime(data) {
    return this.http.post<ApiResponse>(this.baseURL + getTransactionDeatilsByTime, data, { headers: this.auth.jsonheader }).pipe(
      catchError(handleError)
    );
  }

  getRejectedTransctionHistoryByTime(data) {
    return this.http.post<ApiResponse>(this.baseURL + getRejectedTransactionDeatilsByTime, data, { headers: this.auth.jsonheader }).pipe(
      catchError(handleError)
    );
  }
}
