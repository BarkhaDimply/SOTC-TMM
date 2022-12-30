import { environment } from '../../environments/environment';

//auth


export const loginUrl: string = '/api/webservices/V2/getManagerItinerary2';
export const loginUrl2: string = '/api/webservices/AuthenticateManager';
export const tourManagerActiveGroup: string = '/api/webservices/V2/TmActiveGroups';
export const rooming: string = '/api/webservices/fetch_rooming2';
export const showCurrentBalance: string = '/api/webservices/show_current_balance';
export const currencyExchange: string = '/api/webservices/transaction_update';
export const getCategories: string  =  '/api/webservices/categories';
export const getAllTourManager:string = '/api/webservices/members';
export const transactionHistory:string = '/api/webservices/show_transaction_details';
export const transactionFetch:string = '/api/webservices/transactionFetch';
export const deleteTranscationHistory:string = '/api/webservices/transactionDelete';
export const updateNoShowStatus= '/api/webservices/update_no_show_status';
export const historyNotification:string = '/api/webservices/TmNotificationHistory';
export const sendSubmission: string = '/api/webservices/send_submission';
export const sendPolling: string = '/api/webservices/sendpoll';
export const getPollingResponse: string = '/api/webservices/getpollbyid';
export const getPollingBroadcaste: string = '/api/webservices/group_notification';
export const getfetchstock: string = '/api/webservices/fetchstock';
export const getAttendanceListData: string = '/api/webservices/fetch_attendance';
export const getAttendanceById: string = '/api/webservices/V2/attendancebyId';
export const updatestockData: string = '/api/webservices/updatestock';
export const tmStatusUpdate: string = '/api/webservices/status_update';
export const getAttendancePresent: string = '/api/webservices/V2/FetchAttendance';
export const getTransactionDeatilsByTime: string = '/api/webservices/show_transaction_details_by_time';
export const getRejectedTransactionDeatilsByTime: string = '/api/webservices/show_rejected_transaction_details_by_time';
export const getFlightDataBySector: string = '/api/webservices/V2/getFlightDataBySector';
export const getFcmToken: string = '/api/webservices/save_fcm_token';
export const saveManagerHub: string = '/api/webservices/V2/save_manager_hub';
