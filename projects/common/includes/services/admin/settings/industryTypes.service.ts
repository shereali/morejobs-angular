import {Injectable} from '@angular/core';
import {ApiResponse} from '../../../models/common';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../src/environments/environment';
import {catchError} from 'rxjs/operators';
import {ErrorHandlerService} from '../../error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class IndustryTypesService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public errorHandlerService: ErrorHandlerService) {
  }

  initiateFilters(): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/settings/industry-types-initiate-filters')
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  loadList(queryParams: {}): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/settings/industry-types', {params: queryParams})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  initiateEdit(id: number): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + `/settings/industry-types/${id}/edit`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  saveIndustryType(data: any): Promise<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl + '/settings/industry-types', data)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  deleteIndustryType(id: number): Promise<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.apiUrl + `/settings/industry-types/${id}`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  private handleError<T>(): any {
    return (error: any): Observable<T> => {
      return this.errorHandlerService.handleError(error);
    };
  }
}
