import {Injectable} from '@angular/core';
import {ApiResponse} from '../../../models/common';
import {ErrorHandlerService} from '../../error-handler.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../src/environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UploadResumeService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public errorHandlerService: ErrorHandlerService) {
  }

  loadUploadedResume(): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/resume/file/show')
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  public uploadResumeFile(file: File | any): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.apiUrl + '/resume/upload', formData)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  public deleteResumeFile(): Promise<ApiResponse<any>> {
    return this.http.delete(this.apiUrl + '/resume/delete')
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  async downloadResumeFile(): Promise<HttpResponse<Blob>> {
    return await this.http.get<Blob>(this.apiUrl + '/resume/download', {
      observe: 'response',
      responseType: 'blob' as 'json'
    }).toPromise();
  }

  private handleError<T>(): any {
    return (error: any): Observable<T> => {
      return this.errorHandlerService.handleError(error);
    };
  }
}
