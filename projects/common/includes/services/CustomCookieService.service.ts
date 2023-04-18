import {Injectable} from '@angular/core';
import {environment} from '../../src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CustomCookieServiceService {
  constructor() {
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

}
