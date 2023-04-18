import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastService} from './toast.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    public router: Router,
    public alert: ToastService,
    public cookieService: CookieService,
  ) {
  }

  handleError(error: HttpErrorResponse): Observable<never | any> {
    if (error.status === 0) {
      this.log('Internet connection error!').then(() => {
        this.redirectToHome();
      });
    } else if (error.status === 401) {
      this.log('Unauthorized').then(() => {
        this.clearCurrentStorage().then(() => {
          this.router.navigate(['/login']).then();
        });
      });
    } else if (error.status !== 200 && error.error.status === undefined) {
      this.log('Something went wrong!').then(() => {
        this.redirectToHome();
      });
    } else {
      this.log(error.error.message).then();
    }
    return of([]);
  }

  async log(msg: any): Promise<any> {
    // this.alert.show()
  }

  async clearCurrentStorage(): Promise<any> {
    this.cookieService.delete('access_token');
    this.cookieService.delete('refresh_token');
    this.cookieService.delete('refresh_before');
    this.cookieService.delete('user');
  }

  redirectToHome(): void {
    let url = '/';
    let user: any = this.cookieService.get('user');
    if (user.length > 0) {
      user = JSON.parse(user);
      switch (user.user_type.id) {
        case 1 :
          url = '/admin'; // admin
          break;
        case 2 :
          url = '/home'; // employee
          break;
        case 3 :
          url = '/company'; // employer
          break;
        default: {
          url = '/';
          break;
        }
      }
      this.router.navigate([url]).then();
    }
  }
}
