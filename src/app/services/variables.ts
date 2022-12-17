import { environment } from '../../environments/environment';

//auth

//console.log("sotcBase::::",localStorage.getItem('sotcBase'));
//console.log("tc::::",localStorage.getItem('tcBase'));

export const loginUrl: string = environment.webserviceTcil + '/api/webservices/V2/getManagerItinerary2';
export const loginUrl2: string = environment.webserviceTcil + '/api/webservices/AuthenticateManager';
export const tourManagerActiveGroup: string = environment.webserviceTcil + '/api/webservices/V2/TmActiveGroups';
export const rooming: string = environment.webserviceTcil + '/api/webservices/fetch_rooming2';
export const showCurrentBalance: string = environment.webserviceTcil + '/api/webservices/show_current_balance';
export const currencyExchange: string = environment.webserviceTcil +'/api/webservices/transaction_update';
export const getCategories: string  =  environment.webserviceTcil +'/api/webservices/categories';
export const getAllTourManager:string = environment.webserviceTcil+'/api/webservices/members';
export const transactionHistory:string = environment.webserviceTcil+'/api/webservices/show_transaction_details';
export const transactionFetch:string = environment.webserviceTcil+'/api/webservices/transactionFetch';
export const deleteTranscationHistory:string = environment.webserviceTcil+'/api/webservices/transactionDelete';
export const updateNoShowStatus= environment.webserviceTcil+'/api/webservices/update_no_show_status';
export const historyNotification:string = environment.webserviceTcil+'/api/webservices/TmNotificationHistory';
export const sendSubmission: string = environment.webserviceTcil +'/api/webservices/send_submission';
export const sendPolling: string = environment.webserviceTcil +'/api/webservices/sendpoll';
export const getPollingResponse: string = environment.webserviceTcil +'/api/webservices/getpollbyid';
export const getPollingBroadcaste: string = environment.webserviceTcil +'/api/webservices/group_notification';
export const getfetchstock: string = environment.webserviceTcil +'/api/webservices/fetchstock';
export const getAttendanceListData: string = environment.webserviceTcil +'/api/webservices/fetch_attendance';
export const getAttendanceById: string = environment.webserviceTcil +'/api/webservices/V2/attendancebyId';
export const updatestockData: string = environment.webserviceTcil +'/api/webservices/updatestock';
export const tmStatusUpdate: string = environment.webserviceTcil +'/api/webservices/status_update';
export const getAttendancePresent: string = environment.webserviceTcil +'/api/webservices/V2/FetchAttendance';
export const getTransactionDeatilsByTime: string = environment.webserviceTcil +'/api/webservices/show_transaction_details_by_time';
export const getRejectedTransactionDeatilsByTime: string = environment.webserviceTcil +'/api/webservices/show_rejected_transaction_details_by_time';
export const getFlightDataBySector: string = environment.webserviceTcil +'/api/webservices/V2/getFlightDataBySector';
export const getFcmToken: string = environment.webserviceTcil +'/api/webservices/save_fcm_token';
export const saveManagerHub: string = environment.webserviceTcil +'/api/webservices/V2/save_manager_hub';
