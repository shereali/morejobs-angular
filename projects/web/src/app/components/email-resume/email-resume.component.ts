import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../common/src/environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {SpinnerService} from '../../../../../common/includes/shared/elements/spinner/spinner.service';
import {AuthService} from '../../../../../common/includes/services/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserModel} from '../../../../../common/includes/models/user';
import {ViewResumeService} from '../../../../../common/includes/services/employees/resume/view-resume.service';
import {ToastService} from '../../../../../common/includes/services/toast.service';

@Component({
  selector: 'app-email-resume',
  templateUrl: './email-resume.component.html',
  styleUrls: ['./email-resume.component.scss'],
})
export class EmailResumeComponent implements OnInit {
  apiUrl = environment.apiUrl;
  loading = true;
  submitAttempt = false;

  myForm: FormGroup = {} as FormGroup;
  user: UserModel = {} as UserModel;

  constructor(
    private fb: FormBuilder,
    private as: AuthService,
    private vrs: ViewResumeService,
    private ts: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: SpinnerService) {
    this.prepareForm();
  }

  ngOnInit(): void {
    this.spinner.show('email_resume_spinner');
    this.as.getUserInfo().then(res => {
      if (res.success === true) {
        this.user = res.data;
        this.setFormWithDefaultData();
      }
    }).finally(() => {
      this.loading = false;
      this.spinner.hide('email_resume_spinner');
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('email_resume_btn_spinner');

      this.vrs.emailResume(this.myForm.value).then(res => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.resetForm();
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('email_resume_btn_spinner');
      });
    } else {
      console.log(this.myForm);
    }
  }

  private resetForm(): void {
    this.myForm.get('company_email')?.setValue('');
    this.myForm.get('subject')?.setValue('');
    this.myForm.get('body')?.setValue('');
    this.myForm.get('attachment_type')?.setValue('details');
  }

  private prepareForm(): void {
    this.myForm = this.fb.group({
      email: new FormControl(''),
      modified_email: new FormControl('', [Validators.required, Validators.email]),
      company_email: new FormControl('', [Validators.required, Validators.email]),
      subject: new FormControl('', Validators.required),
      body: new FormControl(''),
      attachment_type: new FormControl('details'),
    });
  }

  private setFormWithDefaultData(): void {
    if (this.user && this.user.contact_emails.length > 0) {
      this.myForm.get('email')?.setValue(`${this.user.first_name} <${this.user.contact_emails[0].title}>`);

      this.updateModifiedEmailField();
    }
  }

  updateModifiedEmailField(): void {
    const emailFieldValue = this.myForm.get('email')?.value;

    const regex = /[^< ]+(?=>)/g; // The actual regex
    const matches = regex.exec(emailFieldValue);

    if (matches && matches.length > 0) {
      console.log('lop', matches);
      this.myForm.get('modified_email')?.setValue(matches[0]);
    } else {
      this.myForm.get('modified_email')?.setValue(emailFieldValue);
    }

    console.log(this.myForm.get('modified_email')?.value);
  }
}
