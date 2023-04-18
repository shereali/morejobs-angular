import {Injectable} from '@angular/core';
import {ApiResponse} from '../models/common';
import {ErrorHandlerService} from './error-handler.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../src/environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UnfollowedCompanyService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public errorHandlerService: ErrorHandlerService) {
  }

  initiateFilter(): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/my-activity/unfollowed-companies/initiateFilters')
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  unfollowedCompanyList(queryParams: {}): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/my-activity/unfollowed-companies', {params: queryParams})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  companyAvailableJobs(id: number): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + `/my-activity/unfollowed-companies/${id}/show`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  private handleError<T>(): any {
    return (error: any): Observable<T> => {
      return this.errorHandlerService.handleError(error);
    };
  }
}
