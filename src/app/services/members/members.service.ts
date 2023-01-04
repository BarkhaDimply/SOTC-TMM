import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ApiResponse, handleError } from '../utils';
import { getFlightDataBySector, rooming } from '../variables';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

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


  apiGetRooming(data): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseURL + rooming, data, { headers: this.auth.jsonheader }).pipe(
      catchError(handleError)
    );
  }

  getFlightDataBySector(data) {
    return this.http.post<ApiResponse>(this.baseURL + getFlightDataBySector, data, { headers: this.auth.jsonheader }).pipe(
      catchError(handleError)
    );
  }
}
