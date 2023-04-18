import {Injectable} from '@angular/core';
import {ApiResponse} from '../../models/common';
import {ErrorHandlerService} from '../error-handler.service';
import {HttpClient} from '@angular/common/http';
import {catchError, share} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {environment} from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public errorHandlerService: ErrorHandlerService) {
  }

  initiate(): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/job-posts/initiate')
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  jobList(queryParams: {}): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/job-posts', {params: queryParams})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  updateDeadline(data: { deadline: string }, id: number): Promise<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(this.apiUrl + `/job-posts/${id}/update-deadline`, data)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }


  initiateJobPost(step: {}): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/job-posts/create', {params: step})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  savePost(step: string, formData: any, id: number | ''): Promise<ApiResponse<any>> {
    formData.step = step;
    formData.id = id;

    return this.http.post<ApiResponse<any>>(this.apiUrl + '/job-posts', formData)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  readyToProcess(id: number | ''): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + `/job-posts/${id}/ready-to-process`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  repost(id: number): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + `/job-posts/${id}/repost`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }


  /**
   * Applicant process
   * @private
   */
  loadApplicantProcessSummary(id: number): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + `/job-posts/${id}/applicant-process/summary`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  loadApplicantProcessApplicants(queryParams: any | {}, id: number): Promise<ApiResponse<any>> {
    const url = `/job-posts/${id}/applicant-process/applicants`;

    return this.http.get<ApiResponse<any>>(this.apiUrl + url, {params: queryParams})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  loadApplicantProcessJobPreview(queryParams: any | {}, id: number): Promise<ApiResponse<any>> {
    const url = `/job-posts/${id}/applicant-process/preview`;

    return this.http.get<ApiResponse<any>>(this.apiUrl + url, {params: queryParams})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }


  executeAction(id: number, status: number): Promise<ApiResponse<any>> {
    const url = `/job-posts/applicants/${id}/change-status`;

    return this.http.put<ApiResponse<any>>(this.apiUrl + url, {status})
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
