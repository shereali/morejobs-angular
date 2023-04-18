import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Pagination} from '../../../../../../../../common/includes/utilities/pagination';
import {CommonSelectBox} from '../../../../../../../../common/includes/models/common';
import {perPageOptions} from '../../../../../../../../common/includes/models/employer/job-post';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {FilterParams, ObjectMap} from '../../../../../../../../common/includes/utilities/filterParams';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {JobPostService} from '../../../../../../../../common/includes/services/employer/job-post.service';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {pick} from 'lodash';
import {
  AGE_RANGE,
  EXPERIENCE_AT_LEAST,
  EXPERIENCE_AT_MOST,
  SALARY_RANGE_FROM,
  SALARY_RANGE_TO
} from '../../../../../../../../common/includes/utilities/staticValue';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {MatDialog} from '@angular/material/dialog';
import {CvBanksService} from '../../../../../../../../common/includes/services/employer/cv-banks.service';
import {CvbankViewResumeComponent} from './cvbank-view-resume/cvbank-view-resume.component';

@Component({
  selector: 'app-cv-bank-list',
  templateUrl: './cv-bank-list.component.html',
  styleUrls: ['./cv-bank-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvBankListComponent implements OnInit {
  isLoading = true;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'title',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  filterInitialData: {
    industry_types: Array<any>;
    genders: Array<any>;
    job_levels: Array<any>;
    job_natures: Array<any>;
    degree_levels: Array<any>;
    degrees: Array<any>;
    result_types: Array<any>;
    institutes: Array<any>;
    areas: Array<any>;
  } = {
    industry_types: [],
    genders: [],
    job_levels: [],
    job_natures: [],
    degree_levels: [],
    degrees: [],
    result_types: [],
    institutes: [],
    areas: [],
  };

  public staticFilterInitialData: {
    age_range_from: Array<any>;
    age_range_to: Array<any>;
    salary_range_from: Array<any>;
    salary_range_to: Array<any>;
    experience_at_least: Array<any>;
    experience_at_most: Array<any>;
  } = {
    age_range_from: [],
    age_range_to: [],
    salary_range_from: [],
    salary_range_to: [],
    experience_at_least: [],
    experience_at_most: [],
  };

  cvBanks: Array<{
    expected_salary: number;
    age: number;
    id: number;
    image: string | null;
    first_name: string;
    last_name: string;
    educations: Array<any>;
    contact_mobiles: Array<any>;
    job_experiences: Array<any>;
  }> = [];

  summary: {
    total: number;
    total_viewed: number;
    total_not_viewed: number;
    total_shortlisted: number;
    total_interview_listed: number;
    total_final_listed: number;
    total_rejected: number;
  } = {
    total: 0,
    total_viewed: 0,
    total_not_viewed: 0,
    total_shortlisted: 0,
    total_interview_listed: 0,
    total_final_listed: 0,
    total_rejected: 0,
  };
  status = 'all';


  ignoredParams = ['location_type', 'present_address', 'permanent_address', 'is_custom_matching_criteria'];
  formattedFiltered: Array<any> = [];

  searchForm: FormGroup | any;

  filterParams = new FilterParams();
  pagination = new Pagination();

  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private jps: JobPostService,
    private cvs: CvBanksService,
    private spinner: SpinnerService,
    private ts: ToastService,
    private dialog: MatDialog,
  ) {
    this.prepareSearchForm();
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngOnInit(): void {
    this.staticFilterInitialData.age_range_from = AGE_RANGE;
    this.staticFilterInitialData.age_range_to = AGE_RANGE;

    this.staticFilterInitialData.salary_range_from = SALARY_RANGE_FROM;
    this.staticFilterInitialData.salary_range_to = SALARY_RANGE_TO;

    this.staticFilterInitialData.experience_at_least = EXPERIENCE_AT_LEAST;
    this.staticFilterInitialData.experience_at_most = EXPERIENCE_AT_MOST;
  }

  private handleQueryParams(params: ObjectMap): void {
    if (!params.status) {
      this.status = 'all';
      params = Object.assign({status: 'all'}, params);
    }

    this.filterParams.setFilterFromQueryParams(params);
    if (this.filterInitialData.genders.length > 0) {
      this.getFilterList();
    }

    this.loadData(params, this.filterInitialData.genders.length === 0);
  }

  loadData(params: ObjectMap, resetFilters = false): void {
    this.isLoading = true;
    this.spinner.show('cv_bank_table_spinner');
    const id = this.route.snapshot.params.id;
    this.cvs.cvBankList(this.filterParams.formattedFilterParams(params), id)
      .then((res) => {
        if (res.success) {
          this.handleResponse(res);
          this.setSearchValueFromParams(params);

          if (resetFilters) {
            this.getFilterList();
          }
        } else {
          if (res.errors === 'SUBSCRIPTION_EXPIRED') {
            this.router.navigate([`/company/packages/cv-banks`], {
              queryParams: {
                package_type_id: 2
              }
            });
          }
        }
      }).finally(() => {
      this.spinner.hide('cv_bank_table_spinner');
      this.isLoading = false;
    });
  }

  handleResponse(res: any): void {
    this.filterInitialData = res.data.filter_initial_data;
    this.summary = res.data.summary;
    this.cvBanks = res.data.records.data;
    this.pagination = new Pagination(res.data.records);
  }

  filterByStatus(value: string): void {
    this.status = value;
    this.filterParams.set('status', value);
    this.navigateWithFilterParams();
  }

  onClickAction(item: any, status: number): void {
    if (item) {
      this.jps.executeAction(item.id, status).then(res => {
        this.ts.apiMessage(res);
        if (res.success) {
          this.loadData(this.filterParams.value);
        }
      });
    }
  }

  formattedData(data: Array<any>, key: string): string {
    return data.map((item: any) => item[key]).join(', ');
  }

  latestAcademicName(data: Array<any>): string {
    return data[data.length - 1]?.institute_name;
  }

  latestJobs(data: Array<any>): Array<any> {
    if (data.length > 0) {
      const sortedJobExperiences = data.sort((x, y) => +new Date(y.to ? y.to : new Date()) - +new Date(x.to ? x.to : new Date()));

      return sortedJobExperiences.slice(0, 2);
    }
    return [];
  }

  changePage(page: number): void {
    const extras: NavigationExtras = {queryParams: {page}, queryParamsHandling: 'merge'};
    this.router.navigate([], extras).then();
  }

  setPerPage(data: CommonSelectBox): void {
    this.filterParams.set('per_page', data.value);
    this.filterParams.set('page', '');
    this.navigateWithFilterParams();
  }

  search(): void {
    this.filterParams.set('applicant_name', this.applicantNameControl.value);
    this.filterParams.set('age_from', this.ageFormControl.value);
    this.filterParams.set('age_to', this.ageToControl.value);
    this.filterParams.set('salary_from', this.salaryFromControl.value);
    this.filterParams.set('salary_to', this.salaryToControl.value);
    this.filterParams.set('gender', this.genderControl.value);
    this.filterParams.set('job_level', this.jobLevelControl.value);
    this.filterParams.set('location_type', this.locationTypeControl.value);
    this.filterParams.set('present_address', this.presentAddressControl.value);
    this.filterParams.set('permanent_address', this.permanentAddressControl.value);
    if (this.areaControl.value) {
      // @ts-ignore
      this.filterParams.set('area_ids', this.areaControl.value.map(({id}) => id).join(','));
    } else {
      this.filterParams.set('area_ids', this.areaControl.value);
    }

    this.filterParams.set('search_by', this.searchByControl.value);

    this.filterParams.set('degree_level', this.degreeLevelControl.value);
    this.filterParams.set('degree', this.degreeControl.value);
    this.filterParams.set('major', this.majorControl.value);
    this.filterParams.set('result_type', this.resultTypeControl.value);
    if (this.institutesControl.value) {
      // @ts-ignore
      this.filterParams.set('institutes', this.institutesControl.value.map(({id}) => id).join(','));
    } else {
      this.filterParams.set('institutes', this.institutesControl.value);
    }

    this.filterParams.set('page', '');


    if (!this.presentAddressControl.value && !this.permanentAddressControl.value) {
      this.filterParams.set('present_address', 'true');
    }

    this.filterParams.set('experience_from', this.experienceFromControl.value);
    this.filterParams.set('experience_to', this.experienceToControl.value);
    if (this.businessOrganizationControl.value) {
      // @ts-ignore
      this.filterParams.set('business_organizations', this.businessOrganizationControl.value.map(({id}) => id).join(','));
    } else {
      this.filterParams.set('business_organizations', this.businessOrganizationControl.value);
    }

    this.filterParams.set('matching_criteria', this.matchingCriteriaControl.value);
    this.filterParams.set('is_custom_matching_criteria', this.isCustomMatchingCriteriaControl.value);

    this.navigateWithFilterParams();
  }

  reset(): void {
    this.searchForm.reset();
    this.search();

    this.setSearchFormDefault();
  }

  getFilterList(): any {
    console.log('rrrr', this.searchForm.value);
    const formattedParamsObj = this.getFilteredQueryParams(this.searchForm.value);
    console.log(formattedParamsObj);


    const filtered: any = {};
    for (const [key, value] of Object.entries(formattedParamsObj)) {
      if (value === null || this.ignoredParams.includes(key)) {
        continue;
      }
      filtered[key] = value;
    }

    console.log('filtered', filtered);

    const formattedFilteredObj: any = {};
    for (const [key, value] of Object.entries(filtered)) {
      if (key === 'age_from' || key === 'age_to') {
        if (formattedFilteredObj.hasOwnProperty('age_range')) {
          continue;
        }

        if (key === 'age_from') {
          if (filtered.hasOwnProperty('age_to')) {
            formattedFilteredObj.age_range = `Age: ${value} - ${filtered.age_to} years`;
          } else {
            formattedFilteredObj[key] = `Age: At least ${value} years`;
          }
        } else if (key === 'age_to') {
          if (filtered.hasOwnProperty('age_from')) {
            formattedFilteredObj.age_range = `Age: ${filtered.age_from} - ${value} years`;
          } else {
            formattedFilteredObj[key] = `Age: At most ${value} years`;
          }
        }

      } else if (key === 'area_ids') {
        const selectedAreas = this.searchForm.get(key).value.map((x: any) => x.title_en);
        let areaString = ' - ' + selectedAreas.join(',');

        if (this.presentAddressControl.value && this.permanentAddressControl.value) {
          areaString = 'Current, Present location' + areaString;
        } else if (this.permanentAddressControl.value) {
          areaString = 'Present location' + areaString;
        } else {
          areaString = 'Current location' + areaString;
        }
        formattedFilteredObj[key] = areaString;

      } else if (key === 'gender') {
        const genderArr = this.genderControl.value.split(',');
        const filteredGender = this.filterInitialData.genders.filter(x => genderArr.includes(x.id.toString()));
        formattedFilteredObj[key] = filteredGender.map(x => x.title).join(', ');

      } else if (key === 'job_level') {
        const currentArr = this.jobLevelControl.value.split(',');
        const filteredArr = this.filterInitialData.job_levels.filter(x => currentArr.includes(x.id.toString()));
        formattedFilteredObj[key] = filteredArr.map(x => x.title).join(', ');

      } else if (key === 'salary_from' || key === 'salary_to') {
        if (formattedFilteredObj.hasOwnProperty('salary_range')) {
          continue;
        }

        if (key === 'salary_from') {
          if (filtered.hasOwnProperty('salary_to')) {
            formattedFilteredObj.salary_range = `Salary: ${value} - ${filtered.salary_to} BDT`;
          } else {
            formattedFilteredObj[key] = `Salary: At least ${value} BDT`;
          }
        } else if (key === 'salary_to') {
          if (filtered.hasOwnProperty('salary_from')) {
            formattedFilteredObj.salary_range = `Salary: ${filtered.salary_from} - ${value} BDT`;
          } else {
            formattedFilteredObj[key] = `Salary: At most ${value} BDT`;
          }
        }
      } else if (key === 'degree_level') {
        formattedFilteredObj[key] = this.filterInitialData.degree_levels.find(x => x.id.toString() === value)?.title;
      } else if (key === 'degree') {
        formattedFilteredObj[key] = this.filterInitialData.degrees.find(x => x.id.toString() === value)?.title;
      } else if (key === 'result_type') {
        formattedFilteredObj[key] = this.filterInitialData.result_types.find(x => x.id.toString() === value)?.title;

      } else if (key === 'institutes') {
        const selectedOptions = this.searchForm.get(key).value.map((x: any) => x.title);
        formattedFilteredObj[key] = selectedOptions.join(',');

      } else if (key === 'experience_from' || key === 'experience_to') {
        if (formattedFilteredObj.hasOwnProperty('experience_range')) {
          continue;
        }

        if (key === 'experience_from') {
          if (filtered.hasOwnProperty('experience_to')) {
            formattedFilteredObj.experience_range = `Exp: ${value} - ${filtered.experience_to} years`;
          } else {
            formattedFilteredObj[key] = `Exp: At least ${value} years`;
          }
        } else if (key === 'experience_to') {
          if (filtered.hasOwnProperty('experience_from')) {
            formattedFilteredObj.experience_range = `Exp: ${filtered.experience_from} - ${value} years`;
          } else {
            formattedFilteredObj[key] = `Exp: At most ${value} years`;
          }
        }
      } else if (key === 'business_organizations') {
        const selectedOrgs = this.searchForm.get(key).value.map((x: any) => x.title_en);
        const orgsString = selectedOrgs.join(',');

        formattedFilteredObj[key] = orgsString;

      } else if (key === 'matching_criteria') {
        formattedFilteredObj[key] = 'Matched: ' + value;
      } else {
        formattedFilteredObj[key] = value;
      }
    }

    this.formattedFiltered = formattedFilteredObj;

    console.log('yyyyyyyyyyyy', this.formattedFiltered);
  }

  removeFilter(key: string): void {
    if (key === 'age_range') {
      this.searchForm.get('age_from').setValue('');
      this.searchForm.get('age_to').setValue('');

      this.filterParams.set('age_from', '');
      this.filterParams.set('age_to', '');

    } else if (key === 'salary_range') {
      this.searchForm.get('salary_from').setValue('');
      this.searchForm.get('salary_to').setValue('');

      this.filterParams.set('salary_from', '');
      this.filterParams.set('salary_to', '');

    } else if (key === 'experience_range') {
      this.searchForm.get('experience_from').setValue('');
      this.searchForm.get('experience_to').setValue('');

      this.filterParams.set('experience_from', '');
      this.filterParams.set('experience_to', '');

    } else {
      this.searchForm.get(key).setValue('');
      this.filterParams.set(key, '');
    }

    // @ts-ignore
    delete this.formattedFiltered[key];

    this.navigateWithFilterParams();
  }

  openResumeDetailsModal(data: any): void {
    this.spinner.show('resume_view_btn_spinner' + data.id);

    this.cvs.decrementCvSubscription().then(res => {
      this.spinner.hide('resume_view_btn_spinner' + data.id);
      if (res.success) {
        this.dialog.open(CvbankViewResumeComponent, {
          width: '900px', height: '700px', data
        });

      } else {
        if (res.errors === 'SUBSCRIPTION_EXPIRED') {
          this.router.navigate([`/company/packages/cv-banks`], {
            queryParams: {
              package_type_id: 2
            }
          });
        } else {
          this.ts.apiMessage(res);
        }
      }
    });
  }

  updateGenderArr(event: any): void {
    const currentGenderArr = this.genderControl.value ? this.genderControl.value.split(',') : [];
    if (event.target.checked) {
      currentGenderArr.push(event.target.value);
    } else {
      currentGenderArr.splice(currentGenderArr.findIndex((x: number) => +x === +event.target.value), 1);
    }
    this.genderControl.setValue(currentGenderArr.join(','));
  }

  updateJobLevelArr(event: any): void {
    const currentArr = this.jobLevelControl.value ? this.jobLevelControl.value.split(',') : [];
    if (event.target.checked) {
      currentArr.push(event.target.value);
    } else {
      currentArr.splice(currentArr.findIndex((x: number) => +x === +event.target.value), 1);
    }
    this.jobLevelControl.setValue(currentArr.join(','));
  }

  updateMatchingCriteria(value: any, isCustom = false): void {
    if (value === 'all' || (value && value <= 100 && value >= 0)) {
      this.matchingCriteriaControl.setValue(value);
      if (isCustom) {
        this.isCustomMatchingCriteriaControl.setValue(true);
      } else {
        this.isCustomMatchingCriteriaControl.setValue(false);
      }

      this.search();
    } else {
      if (value > 100 || value < 0) {
        this.matchingCriteriaControl.setValue('');
        this.matchingCriteriaControl.updateValueAndValidity();
        this.filterParams.set('matching_criteria', '');
        // this.navigateWithFilterParams();
        this.ts.error('Matching criteria range 0 to 100');
      } else {
        this.ts.error('Please set custom matching value');
      }
    }
  }

  totalExpPerUser(item: any): string {
    let exp = '0';
    if (item.user_exp_year > 0) {
      exp = item.user_exp_year + '+ Years';
    } else if (item.user_exp_month > 0) {
      exp = item.user_exp_month + '+ Months';
    }
    return exp;
  }

  private prepareSearchForm(): void {
    this.searchForm = this.fb.group({
      applicant_name: '',
      age_from: '',
      age_to: '',
      salary_from: '',
      salary_to: '',
      gender: '',
      job_level: '',
      location_type: 'inside_bd',
      present_address: true,
      permanent_address: false,
      area_ids: new FormControl([]),

      search_by: '',

      degree_level: '',
      degree: '',
      major: '',
      result_type: '',
      institutes: new FormControl([]),

      experience_from: '',
      experience_to: '',
      business_organizations: new FormControl([]),

      matching_criteria: '',
      is_custom_matching_criteria: false,
    });
  }

  private setSearchFormDefault(): void {
    this.ageFormControl.setValue('');
    this.ageToControl.setValue('');
    this.salaryFromControl.setValue('');
    this.salaryToControl.setValue('');
    this.locationTypeControl.setValue('inside_bd');
    this.areaControl.setValue([]);

    this.degreeLevelControl.setValue('');
    this.degreeControl.setValue('');
    this.resultTypeControl.setValue('');
    this.institutesControl.setValue([]);

    this.matchingCriteriaControl.setValue('all');
    this.isCustomMatchingCriteriaControl.setValue(false);
  }

  private setSearchValueFromParams(data: any = {}): void {
    Object
      .keys(pick(data, ['applicant_name', 'age_from', 'age_to', 'salary_from', 'salary_to', 'gender', 'job_level',
        'location_type', 'present_address', 'permanent_address', 'area_ids', 'search_by', 'degree_level', 'degree', 'major',
        'result_type', 'institutes', 'experience_from', 'experience_to', 'business_organizations', 'matching_criteria', 'is_custom_matching_criteria']))
      .filter(key => data[key])
      .forEach(key => {
        if (key === 'institutes') {
          const selectedInstitutes = this.filterInitialData.institutes.filter(x => data[key].split(',').includes(String(x.id)));
          this.searchForm.get(key).setValue(selectedInstitutes);
        } else if (key === 'area_ids') {
          const selectedAreas = this.filterInitialData.areas.filter(x => data[key].split(',').includes(String(x.id)));
          this.searchForm.get(key).setValue(selectedAreas);
        } else if (key === 'business_organizations') {
          const selectedOrgs = this.filterInitialData.industry_types.filter(x => data[key].split(',').includes(String(x.id)));
          this.searchForm.get(key).setValue(selectedOrgs);
        } else {
          this.searchForm.get(key).setValue(data[key]);
        }
      });
  }

  get showSearchClearButton(): any {
    return [
      this.filterParams.value.applicant_name,
      this.filterParams.value.age_from,
      this.filterParams.value.age_to,
      this.filterParams.value.salary_from,
      this.filterParams.value.salary_to,
      this.filterParams.value.gender,
      this.filterParams.value.job_level,
      // this.filterParams.value.location_type,
      // this.filterParams.value.present_address,
      // this.filterParams.value.permanent_address,
      this.filterParams.value.area_ids,

      this.filterParams.value.search_by,

      this.filterParams.value.degree_level,
      this.filterParams.value.degree,
      this.filterParams.value.major,
      this.filterParams.value.result_type,
      this.filterParams.value.institutes,

      this.filterParams.value.experience_from,
      this.filterParams.value.experience_to,
      this.filterParams.value.business_organizations,

      this.filterParams.value.matching_criteria,
      // this.filterParams.value.is_custom_matching_criteria,
    ].some(value => value);
  }

  private navigateWithFilterParams(filterParams?: any, queryParamsHandling: QueryParamsHandling = 'merge'): void {
    const filteredFilterParams = this.getFilteredQueryParams(this.filterParams.value);

    const extras: NavigationExtras = {
      queryParams: filterParams || filteredFilterParams,
      queryParamsHandling,
      replaceUrl: true
    };
    this.router.navigate([], extras).then();
  }

  private getFilteredQueryParams(obj = {}): any {
    return Object.keys(obj).reduce((acc: any, key) => {
      acc[key] = (this.filterParams.value[key] === '' || this.filterParams.value[key] === undefined) ? null : this.filterParams.value[key];
      return acc;
    }, {});
  }

  get applicantNameControl(): FormControl {
    return this.searchForm.get('applicant_name') as FormControl;
  }

  get ageFormControl(): FormControl {
    return this.searchForm.get('age_from') as FormControl;
  }

  get ageToControl(): FormControl {
    return this.searchForm.get('age_to') as FormControl;
  }

  get salaryFromControl(): FormControl {
    return this.searchForm.get('salary_from') as FormControl;
  }

  get salaryToControl(): FormControl {
    return this.searchForm.get('salary_to') as FormControl;
  }

  get genderControl(): FormControl {
    return this.searchForm.get('gender') as FormControl;
  }

  get jobLevelControl(): FormControl {
    return this.searchForm.get('job_level') as FormControl;
  }

  get locationTypeControl(): FormControl {
    return this.searchForm.get('location_type') as FormControl;
  }

  get presentAddressControl(): FormControl {
    return this.searchForm.get('present_address') as FormControl;
  }

  get permanentAddressControl(): FormControl {
    return this.searchForm.get('permanent_address') as FormControl;
  }

  get areaControl(): FormControl {
    return this.searchForm.get('area_ids') as FormControl;
  }

  get searchByControl(): FormControl {
    return this.searchForm.get('search_by') as FormControl;
  }

  get degreeLevelControl(): FormControl {
    return this.searchForm.get('degree_level') as FormControl;
  }

  get degreeControl(): FormControl {
    return this.searchForm.get('degree') as FormControl;
  }

  get majorControl(): FormControl {
    return this.searchForm.get('major') as FormControl;
  }

  get resultTypeControl(): FormControl {
    return this.searchForm.get('result_type') as FormControl;
  }

  get institutesControl(): FormControl {
    return this.searchForm.get('institutes') as FormControl;
  }

  get experienceFromControl(): FormControl {
    return this.searchForm.get('experience_from') as FormControl;
  }

  get experienceToControl(): FormControl {
    return this.searchForm.get('experience_to') as FormControl;
  }

  get businessOrganizationControl(): FormControl {
    return this.searchForm.get('business_organizations') as FormControl;
  }

  get filteredDegrees(): Array<any> {
    return this.filterInitialData.degrees.filter(x => x.education_level_id === +this.degreeLevelControl.value);
  }

  get matchingCriteriaControl(): FormControl {
    return this.searchForm.get('matching_criteria') as FormControl;
  }

  get isCustomMatchingCriteriaControl(): FormControl {
    return this.searchForm.get('is_custom_matching_criteria') as FormControl;
  }

  get filteredAreas(): Array<any> {
    if (this.locationTypeControl.value === 'inside_bd') {
      return this.filterInitialData.areas.filter(x => x.country_id === 1);
    } else {
      return this.filterInitialData.areas.filter(x => x.country_id !== 1);
    }
  }
}
