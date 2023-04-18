import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {PostsService} from '../../../../../../../../common/includes/services/admin/posts.service';
import {requiredFileType} from '../../../../../components/upload-resume/upload-resume.component';
import {PostModel} from '../../../../../../../../common/includes/models/admin/post';

@Component({
  selector: 'app-add-new-post',
  templateUrl: './add-new-post.component.html',
  styleUrls: ['./add-new-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewPostComponent implements OnInit {
  myForm: FormGroup = {} as FormGroup;
  submitAttempt = false;
  isLoading = true;
  mode = 'create';
  newImageTake = true;

  initialData: any = {};
  formattedGroupedCategories: Array<any> = [];

  constructor(
    public fb: FormBuilder,
    private ts: ToastService,
    private spinner: SpinnerService,
    private ps: PostsService,
    public dialogRef: MatDialogRef<AddNewPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PostModel) {
    if (data) {
      this.mode = 'edit';
    }
    this.prepareForm(data);
  }

  ngOnInit(): void {
    this.spinner.show('create_post_spinner');
    this.ps.createPostInitiate().then((res: any) => {
      if (res.success) {
        this.initialData = res.data;
        this.convertGroupCategories();
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('create_post_spinner');
    });
  }

  private convertGroupCategories(): void {
    const specialSkilledCategories = this.initialData.categories.filter((x: any) => x.category_type_id === 2);
    const functionalCategories = this.initialData.categories.filter((x: any) => x.category_type_id === 1 && x.tag_id === 1);
    const industrialCategories = this.initialData.categories.filter((x: any) => x.category_type_id === 1 && x.tag_id === 2);

    this.formattedGroupedCategories = [
      {
        label: 'Functional',
        items: functionalCategories
      },
      {
        label: 'Industrial',
        items: industrialCategories
      },
      {
        label: 'Special Skilled',
        items: specialSkilledCategories
      }
    ];
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('post_save_btn_spinner');

      const formData = new FormData();
      Object
        .keys(this.myForm.value)
        .filter(key => this.myForm.value[key])
        .forEach(key => {
          formData.append(key, this.myForm.value[key]);
        });
      formData.append('file', this.myForm.get('fileSource')?.value);

      this.ps.savePost(formData).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.closeModal(res);
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('post_save_btn_spinner');
      });
    }
  }

  onClickImageChange(): void {
    this.newImageTake = true;

    this.myForm.get('file')?.setValidators(Validators.required);
    this.myForm.get('file')?.updateValueAndValidity();
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }
  }

  private prepareForm(data: PostModel | undefined): void {
    this.myForm = this.fb.group({
      job_listing_type_id: new FormControl(4, Validators.required),
      company_id: new FormControl('', Validators.required),
      source: new FormControl(null, Validators.required),
      publish_date: new FormControl(null, Validators.required),
      deadline: new FormControl(null, Validators.required),
      file: new FormControl('', [Validators.required, requiredFileType(['jpg', 'png', 'jpeg'])]),
      fileSource: new FormControl(''),
      title: new FormControl('', Validators.required),
      category_id: new FormControl('', Validators.required),
      id: new FormControl(null),
    });

    if (data) {
      this.myForm.get('job_listing_type_id')?.setValue(data.job_listing_type_id);
      this.myForm.get('company_id')?.setValue(data.company_id);
      this.myForm.get('source')?.setValue(data.source);
      this.myForm.get('publish_date')?.setValue(data.publish_date);
      this.myForm.get('deadline')?.setValue(data.deadline);
      this.myForm.get('title')?.setValue(data.title);
      this.myForm.get('category_id')?.setValue(data.category_id);
      this.myForm.get('id')?.setValue(data.id);

      this.myForm.get('file')?.clearValidators();
      this.myForm.get('file')?.updateValueAndValidity();

      if (this.mode === 'edit' && data.job_listing_type_id === 1) {
        this.myForm.get('job_listing_type_id')?.disable();
      }

      if (data.job_listing_type_id === 1) { // for regular job remove validation of source, publish_date
        this.myForm.get('source')?.clearValidators();
        this.myForm.get('source')?.updateValueAndValidity();

        this.myForm.get('publish_date')?.clearValidators();
        this.myForm.get('publish_date')?.updateValueAndValidity();
      }

      this.newImageTake = false;
    }
  }

  closeModal(response = ''): void {
    this.dialogRef.close(response);
  }

  get filteredCompanies(): Array<any> {
    if (this.myForm.get('job_listing_type_id')?.value === 4) {
      return this.initialData.companies.filter((x: any) => x.organization_type_id === 1 || x.organization_type_id === 2);
    }
    return this.initialData.companies;
  }
}
