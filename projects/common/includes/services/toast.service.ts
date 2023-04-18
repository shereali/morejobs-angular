import {Injectable} from '@angular/core';
import {ActiveToast, ToastrService} from 'ngx-toastr';
import {ApiResponse} from '../models/common';

type optionType = 'info' | 'success' | 'warning' | 'error';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  errorDuration = 5000;

  constructor(private toastr: ToastrService) {
  }


  show(option: optionType, message: string = '', title = '',
       duration: number = this.errorDuration, positionClass: string = ''): ActiveToast<any> {
    const override: any = {
      extendedTimeOut: duration || this.errorDuration,
      timeOut: duration || this.errorDuration
    };
    if (positionClass) {
      override.positionClass = positionClass;
    }
    const config: any = [message, title, override];

    switch (option) {
      case 'info':
        return this.toastr.info(...config);
      case 'success':
        return this.toastr.success(...config);
      case 'error':
        return this.toastr.error(...config);
      case 'warning':
        return this.toastr.warning(...config);
    }
  }

  apiMessage(res: ApiResponse<any>): void {
    if (res.success) {
      this.success(res.message);
    } else {
      if (res.errors && Object.entries(res.errors).length !== 0 && res.errors.constructor === Object) {
        const errors = res.errors;
        for (const key in errors) {
          if (errors && errors.hasOwnProperty(key)) {
            const singleError = errors[key];
            for (const k in singleError) {
              if (singleError && singleError.hasOwnProperty(k)) {
                this.error(singleError[k], 'Error');
              }
            }
          }
        }
      } else {
        this.error(res.message);
      }
    }
  }

  error(message: string = '', title: string = 'Error', duration: number = this.errorDuration, positionClass: string = ''): void {
    const override: any = {
      extendedTimeOut: duration || this.errorDuration,
      timeOut: duration || this.errorDuration
    };
    if (positionClass) {
      override.positionClass = positionClass;
    }
    this.toastr.error(message, title, override);
  }

  success(message: string = '', title: string = '', duration: number = this.errorDuration, positionClass: string = ''): void {
    const override: any = {
      extendedTimeOut: duration || this.errorDuration,
      timeOut: duration || this.errorDuration
    };
    if (positionClass) {
      override.positionClass = positionClass;
    }
    this.toastr.success(message, title, override);
  }
}
