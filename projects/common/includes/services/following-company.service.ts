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
export class FollowingCompanyService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public errorHandlerService: ErrorHandlerService) {
  }

  followingCompanyList(queryParams: {}): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/my-activity/favorite-companies', {params: queryParams})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  unfollowCompany(id: number): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + `/my-activity/favorite-companies/${id}/unfollow-company`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  followCompany(id: number): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + `/my-activity/unfollowed-companies/${id}/follow-company`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  private handleError<T>(): any {
    return (error: any): Observable<T> => {
      return this.errorHandlerService.handleError(error);
    };
  }
}
