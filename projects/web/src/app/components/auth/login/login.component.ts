import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../../../common/includes/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import {ToastService} from '../../../../../../common/includes/services/toast.service';
import {SpinnerService} from '../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {UserModel} from '../../../../../../common/includes/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  submitAttempt = false;
  redirectUrl = null;
  isLoaded = false;

  constructor(
    private ts: ToastService,
    private spinner: SpinnerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    public cookie: CookieService,
    public router: Router) {
    this.myForm = fb.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
    this.route.queryParams.subscribe(params => {
      this.redirectUrl = params.redirect_url;
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.redirectToDashboard(this.authService.getUser());
    } else {
      this.cookie.deleteAll(); // clear the storage
      this.isLoaded = true;
    }
  }

  async save(): Promise<any> {
    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('login_btn_spinner');
      await this.authService.login(this.myForm.value).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.redirectToDashboard(res.data.user);
        } else {
          console.log('Not reloading....', res);
          // window.location.reload();
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('login_btn_spinner');
      });
    }
  }

  redirectToDashboard(user: UserModel): void {
    const userTypeId = user.user_type.id;

    if (userTypeId === 1) {
      this.router.navigate([this.redirectUrl ? this.redirectUrl : '/admin/home']).then();

    } else if (userTypeId === 2) {
      if (user.resume_completed) {
        this.router.navigate([this.redirectUrl ? this.redirectUrl : '/home']).then();
      } else {
        this.router.navigate([this.redirectUrl ? this.redirectUrl : '/home/edit-resume']).then();
      }
    } else if (userTypeId === 3) {
      this.router.navigate([this.redirectUrl ? this.redirectUrl : '/company'], {queryParams: {status: 'posted'}}).then();

    } else {
      window.location.reload();
    }
  }
}
