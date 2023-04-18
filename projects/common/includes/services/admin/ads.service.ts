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
export class AdsService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public errorHandlerService: ErrorHandlerService) {
  }

  loadList(queryParams: {}): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/ads', {params: queryParams})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  initiateCreate(): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/ads/create')
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  save(data: any): Promise<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl + '/ads', data)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  delete(id: number): Promise<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.apiUrl + `/ads/${id}`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  changeStatus(id: number, status: number): Promise<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(this.apiUrl + `/ads/${id}`, {status})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  private handleError<T>(): any {
    return (error: any): Observable<T> => {
      return this.errorHandlerService.handleError(error);
    };
  }
}
