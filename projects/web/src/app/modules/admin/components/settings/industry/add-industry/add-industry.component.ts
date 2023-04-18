import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SpinnerService} from '../../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../../../../common/includes/services/toast.service';
import {IndustryTypesService} from '../../../../../../../../../common/includes/services/admin/settings/industryTypes.service';
import {IndustryTypeModel} from '../industry.component';

@Component({
  selector: 'app-add-industry',
  templateUrl: './add-industry.component.html',
  styleUrls: ['./add-industry.component.scss'],
})
export class AddIndustryComponent {
  isLoading = true;
  submitAttempt = false;
  mode = 'create';
  myForm: FormGroup = {} as FormGroup;

  constructor(
    private its: IndustryTypesService,
    private spinner: SpinnerService,
    private ts: ToastService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddIndustryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IndustryTypeModel) {
    if (data) {
      this.mode = 'edit';
      if (!data.parent_id) {
        this.initiateEdit(data);
      } else {
        this.myForm = this.fb.group({
          title_en: new FormControl(data.title_en, Validators.required),
          title_bn: new FormControl(data.title_bn, Validators.required),
          id: new FormControl(data.id),
        });
      }
    } else {
      this.prepareForm(data);
    }
  }

  initiateEdit(item: IndustryTypeModel): void {
    this.spinner.show('modal_spinner');
    this.its.initiateEdit(item.id).then((res: any) => {
      if (res.success) {
        this.prepareForm(res.data);
      }
    }).finally(() => {
      this.spinner.hide('modal_spinner');
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('industry_type_save_btn_spinner');
      this.its.saveIndustryType(this.myForm.value).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.closeModal(res);
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('industry_type_save_btn_spinner');
      });
    }
  }

  private prepareForm(data: IndustryTypeModel | undefined): void {
    if (data) {
      this.myForm = this.fb.group({
        title_en: new FormControl(data.title_en, Validators.required),
        title_bn: new FormControl(data.title_bn, Validators.required),
        id: new FormControl(data.id),
        sub_industry_types: new FormArray([])
      });

      data.sub_industry_types.forEach(item => {
        this.subIndustryTypes.push(this.fb.group({
          title_en: new FormControl(item.title_en, Validators.required),
          title_bn: new FormControl(item.title_bn, Validators.required),
          id: new FormControl(item.id),
        }));
      });

    } else {
      this.myForm = this.fb.group({
        title_en: new FormControl('', Validators.required),
        title_bn: new FormControl('', Validators.required),
        sub_industry_types: this.fb.array([
          this.fb.group({
            title_en: new FormControl('', Validators.required),
            title_bn: new FormControl('', Validators.required),
          })
        ]),
        id: new FormControl(null),
      });
    }

    this.isLoading = false;
  }

  addItem(): void {
    this.subIndustryTypes.push(this.fb.group({
        title_en: new FormControl('', Validators.required),
        title_bn: new FormControl('', Validators.required),
      })
    );
  }

  removeItem(i: number): void {
    this.subIndustryTypes.removeAt(i);
  }

  closeModal(res = ''): any {
    this.dialogRef.close(res);
  }

  get subIndustryTypes(): FormArray {
    return this.myForm.get('sub_industry_types') as FormArray;
  }

}
