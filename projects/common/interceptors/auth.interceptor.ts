import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../includes/services/auth.service';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private route: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = request.headers;
    const token = this.authService.getToken();
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    headers = headers.set('lang', this.route.url.substr(1, 2) === 'bn' ? 'bn' : 'en');

    const requestClone = request.clone({
      headers
    });
    return next.handle(requestClone);
  }
}
