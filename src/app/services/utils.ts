import { of } from 'rxjs';

export class ApiResponse {
  public status: boolean;
  public error: any;
  public data: any;
  public message: any;
}

export const handleResponse = (response) => {
  if (!response.hasOwnProperty('data') && !response.data) {
    throw new Error('Value expected!');
  }
  return response.data;
};

export const handleError = (error: any) => {
  const errorMessage = [];
  const errors: any = Object.keys(error.error.error);
  const checkVar = error.error.error;
  if (typeof checkVar === 'object') {
    errors.forEach(element => {
      errorMessage.push(error.error.error[element][0]);
    });
  } else {
    errorMessage.push(error.error.error);
  }
  const res = {} as ApiResponse;
  res.error = errorMessage;
  res.status = false;
  return of(res);
};

export const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
  'August', 'September', 'Oktober', 'November', 'Dezember'];

export const monthsNumbers = ['01', '02', '03', '04', '05', '06', '07',
  '08', '09', '10', '11', '12'];

export const timestampInMin = () => Math.floor(Date.now() / 1000 / 60);

export const fileUploadSize = 6291456;

export const nonce = 'KHsD(PF3JzQfT)nm3l^TERO';