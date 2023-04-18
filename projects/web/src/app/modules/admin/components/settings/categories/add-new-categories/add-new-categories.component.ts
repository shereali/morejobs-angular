import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CategoriesService} from '../../../../../../../../../common/includes/services/admin/settings/categories.service';
import {SpinnerService} from '../../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../../../../../../../common/includes/services/toast.service';
import {CategoryModel} from '../../../../../../../../../common/includes/models/admin/settings/category';

@Component({
  selector: 'app-add-new-categories',
  templateUrl: './add-new-categories.component.html',
  styleUrls: ['./add-new-categories.component.scss'],
})
export class AddNewCategoriesComponent implements OnInit {
  isLoading = true;
  submitAttempt = false;
  mode = 'create';
  myForm: FormGroup = {} as FormGroup;

  initialData: {
    category_types: Array<{ id: number; title_en: string }>,
    tags: Array<{ id: number; title_en: string }>
  } = {
    category_types: [],
    tags: [],
  };

  constructor(
    private cs: CategoriesService,
    private spinner: SpinnerService,
    private ts: ToastService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddNewCategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryModel) {
    if (data) {
      this.mode = 'edit';
    }
    this.prepareForm(data);
  }

  ngOnInit(): void {
    this.spinner.show('category_modal_spinner');
    this.cs.initiateCreate().then((res) => {
      if (res.success) {
        this.initialData = res.data;
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('category_modal_spinner');
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('category_save_btn_spinner');
      this.cs.saveCategory(this.myForm.value).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.closeModal(res);
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('category_save_btn_spinner');
      });
    }
  }

  private prepareForm(data: CategoryModel | undefined): void {
    this.myForm = this.fb.group({
      title_en: new FormControl('', Validators.required),
      title_bn: new FormControl('', Validators.required),
      category_type_id: new FormControl('', Validators.required),
      tag_id: new FormControl('', Validators.required),
      id: new FormControl(null),
    });

    if (data) {
      this.myForm.get('title_en')?.setValue(data.title_en);
      this.myForm.get('title_bn')?.setValue(data.title_bn);
      this.myForm.get('category_type_id')?.setValue(data.category_type_id);
      this.myForm.get('tag_id')?.setValue(data.tag_id);
      this.myForm.get('id')?.setValue(data.id);
    }
  }

  closeModal(res = ''): any {
    this.dialogRef.close(res);
  }

}
