import {Injectable} from '@angular/core';
import {ApiResponse} from '../../../models/common';
import {ErrorHandlerService} from '../../error-handler.service';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {environment} from '../../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewResumeService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public errorHandlerService: ErrorHandlerService) {
  }


  resumeDetails(id: number): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + `/resume/${id}/show`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  emailResume(data: any): Promise<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl + '/resume/sent-email', data)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  private handleError<T>(): any {
    return (error: any): Observable<T> => {
      return this.errorHandlerService.handleError(error);
    };
  }
}
