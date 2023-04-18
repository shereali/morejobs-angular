import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../../../../common/includes/services/toast.service';
import {SpinnerService} from '../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {AuthService} from '../../../../../../common/includes/services/auth.service';
import {environment} from '../../../../../../common/src/environments/environment';
import {COMPANY_SIDES} from '../../../../../../common/includes/utilities/staticValue';

@Component({
  selector: 'app-employer-reg',
  templateUrl: './employer-reg.component.html',
  styleUrls: ['./employer-reg.component.scss'],
})
export class EmployerRegComponent implements OnInit {
  employeeSizes = COMPANY_SIDES;
  myForm: FormGroup = {} as FormGroup;
  submitAttempt = false;
  isLoading = true;

  initialData: any = {};
  selectedIndustryTypes: Array<{ id: number; title_en: string }> = [];
  apiUrl = environment.apiUrl;


  serverSideValidations = {
    username: {invalid: false, message: ''}
  };

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private ts: ToastService,
    private spinner: SpinnerService,
    private authService: AuthService,
    public router: Router) {
    this.prepareForm();
  }

  ngOnInit(): void {
    this.authService.initiateEmployerRegister().then((res: any) => {
      if (res.success) {
        this.initialData = res.data;


        this.filteredIndustryTypes();
      }
    }).finally(() => {
      this.isLoading = false;
    });
  }

  onSubmit(): void {
    this._selectedIndustryTypes.setValue(this.selectedIndustryTypes);

    console.log(this.myForm);

    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('register_btn_spinner');
      this.authService.employerRegister(this.myForm.value).then((res: any) => {
        this.ts.apiMessage(res);
        if (res.success) {
          if (res.data.user.user_type.id === 3) {
            this.router.navigate(['/company']);
          }
        } else if (!res.success) {
          const errors = res.errors;
          for (const key in res.errors) {
            if (errors && errors.hasOwnProperty(key)) {
              const singleError = errors[key];
              for (const k in singleError) {
                if (singleError && singleError.hasOwnProperty(k)) {
                  console.log(key);
                  console.log(singleError[k]);
                  if (key === 'username') {
                    this.serverSideValidations.username = {invalid: true, message: singleError[k]};
                  }

                }
              }
            }
          }
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('register_btn_spinner');
      });
    }
  }


  private prepareForm(): void {
    this.myForm = this.fb.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirm_password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      title_en: new FormControl('', Validators.required),
      title_bn: new FormControl(''),

      year_establishment: new FormControl('', [Validators.minLength(4), Validators.pattern('^[0-9]*$')]),
      company_size: new FormControl(''),

      country_id: new FormControl(1, Validators.required),
      district_id: new FormControl('', Validators.required),
      thana_id: new FormControl('', Validators.required),
      // area_id: new FormControl('', Validators.required),
      address_en: new FormControl('', Validators.required),
      address_bn: new FormControl(''),
      industry_type_id: new FormControl(''),
      selected_industry_types: new FormControl([], Validators.required),
      about: new FormControl(''),
      trade_licence_no: new FormControl(''),
      rl_no: new FormControl(''),
      website: new FormControl(''),
      organization_type_id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      designation: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile_no: new FormControl(''),
      is_checked_policy: new FormControl(false),
    }, {
      validator: this.ConfirmedValidator('password', 'confirm_password')
    });
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


  private ConfirmedValidator(controlName: string, matchingControlName: string): any {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({confirmedValidator: true});
      } else {
        matchingControl.setErrors(null);
      }
    };
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

  get checkedPolicy(): FormControl {
    return this.myForm.get('is_checked_policy') as FormControl;
  }

}
