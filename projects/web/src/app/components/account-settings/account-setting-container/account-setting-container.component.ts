import {Component, OnInit} from '@angular/core';
import {ConfirmationDialogComponent} from '../../common/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SpinnerService} from '../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../common/includes/services/toast.service';
import {AuthService} from '../../../../../../common/includes/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account-setting-container',
  templateUrl: './account-setting-container.component.html',
  styleUrls: ['./account-setting-container.component.scss'],
})
export class AccountSettingContainerComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private ts: ToastService,
    private as: AuthService,
    public router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  signOutFromAllDevices(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.spinner.show('action_spinner');
        this.as.loggedOutFromAllDevices().then((res) => {
          this.ts.apiMessage(res);
          if (res.success) {
            this.as.clearStorageForLogout();
            this.router.navigate(['/login']).then();
          }
        }).finally(() => {
          this.spinner.hide('action_spinner');
        });
      }
    });
  }

  deleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.spinner.show('delete_account_action_spinner');
        this.as.deleteAccount().then((res) => {
          this.ts.apiMessage(res);
          if (res.success) {
            this.as.clearStorageForLogout();
            this.router.navigate(['/login']).then();
          }
        }).finally(() => {
          this.spinner.hide('delete_account_action_spinner');
        });
      }
    });
  }
}
