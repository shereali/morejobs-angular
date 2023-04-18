import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../../../../../../../common/includes/services/toast.service';
import {SpinnerService} from '../../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {requiredFileType} from '../../../../../../components/upload-resume/upload-resume.component';
import {AdsModel, AdsPosition} from '../../../../../../../../../common/includes/models/admin/ads';
import {AdsService} from '../../../../../../../../../common/includes/services/admin/ads.service';

interface AdsInitiateModel {
  positions: Array<AdsPosition>;
  pages: Array<{
    key: string;
    id: number, title: string, position_ids: Array<number> }>;
}

@Component({
  selector: 'app-add-new-ads',
  templateUrl: './add-new-ads.component.html',
  styleUrls: ['./add-new-ads.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewAdsComponent implements OnInit {
  myForm: FormGroup = {} as FormGroup;
  submitAttempt = false;
  isLoading = true;
  mode = 'create';
  newImageTake = true;

  initialData: AdsInitiateModel = {} as AdsInitiateModel;

  constructor(
    public fb: FormBuilder,
    private ts: ToastService,
    private spinner: SpinnerService,
    private as: AdsService,
    public dialogRef: MatDialogRef<AddNewAdsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdsModel | undefined) {
    if (data) {
      this.mode = 'edit';
    }
    this.prepareForm(data);
  }

  ngOnInit(): void {
    this.spinner.show('create_ads_spinner');
    this.as.initiateCreate().then(res => {
      if (res.success) {
        this.initialData = res.data;
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('create_ads_spinner');
    });
  }

  filteredAdsPositions(): Array<AdsPosition> {
    const selectedPageKey = this.myForm.get('page')?.value;
    const selectedPagePositions = this.initialData.pages.find(x => x.key === selectedPageKey)?.position_ids;

    return this.initialData.positions.filter(position => selectedPagePositions?.includes(position.id));
  }

  onSubmit(): void {
    console.log(this.myForm);

    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('ads_save_btn_spinner');

      const formData = new FormData();
      Object
        .keys(this.myForm.value)
        .filter(key => this.myForm.value[key])
        .forEach(key => {
          formData.append(key, this.myForm.value[key]);
        });
      formData.append('file', this.myForm.get('fileSource')?.value);

      this.as.save(formData).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.closeModal(res);
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('ads_save_btn_spinner');
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

  private prepareForm(data: AdsModel | undefined): void {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    this.myForm = this.fb.group({
      position_id: new FormControl('', Validators.required),
      page: new FormControl(''),
      url: new FormControl('', [Validators.required, Validators.pattern(urlRegex)]),

      file: new FormControl('', [Validators.required, requiredFileType(['jpg', 'png', 'jpeg'])]),
      fileSource: new FormControl(''),

      id: new FormControl(null),
    });

    if (data) {
      this.myForm.get('position_id')?.setValue(data.position_id);
      this.myForm.get('page')?.setValue(data.page);
      this.myForm.get('url')?.setValue(data.url);
      this.myForm.get('id')?.setValue(data.id);

      this.myForm.get('file')?.clearValidators();
      this.myForm.get('file')?.updateValueAndValidity();

      this.newImageTake = false;
    }
  }

  closeModal(response = ''): void {
    this.dialogRef.close(response);
  }
}
