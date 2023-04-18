import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CompanyModel} from '../../../../../../../../common/includes/models/admin/company';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {AuthService} from '../../../../../../../../common/includes/services/auth.service';
import {CompaniesService} from '../../../../../../../../common/includes/services/admin/companies.service';
import {requiredFileType} from '../../../../../components/upload-resume/upload-resume.component';
import {COMPANY_SIDES} from '../../../../../../../../common/includes/utilities/staticValue';

@Component({
  selector: 'app-add-new-company',
  templateUrl: './add-new-company.component.html',
  styleUrls: ['./add-new-company.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewCompanyComponent implements OnInit {
  employeeSizes = COMPANY_SIDES;

  myForm: FormGroup = {} as FormGroup;
  submitAttempt = false;
  isLoading = true;
  mode = 'create';
  newImageTake = true;
  applicableImageTypes = ['jpg', 'png', 'jpeg'];

  initialData: any = {};

  selectedIndustryTypes: Array<{ id: number; title_en: string; title_bn: string }> = [];

  constructor(
    public fb: FormBuilder,
    private ts: ToastService,
    private spinner: SpinnerService,
    private authService: AuthService,
    private cs: CompaniesService,
    public dialogRef: MatDialogRef<AddNewCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyModel) {
    if (data) {
      this.mode = 'edit';
    }
    this.prepareForm(data);
  }

  ngOnInit(): void {
    this.spinner.show('create_company_spinner');
    this.authService.initiateEmployerRegister().then((res: any) => {
      if (res.success) {
        this.initialData = res.data;
        this.filteredIndustryTypes();
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('create_company_spinner');
    });
  }

  onSubmit(): void {
    this._selectedIndustryTypes.setValue(this.selectedIndustryTypes);

    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('company_save_btn_spinner');

      const formData = new FormData();
      Object
        .keys(this.myForm.value)
        .filter(key => this.myForm.value[key])
        .forEach(key => {
          formData.append(key, this.myForm.value[key]);
        });
      formData.append('file', this.myForm.get('fileSource')?.value);
      formData.append('selected_industry_types', JSON.stringify(this.selectedIndustryTypes));

      this.cs.saveCompany(formData).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.closeModal(res);
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('company_save_btn_spinner');
      });
    }
  }

  filteredIndustryTypes(key: string = ''): any {
    let filteredIndustryTypes = [];
    const selectedIndustryType = +this.industryTypeIdControl.value;

    if (selectedIndustryType) {
      filteredIndustryTypes = this.initialData.industry_types.find((x: any) => x.id === selectedIndustryType).sub_industry_types;
    } else {
      filteredIndustryTypes = this.initialData.industry_types.reduce((acc: any, obj: any) => {
        return [...acc, ...obj.sub_industry_types];
      }, []);
    }

    return filteredIndustryTypes;
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }
  }

  onClickImageChange(): void {
    this.newImageTake = true;

    this.myForm.get('file')?.setValidators(Validators.required);
    this.myForm.get('file')?.updateValueAndValidity();
  }

  onChangeIndustryType(item: any, e: any): void {
    const index: number = this.selectedIndustryTypes.findIndex((x: any) => x.id === item.id);

    if (e.target.checked && index === -1) {
      this.selectedIndustryTypes.push(item);
    } else if (index !== -1) {
      this.selectedIndustryTypes.splice(index, 1);
    }
  }

  isChecked(item: any): boolean {
    const index = this.selectedIndustryTypes.findIndex((x: any) => x.id === item.id);
    return index !== -1;
  }

  removeItem(i: number): void {
    this.selectedIndustryTypes.splice(i, 1);
  }

  private prepareForm(data: CompanyModel | undefined): void {
    this.myForm = this.fb.group({
      title_en: new FormControl('', Validators.required),
      title_bn: new FormControl(''),

      year_establishment: new FormControl('', [Validators.minLength(4), Validators.pattern('^[0-9]*$')]),
      company_size: new FormControl(''),

      country_id: new FormControl(1),
      district_id: new FormControl('', Validators.required),
      thana_id: new FormControl('', Validators.required),
      address_en: new FormControl('', Validators.required),
      address_bn: new FormControl(''),
      industry_type_id: new FormControl(''),
      selected_industry_types: new FormControl([], Validators.required),
      about: new FormControl(''),
      website: new FormControl(''),
      organization_type_id: new FormControl('', Validators.required),

      file: new FormControl('', [Validators.required, requiredFileType(this.applicableImageTypes)]),
      fileSource: new FormControl(''),

      mode: new FormControl(this.mode, Validators.required),
      id: new FormControl(null),
    });

    if (data) {
      this.myForm.get('title_en')?.setValue(data.title_en);
      this.myForm.get('title_bn')?.setValue(data.title_bn);

      this.myForm.get('year_establishment')?.setValue(data.year_establishment);
      this.myForm.get('company_size')?.setValue(data.company_size);

      this.myForm.get('district_id')?.setValue(data.area.parent_id);
      this.myForm.get('thana_id')?.setValue(data.area.id);

      this.myForm.get('address_en')?.setValue(data.address_en);
      this.myForm.get('address_bn')?.setValue(data.address_bn);
      this.myForm.get('about')?.setValue(data.about);
      this.myForm.get('website')?.setValue(data.website);
      this.myForm.get('organization_type_id')?.setValue(data.organization_type_id);
      this.myForm.get('selected_industry_types')?.setValue(data.industry_types);

      this.myForm.get('file')?.clearValidators();
      this.myForm.get('file')?.updateValueAndValidity();

      this.myForm.get('id')?.setValue(data.id);

      this.selectedIndustryTypes = data.industry_types;
      this.newImageTake = false;
    }
  }

  closeModal(response = ''): void {
    this.dialogRef.close(response);
  }

  get bdDistricts(): Array<any> {
    return this.initialData.countries.find((x: { id: number; title_en: string }) => x.id === 1).districts;
  }

  get bdThanas(): Array<any> {
    const selectedDistrict = this.districtIdControl.value;

    if (selectedDistrict) {
      return this.bdDistricts.find((x: { id: number; title_en: string }) => x.id === +this.districtIdControl.value).thanas;
    }
    return [];
  }


  get countryIdControl(): FormControl {
    return this.myForm.get('country_id') as FormControl;
  }

  get districtIdControl(): FormControl {
    return this.myForm.get('district_id') as FormControl;
  }

  get thanaIdControl(): FormControl {
    return this.myForm.get('thana_id') as FormControl;
  }

  get industryTypeIdControl(): FormControl {
    return this.myForm.get('industry_type_id') as FormControl;
  }

  get _selectedIndustryTypes(): FormControl {
    return this.myForm.get('selected_industry_types') as FormControl;
  }
}
