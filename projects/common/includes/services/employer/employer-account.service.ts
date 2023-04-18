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
export class EmployerAccountService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public errorHandlerService: ErrorHandlerService) {
  }

  editAccountInitiate(): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/account/edit-company')
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  editAccount(data: any): Promise<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl + '/account/edit-company', data)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  uploadLogo(image: File | ''): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', image);

    return this.http.post(this.apiUrl + '/account/company/upload-logo', formData)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  private handleError<T>(): any {
    return (error: any): Observable<T> => {
      console.log(error);
      return this.errorHandlerService.handleError(error);
    };
  }
}
