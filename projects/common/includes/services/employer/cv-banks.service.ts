import {Injectable} from '@angular/core';
import {ApiResponse} from '../../models/common';
import {ErrorHandlerService} from '../error-handler.service';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CvBanksService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public errorHandlerService: ErrorHandlerService) {
  }

  initiateCVBanks(): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/cv-banks')
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  cvBankList(queryParams: any | {}, id: number): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + `/cv-bank-list/${id}`, {params: queryParams})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  decrementCvSubscription(): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + `/cv-bank-subscription-decrement`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  // initiate(packageTypeId: string | null = null): Promise<ApiResponse<any>> {
  //   let queryParams = {};
  //   if (packageTypeId) {
  //     queryParams = {package_type_id: packageTypeId};
  //   }
  //   return this.http.get<ApiResponse<any>>(this.apiUrl + '/packages/initiate', {params: queryParams})
  //     .pipe(catchError(this.handleError<ApiResponse<any>>()))
  //     .toPromise();
  // }
  //
  // subscribePackage(formData: any): Promise<ApiResponse<any>> {
  //   return this.http.post<ApiResponse<any>>(this.apiUrl + '/packages/subscribe', formData)
  //     .pipe(catchError(this.handleError<ApiResponse<any>>()))
  //     .toPromise();
  // }
  //
  // cancelSubscription(formData: any): Promise<ApiResponse<any>> {
  //   return this.http.post<ApiResponse<any>>(this.apiUrl + '/packages/subscribe-cancel', formData)
  //     .pipe(catchError(this.handleError<ApiResponse<any>>()))
  //     .toPromise();
  // }
  //
  // subscribedList(): Promise<ApiResponse<any>> {
  //   return this.http.get<ApiResponse<any>>(this.apiUrl + '/packages/subscribed-list')
  //     .pipe(catchError(this.handleError<ApiResponse<any>>()))
  //     .toPromise();
  // }

  private handleError<T>(): any {
    return (error: any): Observable<T> => {
      console.log(error);
      return this.errorHandlerService.handleError(error);
    };
  }
}
