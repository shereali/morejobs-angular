import {AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EmployeesService} from '../../../../../../../../common/includes/services/admin/employees.service';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';
import {UserModel} from '../../../../../../../../common/includes/models/user';
import {environment} from '../../../../../../../../common/src/environments/environment';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent implements OnInit, AfterViewChecked {
  apiUrl = environment.apiUrl;
  isLoading = true;

  resumeDetail: any = {};

  constructor(
    private cdr: ChangeDetectorRef,
    private es: EmployeesService,
    private spinner: SpinnerService,
    private ts: ToastService,
    private dialogRef: MatDialogRef<EmployeeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserModel) {
  }

  ngOnInit(): void {
    this.spinner.show('details_modal_spinner');
    this.es.show(this.data.id).then((res) => {
      if (res.success) {
        this.resumeDetail = res.data;
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('details_modal_spinner');
    });
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  convertedArrayToString(items: Array<[]>, title: string, delimiter: string = ', '): string {
    return Array.prototype.map.call(items, x => {
      return x[title];
    }).join(delimiter);
  }

  closeModal(res = ''): any {
    this.dialogRef.close(res);
  }
}
