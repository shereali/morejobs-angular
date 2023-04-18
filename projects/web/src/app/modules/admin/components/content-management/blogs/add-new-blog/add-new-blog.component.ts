import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../../../../../../../common/includes/services/toast.service';
import {SpinnerService} from '../../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {requiredFileType} from '../../../../../../components/upload-resume/upload-resume.component';
import {BlogModel} from '../../../../../../../../../common/includes/models/admin/blog';
import {BlogService} from '../../../../../../../../../common/includes/services/admin/blog.service';
import {Editor} from 'ngx-editor';

@Component({
  selector: 'app-add-new-blog',
  templateUrl: './add-new-blog.component.html',
  styleUrls: ['./add-new-blog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewBlogComponent implements OnInit, OnDestroy {
  myForm: FormGroup = {} as FormGroup;
  formRules: Array<any> = [];
  submitAttempt = false;
  isLoading = true;
  mode = 'create';
  newImageTake = true;

  editor: Editor = {} as Editor;
  html: string = '' as string;

  constructor(
    public fb: FormBuilder,
    private ts: ToastService,
    private spinner: SpinnerService,
    private bs: BlogService,
    public dialogRef: MatDialogRef<AddNewBlogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: BlogModel; blog_type: string }) {
    if (data.data) {
      this.mode = 'edit';
    }
    this.prepareForm(data.data, data.blog_type);
  }

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('blog_save_btn_spinner');

      const formData = new FormData();
      Object
        .keys(this.myForm.value)
        .filter(key => this.myForm.value[key])
        .forEach(key => {
          formData.append(key, this.myForm.value[key]);
        });
      formData.append('file', this.myForm.get('fileSource')?.value);

      this.bs.save(formData).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.closeModal(res);
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('blog_save_btn_spinner');
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

  private prepareForm(data: BlogModel | undefined, blogType: string): void {
    this.myForm = this.fb.group({
      title: new FormControl('', Validators.required),
      subtitle: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),

      file: new FormControl('', [Validators.required, requiredFileType(['jpg', 'png', 'jpeg'])]),
      fileSource: new FormControl(''),

      blog_type: new FormControl(blogType, Validators.required),
      id: new FormControl(null),
    });

    if (data) {
      this.myForm.get('title')?.setValue(data.title);
      this.myForm.get('subtitle')?.setValue(data.subtitle);
      this.myForm.get('description')?.setValue(data.description);
      this.myForm.get('id')?.setValue(data.id);

      this.myForm.get('file')?.clearValidators();
      this.myForm.get('file')?.updateValueAndValidity();

      if (data.cover_image) {
        this.newImageTake = false;
      }
    }

    this.applyFormValidationRules(blogType);
  }

  applyFormValidationRules(type = 'articles'): void {
    if (type === 'articles') {
      this.myForm.get('file')?.clearValidators();
      this.myForm.get('file')?.updateValueAndValidity();
    }
  }

  applyAsteriskSymbol(field = ''): string {
    const errorObj = this.myForm.get(field)?.errors || {};

    if (errorObj.hasOwnProperty('required') && errorObj.required === true) {
      return '*';
    }
    return '';
  }

  closeModal(response = ''): void {
    this.dialogRef.close(response);
  }
}
