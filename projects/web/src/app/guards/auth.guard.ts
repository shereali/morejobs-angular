import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {SpinnerService} from '../../../../common/includes/shared/elements/spinner/spinner.service';
import {AuthService} from '../../../../common/includes/services/auth.service';
import {ErrorHandlerService} from '../../../../common/includes/services/error-handler.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  isLoggedIn: boolean = this.auth.isLoggedIn();

  constructor(
    private spinner: SpinnerService,
    private router: Router,
    private auth: AuthService,
    private eh: ErrorHandlerService,
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isLoggedIn) {
      let authorization: boolean;
      const user = this.auth.getUser();
      switch (user.user_type.id) {
        case 1 :
          authorization = this.checkExistence(state.url, 'admin');
          break;
        case 2 :
          authorization = this.checkExistence(state.url, 'home');
          break;
        case 3 :
          authorization = this.checkExistence(state.url, 'company');
          break;
        default: {
          authorization = false;
          break;
        }
      }
      if (authorization) {
        return true;
      } else {
        this.eh.redirectToHome();
        return false;
      }
    }
    this.router.navigate(['/login']).then();
    return false;
  }

  checkExistence(str: string, keyword: string): any {
    const re = new RegExp(keyword, 'gi');
    const result = str.search(re);
    if (result === -1) {
      return false;
    } else {
      return result === 1 || result === 4;
    }
  }
}


