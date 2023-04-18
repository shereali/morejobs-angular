import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SkillsService} from '../../../../../../../../../common/includes/services/admin/settings/skills.service';
import {SpinnerService} from '../../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../../../../common/includes/services/toast.service';
import {InstitutesService} from '../../../../../../../../../common/includes/services/admin/settings/institutes.service';

@Component({
  selector: 'app-add-institutes',
  templateUrl: './add-institutes.component.html',
  styleUrls: ['./add-institutes.component.scss'],
})
export class AddInstitutesComponent {
  submitAttempt = false;
  mode = 'create';
  myForm: FormGroup = {} as FormGroup;

  constructor(
    private is: InstitutesService,
    private spinner: SpinnerService,
    private ts: ToastService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddInstitutesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id: number; title: string}) {
    if (data) {
      this.mode = 'edit';
    }
    this.prepareForm(data);
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('institute_save_btn_spinner');
      this.is.saveInstitute(this.myForm.value).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.closeModal(res);
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('institute_save_btn_spinner');
      });
    }
  }

  private prepareForm(data: {id: number; title: string} | undefined): void {
    this.myForm = this.fb.group({
      title: new FormControl('', Validators.required),
      id: new FormControl(null),
    });

    if (data) {
      this.myForm.get('title')?.setValue(data.title);
      this.myForm.get('id')?.setValue(data.id);
    }
  }

  closeModal(res = ''): any {
    this.dialogRef.close(res);
  }
}
