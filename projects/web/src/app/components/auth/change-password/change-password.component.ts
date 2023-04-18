import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SpinnerService} from '../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../common/includes/services/toast.service';
import {AuthService} from '../../../../../../common/includes/services/auth.service';
import {ApiResponse} from '../../../../../../common/includes/models/common';
import {ConfirmationDialogComponent} from '../../common/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
  formSubmitted = false;
  showPass = false;

  myForm: FormGroup = {} as FormGroup;

  constructor(
    private as: AuthService,
    public router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private fb: FormBuilder,
    private toast: ToastService,
    private authService: AuthService,
  ) {
    this.prepareForm();
  }

  prepareForm(): void {
    this.myForm = this.fb.group({
      current_password: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);
      dialogRef.componentInstance.confirmMessage = `This will take into login page`;
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.spinner.show('save_btn_spinner');
          this.formSubmitted = true;

          this.authService.changePassword(this.myForm.value).then((res: ApiResponse<any>) => {
            this.toast.apiMessage(res);
            if (res.success) {
              this.as.logOut().then(loggedOut => {
                if (loggedOut.success) {
                  this.router.navigate(['/login']).then();
                }
              });
            }
          }).finally(() => {
            this.formSubmitted = false;
            this.spinner.hide('save_btn_spinner');
          });
        }
      });
    }
  }
}
