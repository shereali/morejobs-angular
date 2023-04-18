import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../../../../common/includes/services/toast.service';
import {SpinnerService} from '../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {AuthService} from '../../../../../../common/includes/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  registerMode = '';
  submitAttempt = false;
  redirectUrl: string | undefined;

  categories: Array<{ id: number; title_en: string }> = [];

  generalRegForm = new FormGroup({
    registration_category: new FormControl('general'),
    name: new FormControl('', Validators.required),
    category_id: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    mobile_no: new FormControl('', Validators.required),
    set_username_as: new FormControl('email', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    gender_id: new FormControl('', Validators.required),
    agreed_term_condition: new FormControl('', Validators.required),
    is_subscribed_newsletter: new FormControl(''),
  });

  specialRegForm = new FormGroup({
    registration_category: new FormControl('special'),
    name: new FormControl('', Validators.required),
    category_id: new FormControl('', Validators.required),
    mobile_no: new FormControl('', Validators.required),
    set_username_as: new FormControl('mobile_no'),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    gender_id: new FormControl('', Validators.required),
  });

  disabledRegForm = new FormGroup({
    registration_category: new FormControl('disabled'),
    name: new FormControl('', Validators.required),
    category_id: new FormControl('', Validators.required),
    mobile_no: new FormControl('', Validators.required),
    set_username_as: new FormControl('mobile_no'),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    gender_id: new FormControl('', Validators.required),
  });

  constructor(
    private route: ActivatedRoute,
    private ts: ToastService,
    private spinner: SpinnerService,
    private authService: AuthService,
    public router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      this.redirectUrl = params.redirect_url;
    });
  }

  ngOnInit(): void {
    this.authService.initiateEmployeeRegister().then((res: any) => {
      if (res.success) {
        this.categories = res.data.categories;
      }
    }).finally(() => {
      this.submitAttempt = false;
      this.spinner.hide('register_btn_spinner');
    });
  }

  onSubmit(): void {
    const formValue = this.formValidate();

    if (formValue) {
      this.submitAttempt = true;
      this.spinner.show('register_btn_spinner');

      this.authService.employeeRegister(formValue).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          if (res.data.user.user_type.id === 1) {
            // redirect for super admin
          } else if (res.data.user.user_type.id === 2) {
            this.router.navigate([this.redirectUrl ? this.redirectUrl : '/home/edit-resume']).then();
          } else if (res.data.user.user_type.id === 3) {
            this.router.navigate([this.redirectUrl ? this.redirectUrl : '/company']);
          }
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('register_btn_spinner');
      });
    }
  }

  private formValidate(): any {
    if (this.registerMode === 'general' && this.generalRegForm.valid) {
      return this.generalRegForm.value;
    } else if (this.registerMode === 'special' && this.specialRegForm.valid) {
      return this.specialRegForm.value;
    } else if (this.registerMode === 'disabled' && this.disabledRegForm.valid) {
      return this.disabledRegForm.value;
    }
  }

  onChangeRegMode(mode: string): void {
    this.registerMode = mode;
  }
}
