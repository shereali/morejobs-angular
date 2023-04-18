import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {ApiResponse} from '../models/common';
import {ErrorHandlerService} from './error-handler.service';
import {HttpClient} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthData} from '../models/auth';
import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public cookieService: CookieService,
    public errorHandlerService: ErrorHandlerService) {
  }

  setCookie(name: string, value: string): void {
    const domain = environment.production ? '.' + environment.domain : 'localhost';
    const myDate = new Date();
    myDate.setMonth(myDate.getMonth() + 12);
    document.cookie = name + '=' + value + ';expires=' + myDate
      + ';domain=' + domain + ';path=/';
  }

  removeCookie(name: string): void {
    const path = '/';
    const domain = environment.production ? '.' + environment.domain : 'localhost';
    document.cookie = name + '=' +
      ((path) ? ';path=' + path : '') +
      ((domain) ? ';domain=' + domain : '') +
      ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }

  async login(user: User): Promise<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(this.apiUrl + '/login', user)
      .pipe(
        tap(async ({success, data}) => {
          if (success && data) {
            this.clearStorageForLogout();
            this.setCookie('access_token', data.access_token);
            this.setCookie('refresh_token', data.refresh_token);
            this.setCookie('refresh_before', data.expires_in);
            this.setCookie('user', JSON.stringify(data.user));
          }
        }),
        catchError(this.handleError<ApiResponse<AuthData>>())
      ).toPromise();
  }

  initiateEmployeeRegister(): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/initiate/employee-register')
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  employeeRegister(formData: any): Promise<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(this.apiUrl + '/employee-register', formData)
      .pipe(
        tap(async ({success, data}) => {
          if (success && data) {
            this.clearStorageForLogout();
            this.setCookieAfterLoggedIn(data);
          }
        }),
        catchError(this.handleError<ApiResponse<AuthData>>())
      ).toPromise();
  }

  initiateEmployerRegister(): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/initiate/employer-register')
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  employerRegister(formData: any): Promise<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(this.apiUrl + '/employer-register', formData)
      .pipe(
        tap(async ({success, data}) => {
          if (success && data) {
            this.clearStorageForLogout();
            this.setCookieAfterLoggedIn(data);

          }
        }),
        catchError(this.handleError<ApiResponse<AuthData>>())
      )
      .toPromise();
  }

  getToken(): string {
    return this.cookieService.get('access_token');
  }

  setCookieAfterLoggedIn(data: any): void {
    this.setCookie('access_token', data.access_token);
    this.setCookie('refresh_token', data.refresh_token);
    this.setCookie('refresh_before', data.expires_in);
    this.setCookie('user', JSON.stringify(data.user));
  }

  clearStorageForLogout(): void {
    this.removeCookie('access_token');
    this.removeCookie('refresh_token');
    this.removeCookie('refresh_before');
    this.removeCookie('user');
  }

  getUser(): any {
    const user = this.cookieService.get('user');
    return user ? JSON.parse(user) : false;
  }

  getUserInfo(): Promise<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/auth-user-info')
      .pipe(catchError(this.handleError<ApiResponse<any>>()))
      .toPromise();
  }

  isLoggedIn(): boolean {
    return (this.cookieService.get('access_token').length > 0 && this.cookieService.get('user').length > 0);
  }

  logOut(): Promise<ApiResponse<AuthData>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/account/logout')
      .pipe(
        tap(async ({success, data}) => {
          if (success) {
            this.clearStorageForLogout();
          }
        }),
        catchError(this.handleError<ApiResponse<AuthData>>())
      ).toPromise();
  }

  loggedOutFromAllDevices(): Promise<ApiResponse<AuthData>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/oauth-access-tokens/sign-out-from-all-devices')
      .pipe(
        tap(async ({success, data}) => {
          if (success) {
            this.clearStorageForLogout();
          }
        }),
        catchError(this.handleError<ApiResponse<AuthData>>())
      ).toPromise();
  }

  deleteAccount(): Promise<ApiResponse<AuthData>> {
    return this.http.get<ApiResponse<any>>(this.apiUrl + '/account/delete')
      .pipe(
        tap(async ({success, data}) => {
          if (success) {
            this.clearStorageForLogout();
          }
        }),
        catchError(this.handleError<ApiResponse<AuthData>>())
      ).toPromise();
  }

  async forgotPassword(data: {}): Promise<ApiResponse<any>> {
    return this.http.post<ApiResponse<AuthData>>(this.apiUrl + '/forgot-password', data)
      .toPromise();
  }

  async verifyCodeForForgetPassword(data: {}): Promise<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(this.apiUrl + '/verify-reset-password-code', data)
      .toPromise();
  }

  async resetPassword(data: {}): Promise<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(this.apiUrl + '/reset-password', data)
      .toPromise();
  }

  async changePassword(data: {}): Promise<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(this.apiUrl + '/account/change-password', data)
      .toPromise();
  }

  async changeUserID(data: {}): Promise<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(this.apiUrl + '/account/change-userid', data)
      .toPromise();
  }

  private handleError<T>(): any {
    return (error: any): Observable<T> => {
      return this.errorHandlerService.handleError(error);
    };
  }
}
