import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoriesService} from '../../../../../../../../../common/includes/services/admin/settings/categories.service';
import {SpinnerService} from '../../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../../../../common/includes/services/toast.service';
import {CategoryModel} from '../../../../../../../../../common/includes/models/admin/settings/category';
import {SkillsService} from '../../../../../../../../../common/includes/services/admin/settings/skills.service';

@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.component.html',
  styleUrls: ['./add-skills.component.scss'],
})
export class AddSkillsComponent  {
  submitAttempt = false;
  mode = 'create';
  myForm: FormGroup = {} as FormGroup;

  constructor(
    private ss: SkillsService,
    private spinner: SpinnerService,
    private ts: ToastService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddSkillsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id: number; title: string}) {
    if (data) {
      this.mode = 'edit';
    }
    this.prepareForm(data);
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('skill_save_btn_spinner');
      this.ss.saveSkill(this.myForm.value).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.closeModal(res);
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('skill_save_btn_spinner');
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
