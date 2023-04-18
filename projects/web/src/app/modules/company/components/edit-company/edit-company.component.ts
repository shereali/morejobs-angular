import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../../../../../common/includes/services/toast.service';
import {SpinnerService} from '../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {environment} from '../../../../../../../common/src/environments/environment';
import {EmployerAccountService} from '../../../../../../../common/includes/services/employer/employer-account.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss'],
})
export class EditCompanyComponent implements OnInit {
  submitAttempt = false;
  isLoading = true;

  myForm: FormGroup = {} as FormGroup;

  company: any = {};
  initialData: any = {};
  logo = '';

  selectedIndustryTypes: Array<{ id: number; title_en: string }> = [];
  apiUrl = environment.apiUrl;

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private ts: ToastService,
    private spinner: SpinnerService,
    private eas: EmployerAccountService,
    public router: Router) {
    this.prepareForm();
  }

  ngOnInit(): void {
    this.spinner.show('content_spinner');
    this.eas.editAccountInitiate().then((res: any) => {
      if (res.success) {
        this.company = res.data.company;
        this.initialData = res.data.initial_data;
        this.logo = this.company.logo;

        this.setFormWithValue();
        this.filteredIndustryTypes();
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('content_spinner');
    });
  }

  onSubmit(): void {
    this._selectedIndustryTypes.setValue(this.selectedIndustryTypes);

    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('save_btn_spinner');
      this.eas.editAccount(this.myForm.value).then((res: any) => {
        this.ts.apiMessage(res);
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('save_btn_spinner');
      });
    }
  }

  private prepareForm(): void {
    this.myForm = this.fb.group({
      title_bn: new FormControl(''),

      country_id: new FormControl(1, Validators.required),
      district_id: new FormControl('', Validators.required),
      thana_id: new FormControl('', Validators.required),

      address_en: new FormControl('', Validators.required),
      address_bn: new FormControl(''),

      industry_type_id: new FormControl(''),
      selected_industry_types: new FormControl([], Validators.required),
      about: new FormControl(''),
      trade_licence_no: new FormControl(''),
      rl_no: new FormControl(''),
      website: new FormControl(''),
      organization_type_id: new FormControl('', Validators.required),

      primary_contact: new FormControl('', Validators.required),
    });
  }

  private setFormWithValue(): void {
    this.myForm.get('title_bn')?.setValue(this.company.title_bn);

    this.myForm.get('country_id')?.setValue(this.company.country_id);
    this.myForm.get('district_id')?.setValue(this.company.district_id);
    this.myForm.get('thana_id')?.setValue(this.company.thana_id);

    this.myForm.get('address_en')?.setValue(this.company.address_en);
    this.myForm.get('address_bn')?.setValue(this.company.address_bn);
    this.myForm.get('about')?.setValue(this.company.about);
    this.myForm.get('trade_licence_no')?.setValue(this.company.trade_licence_no);
    this.myForm.get('rl_no')?.setValue(this.company.rl_no);
    this.myForm.get('website')?.setValue(this.company.website);
    this.myForm.get('organization_type_id')?.setValue(this.company.organization_type_id);
    this.myForm.get('primary_contact')?.setValue(this.company.primary_contact ? this.company.primary_contact.id : '');


    this.selectedIndustryTypes = this.company.industry_types;
  }

  resetAreaValidation(): void {
    this.districtIdControl.clearValidators();
    this.thanaIdControl.clearValidators();
    if (+this.countryIdControl.value === 1) {
      this.districtIdControl.setValidators(Validators.required);
      this.thanaIdControl.setValidators(Validators.required);
    }

    this.districtIdControl.updateValueAndValidity();
    this.thanaIdControl.updateValueAndValidity();
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

  uploadLogo(imageInput: any): void {
    const file: File | '' = imageInput ? imageInput.files[0] : '';
    this.submitAttempt = true;
    this.spinner.show('logo_btn_spinner');
    this.eas.uploadLogo(file).then(res => {
      this.ts.apiMessage(res);
      if (res.success) {
        this.logo = res.data.logo;
      }
    }).finally(() => {
      this.submitAttempt = false;
      this.spinner.hide('logo_btn_spinner');
    });
  }

  restoreImage(): void {
    this.logo = this.company.logo;
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
