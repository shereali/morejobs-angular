import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SpinnerService} from '../../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../../../../common/includes/services/toast.service';
import {AreasService} from '../../../../../../../../../common/includes/services/admin/settings/areas.service';
import {AreaModel} from '../../../../../../../../../common/includes/models/admin/settings/area';

@Component({
  selector: 'app-add-skills',
  templateUrl: './add-area.component.html',
  styleUrls: ['./add-area.component.scss'],
})
export class AddAreaComponent {
  submitAttempt = false;
  mode = 'create';
  myForm: FormGroup = {} as FormGroup;

  constructor(
    private as: AreasService,
    private spinner: SpinnerService,
    private ts: ToastService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: AreaModel, mode: string, countries: Array<{ id: number; title: string }> }) {
    this.mode = data.mode;

    this.prepareForm(data.data);
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('area_save_btn_spinner');
      this.as.saveItem(this.myForm.value).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.closeModal(res);
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('area_save_btn_spinner');
      });
    }
  }

  private prepareForm(data: AreaModel | undefined): void {
    this.myForm = this.fb.group({
      title_en: new FormControl('', Validators.required),
      title_bn: new FormControl('', Validators.required),
      country_id: new FormControl('', Validators.required),
      id: new FormControl(null),
      mode: new FormControl(this.mode),
    });

    if (data) {
      this.myForm.get('country_id')?.clearValidators();
      this.myForm.get('country_id')?.updateValueAndValidity();
      this.myForm.get('id')?.setValue(data.id);

      if (this.mode === 'edit') {
        this.myForm.get('title_en')?.setValue(data.title_en);
        this.myForm.get('title_bn')?.setValue(data.title_bn);
      }
    }
  }

  closeModal(res = ''): any {
    this.dialogRef.close(res);
  }
}
