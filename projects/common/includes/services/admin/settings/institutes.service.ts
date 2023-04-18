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
export class InstitutesService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public errorHandlerService: ErrorHandlerService) {
  }

  loadList(queryParams: {}): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/settings/employer-change-password', {params: queryParams})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  saveInstitute(data: any): Promise<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl + '/settings/employer-change-password', data)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  deleteInstitute(id: number): Promise<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.apiUrl + `/settings/institutes/${id}`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  private handleError<T>(): any {
    return (error: any): Observable<T> => {
      return this.errorHandlerService.handleError(error);
    };
  }
}
