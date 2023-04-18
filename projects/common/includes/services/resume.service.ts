import {Injectable} from '@angular/core';
import {ApiResponse} from '../models/common';
import {ErrorHandlerService} from './error-handler.service';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {environment} from '../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public errorHandlerService: ErrorHandlerService) {
  }

  async personalDetails(modeType: string, editOption: string, editType: string | null): Promise<ApiResponse<any>> {
    const queryParams: any = {
      mode: modeType,
      edit_option: editOption,
      edit_type: editType
    };
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/resume/edit', {params: queryParams})
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  saveResume(formValue: any): Promise<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl + '/resume/update', formValue)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  updateEmploymentExperience(formValue: any): Promise<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl + '/resume/update', formValue)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  updateSkill(formValue: any): Promise<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl + '/resume/update', formValue)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  updateData(formValue: any): Promise<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl + '/resume/update', formValue)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  deleteLanguage(id: number): Promise<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.apiUrl + `/resume/languages/${id}`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  deleteReference(id: number): Promise<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.apiUrl + `/resume/references/${id}`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  deleteEducation(id: number): Promise<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.apiUrl + `/resume/educations/${id}`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  deleteExperience(id: number): Promise<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.apiUrl + `/resume/experiences/${id}`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  deleteTraining(id: number): Promise<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.apiUrl + `/resume/trainings/${id}`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  deleteCertificate(id: number): Promise<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(this.apiUrl + `/resume/certificates/${id}`)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  uploadAvatar(image: File | '', editOption: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('edit_option', editOption);

    return this.http.post(this.apiUrl + '/resume/update', formData)
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  async resumeDetails(): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/resume/show')
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  private handleError<T>(): any {
    return (error: any): Observable<T> => {
      return this.errorHandlerService.handleError(error);
    };
  }
}
