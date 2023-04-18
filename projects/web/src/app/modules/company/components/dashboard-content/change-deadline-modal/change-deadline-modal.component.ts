import {Component, Inject} from '@angular/core';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {JobPostService} from '../../../../../../../../common/includes/services/employer/job-post.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {JobPostModel} from '../../../../../../../../common/includes/models/employer/job-post';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiResponse} from '../../../../../../../../common/includes/models/common';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';

@Component({
  selector: 'app-change-deadline-modal',
  templateUrl: './change-deadline-modal.component.html',
  styleUrls: ['./change-deadline-modal.component.scss'],
})
export class ChangeDeadlineModalComponent {
  isFormSubmitted = false;

  myForm: FormGroup | any;

  constructor(
    private fb: FormBuilder,
    private jps: JobPostService,
    private spinner: SpinnerService,
    private ts: ToastService,
    public dialogRef: MatDialogRef<ChangeDeadlineModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: JobPostModel) {
    this.myForm = this.fb.group({
      deadline: [data.deadline, [Validators.required]],
    });
  }


  updateDeadline(): void {
    if (this.myForm.valid) {
      this.isFormSubmitted = true;
      this.spinner.show('change_deadline_btn_spinner');
      this.jps.updateDeadline(this.myForm.value, this.data.id).then(res => {
        this.spinner.hide('cancel_order_btn_spinner');
        this.ts.apiMessage(res);
        this.closeModal(res);
      }).finally(() => {
        this.isFormSubmitted = false;
        this.spinner.hide('change_deadline_btn_spinner');
      });
    }
  }


  get deadline(): FormControl {
    return this.myForm.get('deadline') as FormControl;
  }

  closeModal(response: ApiResponse<any> | string = ''): void {
    this.dialogRef.close(response);
  }
}
