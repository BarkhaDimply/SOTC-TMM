import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, throwError  } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { GlobalService } from '../global/global.service';
import { ApiResponse, handleError } from '../utils';
import { currencyExchange, rooming, showCurrentBalance,getCategories, getAllTourManager,
         transactionHistory, transactionFetch, deleteTranscationHistory, updateNoShowStatus,historyNotification, tourManagerActiveGroup, sendSubmission, sendPolling, getPollingResponse, getPollingBroadcaste, getfetchstock, getAttendanceListData, getAttendanceById, updatestockData, tmStatusUpdate, getAttendancePresent, getTransactionDeatilsByTime, getRejectedTransactionDeatilsByTime, getFlightDataBySector, getFcmToken, saveManagerHub
} from '../variables';

import { OfflineManagerService } from '../offlineManager/offline-manager.service';
import { NetworkService, ConnectionStatus } from '../network/network.service';
import { Storage } from '@ionic/storage';

const API_STORAGE_KEY = 'AIzaSyATuK2tzjGc_y1Gn6XLwR5T-nCX3DeYRHE';
const API_URL = 'https://tcil-sotc.travelexic.com/api/webservices/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  [x: string]: any;

  constructor(private http: HttpClient,private auth: AuthService, private globalService: GlobalService,
     private networkService: NetworkService, 
    private storage: Storage, private offlineManager: OfflineManagerService) {

   }

  
  apiGetRooming(data): Observable<ApiResponse> {
    
    return this.http.post<ApiResponse>(rooming, data, { headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     } )   
    );
  }

  getCurrentBalance() {
    // let params = new HttpParams();
    let params:any = {}
    var Users:string = localStorage.getItem("user")
    params.group_id =  JSON.parse(Users).order_id
    params.driver_id = localStorage.getItem("manager_id")

    return this.http.post<ApiResponse>(showCurrentBalance,params,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     } ),
      map((result: ApiResponse) => {
       const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }

  postCurrencyExchange(data) {
    return this.http.post<ApiResponse>(currencyExchange,data,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }

  postPollingData(data) {
    return this.http.post<ApiResponse>(sendPolling,data,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }

  getCategoriesFromServer(){
    return this.http.get<ApiResponse>(getCategories,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
      
    );
  }

  getTourManager(){
    let params:any = {}
    var Users:string = localStorage.getItem("user");
    params.group_id =  JSON.parse(Users).order_id
    params.driver_id = localStorage.getItem("manager_id");
    return this.http.post<ApiResponse>(getAllTourManager,params,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }

  getAllTransctionHistory(){
    let params:any = {}
    var Users:string = localStorage.getItem("user");
    params.group_id =  JSON.parse(Users).order_id
    params.driver_id = localStorage.getItem("manager_id");
    return this.http.post<ApiResponse>(transactionHistory,params,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }

  getAllTransctionHistoryByTime(){
    let params:any = {}
    var Users:string = localStorage.getItem("user");
    params.group_id =  JSON.parse(Users).order_id
    params.driver_id = localStorage.getItem("manager_id");
    return this.http.post<ApiResponse>(getTransactionDeatilsByTime,params,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }

  getRejectedTransctionHistoryByTime(){
    let params:any = {}
    var Users:string = localStorage.getItem("user");
    params.group_id =  JSON.parse(Users).order_id
    params.driver_id = localStorage.getItem("manager_id");
    return this.http.post<ApiResponse>(getRejectedTransactionDeatilsByTime,params,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }

  getCurrencyCodes(){
    let Url:string = "https://openexchangerates.org/api/currencies.json"
    return this.http.get<ApiResponse>(Url).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
      
    );
  }

  editTRansctionAPI(transId:any){
    let params:any = {}
   params.transaction_id = transId;
    return this.http.post<ApiResponse>(transactionFetch,params,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }

  deleteTransactionHistory(transId:any) {
    let params:any = {}
    params.transaction_id = transId;
     return this.http.post<ApiResponse>(deleteTranscationHistory,params,{ headers: this.auth.jsonheader }).pipe(
       catchError(handleError => {
         this.globalService.dismissLoading();
         return throwError(handleError);
      }),
       map((result: ApiResponse) => {
         const listing = new ApiResponse();
         Object.assign(listing, result);        
         return listing;
       })
     );
  }

  updateNoShowStatus(data:any) {
   
     return this.http.post<ApiResponse>(updateNoShowStatus,data,{ headers: this.auth.jsonheader }).pipe(
       catchError(handleError => {
         this.globalService.dismissLoading();
         return throwError(handleError);
      }),
       map((result: ApiResponse) => {
         const listing = new ApiResponse();
         Object.assign(listing, result);        
         return listing;
       })
     );
  }

  getHistoryNotification(){
    let params:any = {}
    var Users:string = localStorage.getItem("user");
    params.group_id =  JSON.parse(Users).order_id
    params.driver_id = localStorage.getItem("manager_id");
    return this.http.post<ApiResponse>(historyNotification,params,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }
  
  getMyTrip(){
    let params:any = {}
    params.manager_id = localStorage.getItem("manager_id");
    return this.http.post<ApiResponse>(tourManagerActiveGroup,params,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }

  postSendSubmission(data) {
    return this.http.post<ApiResponse>(sendSubmission,data,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }
  
  getPollingResponseById(){ 
   
    let params:any = {}
    var Users:string = localStorage.getItem("user")
    params.group_id =  JSON.parse(Users).order_id
    params.nonce = 'KHsD(PF3JzQfT)nm3l^TERO';
    params.source = 'app';
    return this.http.post<ApiResponse>(getPollingResponse,params,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );

  }

  getPollingBroadcasting(data) {
    return this.http.post<ApiResponse>(getPollingBroadcaste,data,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }


  getFetchStockInventory(data) {

    return this.http.post<ApiResponse>(getfetchstock,data,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
       // this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
      
    );
  }

  postUpdatestockData(data) {

    return this.http.post<ApiResponse>(updatestockData,data,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
       // this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
      
    );
  }


  

  /***********fetch**************/
  getAttendanceList(data) {
    return this.http.post<ApiResponse>(getAttendanceListData,data,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        //this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
   
  }


  scanAttendanceById(data) {

    return this.http.post<ApiResponse>(getAttendanceById,data,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        this.globalService.dismissLoading();
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
   
  }

  tmStatusUpdateAccept(data) {

    return this.http.post<ApiResponse>(tmStatusUpdate,data,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
   
  }
  
  getAttendancePresentList(data) {
    return this.http.post<ApiResponse>(getAttendancePresent,data,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
   
  }

  getFlightDataBySector(data){
    return this.http.post<ApiResponse>(getFlightDataBySector,data,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }


  getFcmToken(data){
    return this.http.post<ApiResponse>(getFcmToken,data,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }

  /***************offline mode********************************/

  getUsers(forceRefresh: boolean = false): Observable<any[]> {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline || !forceRefresh) {
      // Return the cached data from Storage
      return from(this.getLocalData('users'));
    } else {
      // Just to get some "random" data
      let page = Math.floor(Math.random() * Math.floor(6));

      // Return real API data and store it locally
      return this.http.get(`${API_URL}/users?per_page=2&page=${page}`).pipe(
        map(res => res['data']),
        tap(res => {
          this.setLocalData('users', res);
        })
      )
    }
  }

  updateUser(user, data): Observable<any> {
    let url = `${API_URL}/users/${user}`;
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.offlineManager.storeRequest(url, 'PUT', data));
    } else {
      return this.http.put(url, data).pipe(
        catchError(err => {
          this.offlineManager.storeRequest(url, 'PUT', data);
          throw new Error(err);
        })
      );
    }
  }

  // Save result of API requests
  private setLocalData(key, data) {
    this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
  }

  // Get cached API result
  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }
    /***************end of offline mode********************************/

  //set hub in db -api

  saveManagerHub(data){
    return this.http.post<ApiResponse>(saveManagerHub,data,{ headers: this.auth.jsonheader }).pipe(
      catchError(handleError => {
        return throwError(handleError);
     }),
      map((result: ApiResponse) => {
        const listing = new ApiResponse();
        Object.assign(listing, result);        
        return listing;
      })
    );
  }

  
}
