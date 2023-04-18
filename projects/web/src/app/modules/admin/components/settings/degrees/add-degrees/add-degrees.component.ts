import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoriesService} from '../../../../../../../../../common/includes/services/admin/settings/categories.service';
import {SpinnerService} from '../../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../../../../common/includes/services/toast.service';
import {CategoryModel} from '../../../../../../../../../common/includes/models/admin/settings/category';
import {DegreesService} from '../../../../../../../../../common/includes/services/admin/settings/degrees.service';
import {DegreeModel} from '../../../../../../../../../common/includes/models/admin/degree';

@Component({
  selector: 'app-add-degrees',
  templateUrl: './add-degrees.component.html',
  styleUrls: ['./add-degrees.component.scss'],
})
export class AddDegreesComponent implements OnInit {
  isLoading = true;
  submitAttempt = false;
  mode = 'create';
  myForm: FormGroup = {} as FormGroup;

  initialData: { education_levels: Array<{ id: number; title: string }> } = {education_levels: []};

  constructor(
    private ds: DegreesService,
    private spinner: SpinnerService,
    private ts: ToastService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDegreesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DegreeModel) {
    if (data) {
      this.mode = 'edit';
    }
    this.prepareForm(data);
  }

  ngOnInit(): void {
    this.spinner.show('degree_modal_spinner');
    this.ds.initiateCreateDegree().then((res) => {
      if (res.success) {
        this.initialData = res.data;
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('degree_modal_spinner');
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('degree_save_btn_spinner');
      this.ds.saveDegree(this.myForm.value).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.closeModal(res);
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('degree_save_btn_spinner');
      });
    }
  }

  private prepareForm(data: DegreeModel | undefined): void {
    this.myForm = this.fb.group({
      title: new FormControl('', Validators.required),
      education_level_id: new FormControl('', Validators.required),
      major_required: new FormControl(0, Validators.required),
      id: new FormControl(null),
    });

    if (data) {
      this.myForm.get('title')?.setValue(data.title);
      this.myForm.get('education_level_id')?.setValue(data.education_level_id);
      this.myForm.get('major_required')?.setValue(data.major_required);
      this.myForm.get('id')?.setValue(data.id);
    }
  }

  closeModal(res = ''): any {
    this.dialogRef.close(res);
  }


}
