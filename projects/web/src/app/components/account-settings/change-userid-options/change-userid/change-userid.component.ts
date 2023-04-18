import {Component, OnInit} from '@angular/core';
import {User} from '../../../../../../../common/includes/models/user';
import {AuthService} from '../../../../../../../common/includes/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../../../../../common/includes/services/toast.service';
import {ApiResponse} from '../../../../../../../common/includes/models/common';
import {SpinnerService} from '../../../../../../../common/includes/shared/elements/spinner/spinner.service';

@Component({
  selector: 'app-change-userid',
  templateUrl: './change-userid.component.html',
  styleUrls: ['./change-userid.component.scss'],
})
export class ChangeUseridComponent implements OnInit {
  userTypeTitle = 'Email address';
  placeHolder = 'Type email address';
  type = 'email';
  public user: User = {} as User;
  myForm: FormGroup = {} as FormGroup;
  formSubmitted = false;

  constructor(
    private spinner: SpinnerService,
    private as: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toast: ToastService,
    public router: Router,) {
    this.user = this.as.getUser();
    const type = this.route.snapshot.queryParamMap.get('type');

    if (type === 'mobile') {
      this.type = type;
      this.userTypeTitle = 'Mobile Number';
      this.placeHolder = 'Type mobile number';
    }

    this.prepareForm();
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.spinner.show('save_btn_spinner');
      this.formSubmitted = true;

      this.as.changeUserID(this.myForm.value).then((res: ApiResponse<any>) => {
        this.toast.apiMessage(res);
        if (res.success) {
          this.as.clearStorageForLogout();
          this.router.navigate(['/login']).then();
        }
      }).finally(() => {
        this.formSubmitted = false;
        this.spinner.hide('save_btn_spinner');
      });
    }
  }

  prepareForm(): void {
    let usernameConfig = ['', [Validators.required, Validators.email]];
    if (this.type === 'mobile') {
      usernameConfig = ['', [Validators.required]];
    }
    this.myForm = this.fb.group({
      username: usernameConfig,
      password: ['', Validators.required]
    });
  }
}
