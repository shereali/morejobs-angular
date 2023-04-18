import {Component} from '@angular/core';
import {AuthService} from '../../../../../../common/includes/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import {ToastService} from '../../../../../../common/includes/services/toast.service';
import {SpinnerService} from '../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ApiResponse} from '../../../../../../common/includes/models/common';
import {Observable, Subject, timer} from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  step1Form: FormGroup = {} as FormGroup;
  step2Form: FormGroup = {} as FormGroup;
  step3Form: FormGroup = {} as FormGroup;

  mode: 'step1' | 'step2' | 'step3' = 'step1';

  showPass = false;

  timer: undefined;

  submitAttempt = false;

  constructor(
    private ts: ToastService,
    private spinner: SpinnerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    public cookie: CookieService,
    public router: Router) {
    this.prepareStep1Form();
  }

  prepareStep1Form(): void {
    this.step1Form = this.fb.group({
      username: ['', Validators.required],
    });
  }

  async step1Submit(): Promise<any> {
    if (this.step1Form.valid) {
      this.submitAttempt = true;
      this.spinner.show('step1');

      await this.authService.forgotPassword(this.step1Form.value).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.mode = 'step2';
          this.prepareStep2Form();
          this.step2Form.get('username')?.setValue(res.data.username);
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('step1');
      });
    }
  }

  /**
   * ------
   * Step 2
   * ------
   * User will give security code here from email/phone
   */
  prepareStep2Form(): void {
    this.step2Form = this.fb.group({
      username: ['', Validators.required],
      code: ['', Validators.required],
    });
  }


  /**
   * When code is submitted
   */

  step2Submit(): void {
    this.submitAttempt = true;
    this.spinner.show('step2');
    this.authService.verifyCodeForForgetPassword(this.step2Form.value).then((res: ApiResponse<any>) => {
      if (res.success) {
        this.mode = 'step3';
        this.prepareStep3Form();
        this.step3Form.get('code')?.setValue(this.step2Form.get('code')?.value);
      } else {
        this.ts.apiMessage(res);
      }
    }).finally(() => {
      this.submitAttempt = false;
      this.spinner.hide('step2');
    });
  }

  /**
   * ------
   * Step 3
   * ------
   * User will give new password
   */
  prepareStep3Form(): void {
    this.step3Form = this.fb.group({
      password: ['', Validators.required],
      code: ['', Validators.required],
    });
  }

  /**
   * When finally user want to change password
   */
  async step3Submit(): Promise<any> {
    this.spinner.show('step3');
    this.submitAttempt = true;
    await this.authService.resetPassword(this.step3Form.value).then((res: ApiResponse<any>) => {
      this.ts.apiMessage(res);
      if (res.success) {
        this.router.navigate(['login']).then();
      }
    }).finally(() => {
      this.spinner.hide('step3');
    });
  }

  resendCode(): void {
    this.spinner.show('resendCode');
    this.authService.forgotPassword(this.step1Form.value)
      .then(() => {
        this.showTimer(1);
        this.ts.show('success', `Password reset code resent. `, 'Success');
      })
      .finally(() => this.spinner.hide('resendCode'));
  }

  showTimer(min: number): Observable<any> {
    const timerSub: Subject<string> = new Subject();
    let timerString = min + 'm : 00s';
    let second = 60;
    const source = timer(0, 1000).subscribe(() => {
      second--;
      const minString = (min - 1) ? (min - 1) + 'm : ' : '';
      timerString = minString + second + 's';
      if (second === 0) {
        min--;
        second = 60;
      }
      timerSub.next(timerString);
    });
    setTimeout(() => {
      timerSub.next('');
      timerSub.complete();
      source.unsubscribe();
    }, (min * 59000));
    return timerSub.asObservable();
  }
}
