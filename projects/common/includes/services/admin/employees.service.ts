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
export class EmployeesService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public errorHandlerService: ErrorHandlerService) {
  }

  // initiateSummary(): Promise<ApiResponse<any>> {
  //   return this.http.get<ApiResponse<any>>(this.apiUrl + '/posts-list-summary')
  //     .pipe(catchError(this.handleError<ApiResponse<any>>()))
  //     .toPromise();
  // }

  loadList(queryParams: {}): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/employees', {params: queryParams})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  show(id: number): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + `/employees/${id}`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  private handleError<T>(): any {
    return (error: any): Observable<T> => {
      return this.errorHandlerService.handleError(error);
    };
  }
}
