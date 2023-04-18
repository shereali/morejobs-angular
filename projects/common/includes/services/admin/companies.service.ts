import {Injectable} from '@angular/core';
import {ApiResponse} from '../../models/common';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../src/environments/environment';
import {catchError} from 'rxjs/operators';
import {ErrorHandlerService} from '../error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public errorHandlerService: ErrorHandlerService) {
  }

  initiateSummary(): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/companies-list-summary')
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  loadCompanyList(queryParams: {}): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/companies', {params: queryParams})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  saveCompany(data: any): Promise<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl + '/companies', data)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  changeStatus(id: number, status: number): Promise<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(this.apiUrl + `/companies/${id}`, {status})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  private handleError<T>(): any {
    return (error: any): Observable<T> => {
      return this.errorHandlerService.handleError(error);
    };
  }
}
