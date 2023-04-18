import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {FilterParams, ObjectMap} from '../../../../../../../common/includes/utilities/filterParams';
import {JobPostService} from '../../../../../../../common/includes/services/employer/job-post.service';
import {SpinnerService} from '../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {CreateInitialDataModel} from '../../../../../../../common/includes/models/employer/job-post';
import {ToastService} from '../../../../../../../common/includes/services/toast.service';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {AGE_RANGE, EXP_RANGE} from '../../../../../../../common/includes/utilities/staticValue';

@Component({
  selector: 'app-job-posting-board',
  templateUrl: './job-posting-board.component.html',
  styleUrls: ['./job-posting-board.component.scss'],
})
export class JobPostingBoardComponent implements OnInit {
  isLoading = true;
  submitAttempt = false;
  actionType = 'create';

  jobTitle = '';
  languageId = null;

  selectedStep = 'primary_job_info';
  stepProcess = [
    {
      title: 'Primary Job Information',
      key: 'primary_job_info',
      is_completed: false,
      is_selected: true,
      icon: 'fas fa-disease'
    },
    {
      title: 'More Job Information',
      key: 'more_job_info',
      is_completed: false,
      is_selected: false,
      icon: 'fas fa-business-time'
    },
    {
      title: 'Candidate Requirements',
      key: 'candidate_requirements',
      is_completed: false,
      is_selected: false,
      icon: 'fas fa-glasses'
    },
    {
      title: 'Company Info Visibility',
      key: 'company_info',
      is_completed: false,
      is_selected: false,
      icon: 'fas fa-universal-access'
    },
    {
      title: 'Matching Criteria',
      key: 'matching_criteria',
      is_completed: false,
      is_selected: false,
      icon: 'fab fa-slideshare'
    },
    // {
    //   title: 'Set Video Interview',
    //   key: 'video_interview',
    //   is_completed: false,
    //   is_selected: false,
    //   icon: 'fas fa-podcast'
    // },
    {
      title: 'Preview',
      key: 'preview',
      is_completed: false,
      is_selected: false,
      icon: 'fas fa-mosque'
    },
    {
      title: 'Complete',
      key: 'complete',
      is_completed: false,
      is_selected: false,
      icon: 'fas fa-mug-hot'
    }
  ];

  experienceOptions = EXP_RANGE;
  ageOptions = AGE_RANGE;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'title',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
    allowSearchFilter: true
  };

  filteredDegrees: any[] = [];

  initialData: CreateInitialDataModel | any;

  primaryJobInfoForm = new FormGroup({
    language: new FormControl(1),
    service_type_id: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    no_of_vacancy: new FormControl(null),
    no_of_vacancy_undefined: new FormControl(null),
    category_type: new FormControl(0, Validators.required),
    category_id: new FormControl('', Validators.required),
    post_nature_ids: this.fb.array([], Validators.required),
    deadline: new FormControl('', Validators.required),
    special_instruction: new FormControl(''),
    is_profile_image: new FormControl(false),
    is_apply_online: new FormControl(true),
    resume_receiving_option: new FormControl(null),
    resume_receiving_details: new FormControl(null),
  });

  moreJobInfoForm = new FormGroup({
    job_level_ids: this.fb.array([], Validators.required),
    job_context: new FormControl(null),
    responsibilities: new FormControl(null, Validators.required),
    workspace_ids: this.fb.array([]),

    salary_min: new FormControl(null),
    salary_max: new FormControl(null),
    salary_type: new FormControl(3),
    is_negotiable: new FormControl(true),
    is_display_salary: new FormControl(false),
    additional_salary_info: new FormControl(null),
    job_location: new FormControl('inside_bd'),
    job_location_areas: new FormControl([], Validators.required),


    other_benefit_type: new FormControl('select_option'),
    benefits: new FormControl([]),
    lunch_facility: new FormControl(0),
    salary_review: new FormControl(0),
    others: new FormControl(null),
    festival_bonus: new FormControl(''),
  });

  candidateRequirementForm = this.fb.group({
    degrees: this.fb.array([
      this.fb.group({
        education_level_id: ['', Validators.required],
        degree_id: ['', Validators.required],
        major: [null],
      })
    ]),
    institutes: new FormControl([]),
    other_qualification: new FormControl(''),
    trainings: this.fb.array([
      this.fb.group({
        title: [''],
      })
    ]),
    certificates: this.fb.array([
      this.fb.group({
        title: [''],
      })
    ]),
    is_experience_require: [0],
    experience_min: [{value: null, disabled: true}],
    experience_max: [{value: null, disabled: true}],
    is_fresher_allowed: [{value: 0, disabled: true}],
    area_experiences: new FormControl([]),
    // industry_types: new FormControl([]),
    skills: new FormControl([]),
    additional_requirements: new FormControl(''),
    genders: new FormControl([{id: 1, title: 'Male'}]),
    age_min: [''],
    age_max: [''],
    is_disability_allowed: [0],
  });

  companyInfoForm = new FormGroup({
    is_visible_company_name: new FormControl(1),
    is_visible_address: new FormControl(1),
    is_visible_about: new FormControl(1),
    industry_types: new FormControl([]),
    contact_id: new FormControl(null, Validators.required),
  });

  matchingCriteriaForm = this.fb.group({
    matching_criteria: this.fb.array([])
  });

  filterParams = new FilterParams();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private jps: JobPostService,
    private ts: ToastService,
    private spinner: SpinnerService) {
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngOnInit(): void {
  }

  private handleQueryParams(params: ObjectMap): void {
    this.actionType = params.action_type || 'create';
    this.selectedStep = params.step || this.selectedStep;
    this.filterParams.setFilterFromQueryParams(params);

    if (params.action_type === 'edit') {
      this.stepProcess.map(item => {
        if (item.key !== 'complete') {
          item.is_completed = true;
        }
      });
    } else {
      this.updateStep();
    }

    this.initiate().then(() => {
      if (params.id) {
        this.jobTitle = this.initialData.post.title;
        this.languageId = this.initialData.post.language;
      }
    });
  }

  async initiate(): Promise<any> {
    this.isLoading = true;
    await this.jps.initiateJobPost(this.filterParams.value)
      .then((res) => {
        if (res.success) {
          this.initialData = res.data;
          this.setFormWithDefaultValue();
        }
      }).finally(() => {
        this.isLoading = false;
      });
  }

  updateStep(): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.stepProcess.length; i++) {
      if (this.stepProcess[i].key === this.filterParams.value.step) {
        this.stepProcess[i].is_selected = true;
        this.selectedStep = this.stepProcess[i].key;
        break;
      }

      if (this.filterParams.value.step === 'complete') {
        this.stepProcess[i].is_selected = false;
        this.stepProcess[i].is_completed = false;
      } else {
        this.stepProcess[i].is_completed = true;
      }
    }
  }

  onChangeStep(selectedStep: string): void {
    const step = this.stepProcess.find(({key}) => key === selectedStep);
    if (step && (step.is_completed || step.is_selected)) {
      this.selectedStep = selectedStep;
      this.filterParams.set('step', selectedStep);
      this.navigateWithFilterParams();
    }
  }

  onChangeJobLocation(): void {
    if (this.moreJobInfoForm.get('job_location')?.value === this.initialData.post.job_location) {
      this.moreJobInfoForm.get('job_location_areas')?.setValue(this.initialData.post.post_areas);
    } else {
      this.moreJobInfoForm.get('job_location_areas')?.setValue([]);
    }
  }

  onChangeJobLocationAreas(): void {
    if (this.moreJobInfoForm.get('job_location_areas')?.value.length > 1) {
      const anyWhereBdOptionIndex = this.moreJobInfoForm.get('job_location_areas')?.value.findIndex((x: any) => x.id === '');
      if (anyWhereBdOptionIndex !== -1) {
        // tslint:disable-next-line:max-line-length
        this.moreJobInfoForm.get('job_location_areas')?.setValue(this.moreJobInfoForm.get('job_location_areas')?.value.splice(anyWhereBdOptionIndex, 1));
      }
    }
  }

  onSubmit(currentStep: string, nextStep: string = '', btnSpinnerKey: string): void {
    const formData = this.isFormValid(currentStep);

    if (formData) {
      this.isLoading = true;
      this.submitAttempt = true;
      this.spinner.show(btnSpinnerKey);
      this.spinner.show('view_form_spinner');

      this.jps.savePost(currentStep, formData, this.filterParams.value.id)
        .then((res) => {
          if (res.success) {
            this.filterParams.set('id', res.data.id);

            this.selectedStep = nextStep;
            this.filterParams.set('step', nextStep);
            this.navigateWithFilterParams();
          } else {
            this.ts.apiMessage(res);
          }
        }).finally(() => {
        this.isLoading = false;
        this.submitAttempt = false;
        this.spinner.hide(btnSpinnerKey);
        this.spinner.hide('view_form_spinner');
      });
    }
  }

  onFinalSubmit(status: string, btnSpinnerKey: string): void {
    this.isLoading = true;
    this.submitAttempt = true;
    this.spinner.show(btnSpinnerKey);

    if (status === 'ready_to_process') {
      this.jps.readyToProcess(this.filterParams.value.id)
        .then((res) => {
          this.ts.apiMessage(res);
          if (res.success) {
            this.selectedStep = 'complete';
            this.filterParams.set('step', 'complete');

            this.router.navigate([], {queryParams: {step: 'complete'}});
          }
        }).finally(() => {
        this.isLoading = false;
        this.submitAttempt = false;
        this.spinner.hide(btnSpinnerKey);
      });

    } else {
      this.isLoading = false;
      this.submitAttempt = false;
      this.ts.success('Information saved successfully');
      this.spinner.hide(btnSpinnerKey);
    }
  }

  isFormValid(step: string): boolean {
    if (step === 'primary_job_info' && this.primaryJobInfoForm.valid) {
      return this.primaryJobInfoForm.value;
    } else if (step === 'more_job_info' && this.moreJobInfoForm.valid) {
      return this.moreJobInfoForm.value;
    } else if (step === 'candidate_requirements' && this.candidateRequirementForm.valid) {
      return this.candidateRequirementForm.value;
    } else if (step === 'company_info' && this.companyInfoForm.valid) {
      return this.companyInfoForm.value;
    } else if (step === 'matching_criteria' && this.matchingCriteriaForm.valid) {
      return this.matchingCriteriaForm.value;
    }

    return false;
  }

  setFormWithDefaultValue(): void {
    if (this.selectedStep === 'primary_job_info') {
      if (this.initialData.post) {
        this.primaryJobInfoForm.get('service_type_id')?.setValue(this.initialData.post.package_id);
        this.primaryJobInfoForm.get('title')?.setValue(this.initialData.post.title);
        this.primaryJobInfoForm.get('deadline')?.setValue(this.initialData.post.deadline);
        this.primaryJobInfoForm.get('no_of_vacancy')?.setValue(this.initialData.post.no_of_vacancy);
        this.primaryJobInfoForm.get('category_id')?.setValue(this.initialData.post.category_id);

        if (this.initialData.post.category.category_type_id === 1) {
          if (this.initialData.post.category.tag_id === 1) {
            this.primaryJobInfoForm.get('category_type')?.setValue(0);
          } else {
            this.primaryJobInfoForm.get('category_type')?.setValue(1);
          }
        } else {
          this.primaryJobInfoForm.get('category_type')?.setValue(this.initialData.post.category.category_type_id);
        }

        // @ts-ignore
        this.initialData.post.post_natures.forEach(({id}) => {
          this.postNatureIds.push(new FormControl(id));
        });

        this.primaryJobInfoForm.get('special_instruction')?.setValue(this.initialData.post.special_instruction);
        this.primaryJobInfoForm.get('is_profile_image')?.setValue(this.initialData.post.is_profile_image);

        this.primaryJobInfoForm.get('is_apply_online')?.setValue(this.initialData.post.resume_receiving_option?.is_apply_online);
        // tslint:disable-next-line:max-line-length
        this.primaryJobInfoForm.get('resume_receiving_option')?.setValue(this.initialData.post.resume_receiving_option?.resume_receiving_option);
        // tslint:disable-next-line:max-line-length
        this.primaryJobInfoForm.get('resume_receiving_details')?.setValue(this.initialData.post.resume_receiving_option?.resume_receiving_details);

      } else {
        this.primaryJobInfoForm.get('service_type_id')?.setValue(this.initialData.service_types[0].id);
      }

    } else if (this.selectedStep === 'more_job_info') {
      if (this.initialData.post) {
        // @ts-ignore
        this.initialData.post.post_levels.forEach(({id}) => {
          this.jobLevelIds.push(new FormControl(id));
        });
        // @ts-ignore
        this.initialData.post.post_workspaces.forEach(({id}) => {
          this.workspaceIds.push(new FormControl(id));
        });

        this.moreJobInfoForm.get('salary_min')?.setValue(this.initialData.post.salary_min);
        this.moreJobInfoForm.get('salary_max')?.setValue(this.initialData.post.salary_max);
        this.moreJobInfoForm.get('is_negotiable')?.setValue(this.initialData.post.is_negotiable);

        if (!this.initialData.post.is_negotiable) {
          this.moreJobInfoForm.get('salary_min')?.setValidators(Validators.required);
          this.moreJobInfoForm.get('salary_min')?.updateValueAndValidity();
          this.moreJobInfoForm.get('salary_max')?.setValidators(Validators.required);
          this.moreJobInfoForm.get('salary_max')?.updateValueAndValidity();
        }

        if (this.initialData.post.salary_type) {
          this.moreJobInfoForm.get('salary_type')?.setValue(this.initialData.post.salary_type);
        }

        this.moreJobInfoForm.get('job_context')?.setValue(this.initialData.post.job_context);
        this.moreJobInfoForm.get('responsibilities')?.setValue(this.initialData.post.responsibilities);
        this.moreJobInfoForm.get('additional_salary_info')?.setValue(this.initialData.post.additional_salary_info);
        this.moreJobInfoForm.get('is_display_salary')?.setValue(this.initialData.post.is_display_salary);
        if (this.initialData.post.other_benefit?.other_benefit_type) {
          this.moreJobInfoForm.get('other_benefit_type')?.setValue(this.initialData.post.other_benefit?.other_benefit_type);
        }
        this.moreJobInfoForm.get('benefits')?.setValue(this.initialData.post.other_benefit?.benefits);
        this.moreJobInfoForm.get('lunch_facility')?.setValue(this.initialData.post.other_benefit?.lunch_facility ?? 0);
        this.moreJobInfoForm.get('salary_review')?.setValue(this.initialData.post.other_benefit?.salary_review ?? 0);
        this.moreJobInfoForm.get('others')?.setValue(this.initialData.post.other_benefit?.others);
        this.moreJobInfoForm.get('festival_bonus')?.setValue(this.initialData.post.other_benefit?.festival_bonus);

        this.moreJobInfoForm.get('job_location')?.setValue(this.initialData.post.job_location);
        this.moreJobInfoForm.get('job_location_areas')?.setValue(this.initialData.post.post_areas);
      }

    } else if (this.selectedStep === 'candidate_requirements') {
      if (this.initialData.post) {
        if (this.initialData.post.post_degrees.length > 0) {
          this.degreeFormArray.controls = [];

          this.initialData.post.post_degrees.forEach((item: { id: number, education_level_id: number, pivot: any }, i: number) => {
            this.onChangeEducationLevel(i, item.education_level_id);
            this.degreeFormArray.push(this.fb.group({
              education_level_id: [item.education_level_id, Validators.required],
              degree_id: [item.id, Validators.required],
              major: [item.pivot.major],
            }));
          });
        }

        if (this.initialData.post.post_trainings.length > 0) {
          this.trainingFormArray.removeAt(0);

          this.initialData.post.post_trainings.forEach((item: { id: number, title: string }) => {
            this.trainingFormArray.push(this.fb.group({
              title: [item.title],
            }));
          });
        }

        if (this.initialData.post.post_certificates.length > 0) {
          this.certificateFormArray.removeAt(0);

          this.initialData.post.post_certificates.forEach((item: { id: number, title: string }) => {
            this.certificateFormArray.push(this.fb.group({
              title: [item.title],
            }));
          });
        }

        this.candidateRequirementForm.get('institutes')?.setValue(this.initialData.post.post_institutes);
        this.candidateRequirementForm.get('area_experiences')?.setValue(this.initialData.post.post_area_experiences);
        this.candidateRequirementForm.get('skills')?.setValue(this.initialData.post.post_skills);
        this.candidateRequirementForm.get('genders')?.setValue(this.initialData.post.post_genders);

        this.candidateRequirementForm.get('other_qualification')?.setValue(this.initialData.post.other_qualification);
        this.candidateRequirementForm.get('is_experience_require')?.setValue(this.initialData.post.is_experience_require);
        this.candidateRequirementForm.get('experience_min')?.setValue(this.initialData.post.experience_min);
        this.candidateRequirementForm.get('experience_max')?.setValue(this.initialData.post.experience_max);
        this.candidateRequirementForm.get('is_fresher_allowed')?.setValue(this.initialData.post.is_fresher_allowed);
        this.candidateRequirementForm.get('additional_requirements')?.setValue(this.initialData.post.additional_requirements);
        this.candidateRequirementForm.get('age_min')?.setValue(this.initialData.post.age_min);
        this.candidateRequirementForm.get('age_max')?.setValue(this.initialData.post.age_max);
        this.candidateRequirementForm.get('is_disability_allowed')?.setValue(this.initialData.post.is_disability_allowed);

        this.onChangeExpOption();
      }

    } else if (this.selectedStep === 'company_info') {
      if (this.initialData.post) {
        this.companyInfoForm.get('is_visible_company_name')?.setValue(this.initialData.post.is_visible_company_name);
        this.companyInfoForm.get('is_visible_address')?.setValue(this.initialData.post.is_visible_address);
        this.companyInfoForm.get('is_visible_about')?.setValue(this.initialData.post.is_visible_about);
        this.companyInfoForm.get('contact_id')?.setValue(this.initialData.post.contact_id);

        if (this.initialData.post.post_industry_types.length > 0) {
          this.companyInfoForm.get('industry_types')?.setValue(this.initialData.post.post_industry_types);
        } else {
          this.companyInfoForm.get('industry_types')?.setValue(this.initialData.post.post_company_industry_types);
        }
      }

    } else if (this.selectedStep === 'matching_criteria') {

      this.matchingCriteriaFormArray.clear();
      this.initialData.matching_criteria.forEach((item: { id: number; title: string }) => {
        const control = this.fb.group({
          matching_criteria_id: new FormControl(item.id),
          title: new FormControl(item.title),
          sub_title: new FormControl(''),
          is_selected: new FormControl(false),
          is_mandatory: new FormControl(false),
        });

        if (this.initialData.post.post_matching_criteria.length > 0) {
          const result = this.initialData.post.post_matching_criteria.find((x: any) => x.matching_criteria_id === item.id);
          if (result) {
            control.get('is_selected')?.setValue(true);
            control.get('is_mandatory')?.setValue(result.is_mandatory);
          }
        }

        const data = this.getCriteriaSelectedValue(control);
        control.get('sub_title')?.setValue(data.value);

        if (this.initialData.post.post_matching_criteria.length === 0) {
          control.get('is_selected')?.setValue(data.is_value_set);
          if (!data.is_value_set) {
            control.get('is_selected')?.disable();
            control.get('is_mandatory')?.disable();
          }
        }

        this.matchingCriteriaFormArray.push(control);
      });
    }
  }

  getCriteriaSelectedValue(control: any): any {
    this.candidateRequirementForm.get('age_min')?.setValue(this.initialData.post.age_min);
    this.candidateRequirementForm.get('age_max')?.setValue(this.initialData.post.age_max);

    this.candidateRequirementForm.get('experience_min')?.setValue(this.initialData.post.experience_min);
    this.candidateRequirementForm.get('experience_max')?.setValue(this.initialData.post.experience_max);

    this.candidateRequirementForm.get('area_experiences')?.setValue(this.initialData.post.post_area_experiences);
    this.candidateRequirementForm.get('skills')?.setValue(this.initialData.post.post_skills);

    this.salaryMin?.setValue(this.initialData.post.salary_min);
    this.salaryMax?.setValue(this.initialData.post.salary_max);

    this.gendersFormControl?.setValue(this.initialData.post.post_genders);


    // @ts-ignore
    // tslint:disable-next-line:no-shadowed-variable
    this.initialData.post.post_levels.forEach(({id}) => {
      this.jobLevelIds.push(new FormControl(id));
    });

    const id = control.get('matching_criteria_id').value;
    const data = {
      value: '',
      is_value_set: false
    };
    if (id === 1) {
      if (this.ageMin.value || this.ageMax.value) {
        data.is_value_set = true;
        data.value = this.ageMin.value + ' - ' + this.ageMax.value + ' years';
      }
    } else if (id === 2) {

    } else if (id === 3) {
      if (this.expMin.value || this.expMax.value) {
        data.is_value_set = true;
        data.value = this.expMin.value + ' - ' + this.expMax.value + ' years';
      }

    } else if (id === 4) {
      if (this.salaryMin.value || this.salaryMax.value) {
        data.is_value_set = true;
        data.value = this.salaryMin.value + ' - ' + this.salaryMax.value;
      }

    } else if (id === 5) {
      if (this.gendersFormControl.value.length > 0) {
        data.is_value_set = true;
        data.value = this.gendersFormControl.value.map((item: any) => item.title).join(', ');
      }

    } else if (id === 7) {
      if (this.candidateRequirementForm.get('area_experiences')?.value.length > 0) {
        data.is_value_set = true;
        data.value = this.candidateRequirementForm.get('area_experiences')?.value.map((item: any) => item.title).join(', ');
      }
    } else if (id === 8) {
      if (this.jobLevelIds.value.length > 0) {
        data.is_value_set = true;
        // tslint:disable-next-line:max-line-length
        data.value = this.initialData.post.post_levels.filter((x: any) => !this.jobLevelIds.value.includes(x)).map((item: any) => item.title).join(', ');
      }
    } else if (id === 9) {
      if (this.candidateRequirementForm.get('skills')?.value.length > 0) {
        data.is_value_set = true;
        data.value = this.candidateRequirementForm.get('skills')?.value.map((item: any) => item.title).join(', ');
      }
    }

    return data;
  }

  onChangeEmploymentStatus(e: any): void {
    if (e.target.checked) {
      this.postNatureIds.push(new FormControl(e.target.value));
    } else {
      let i = 0;
      this.postNatureIds.controls.forEach((item) => {
        // tslint:disable-next-line:triple-equals
        if (item.value == e.target.value) {
          this.postNatureIds.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onChangeJobLevels(e: any): void {
    if (e.target.checked) {
      this.jobLevelIds.push(new FormControl(e.target.value));
    } else {
      let i = 0;
      this.jobLevelIds.controls.forEach((item) => {
        // tslint:disable-next-line:triple-equals
        if (item.value == e.target.value) {
          this.jobLevelIds.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onChangeWorkspace(e: any): void {
    if (e.target.checked) {
      this.workspaceIds.push(new FormControl(e.target.value));
    } else {
      let i = 0;
      this.workspaceIds.controls.forEach((item) => {
        // tslint:disable-next-line:triple-equals
        if (item.value == e.target.value) {
          this.workspaceIds.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  updateVacancyValidation(event: any): void {
    if (event.target.checked) {
      this.primaryJobInfoForm.get('no_of_vacancy')?.clearValidators();
      this.primaryJobInfoForm.get('no_of_vacancy')?.setValue(null);
    } else {
      this.primaryJobInfoForm.get('no_of_vacancy')?.setValidators([Validators.required]);
    }

    this.primaryJobInfoForm.get('no_of_vacancy')?.updateValueAndValidity();
  }

  updateSalaryValidation(event: any): void {
    if (event.target.checked) {
      this.moreJobInfoForm.get('salary_min')?.clearValidators();
      // this.moreJobInfoForm.get('salary_min')?.setValue(null);
      this.moreJobInfoForm.get('salary_max')?.clearValidators();
      // this.moreJobInfoForm.get('salary_max')?.setValue(null);
    } else {
      this.moreJobInfoForm.get('salary_min')?.setValidators([Validators.required]);
      this.moreJobInfoForm.get('salary_max')?.setValidators([Validators.required]);
    }

    this.moreJobInfoForm.get('salary_min')?.updateValueAndValidity();
    this.moreJobInfoForm.get('salary_max')?.updateValueAndValidity();
  }

  addDegree(): void {
    this.degreeFormArray.push(this.fb.group({
      education_level_id: ['', Validators.required],
      degree_id: ['', Validators.required],
      major: [null],
    }));
  }

  removeDegree(i: number): void {
    this.degreeFormArray.removeAt(i);

    this.filteredDegrees.splice(i, 1);
  }

  addTraining(): void {
    this.trainingFormArray.push(this.fb.group({
      title: [''],
    }));
  }

  removeTraining(i: number): void {
    this.trainingFormArray.removeAt(i);
  }

  addCertificate(): void {
    this.certificateFormArray.push(this.fb.group({
      title: [''],
    }));
  }

  removeCertificate(i: number): void {
    this.certificateFormArray.removeAt(i);
  }

  onChangeEducationLevel(i: number, value: string | number): void {
    this.filteredDegrees[i] = this.initialData.degrees.filter(({education_level_id}: any) => education_level_id === +value);
  }

  onChangeExpOption(): void {
    const val = this.candidateRequirementForm.get('is_experience_require')?.value;

    if (val === 0) {
      this.candidateRequirementForm.get('experience_min')?.setValue(null);
      this.candidateRequirementForm.get('experience_max')?.setValue(null);
      this.candidateRequirementForm.get('is_fresher_allowed')?.setValue(0);
      this.candidateRequirementForm.get('area_experiences')?.setValue([]);
      // this.candidateRequirementForm.get('industry_types')?.setValue([]);

      this.candidateRequirementForm.get('experience_min')?.disable();
      this.candidateRequirementForm.get('experience_max')?.disable();
      this.candidateRequirementForm.get('is_fresher_allowed')?.disable();
      // this.candidateRequirementForm.get('area_experiences')?.disable();
      // this.candidateRequirementForm.get('industry_types')?.disable();

    } else {
      this.candidateRequirementForm.get('experience_min')?.enable();
      this.candidateRequirementForm.get('experience_max')?.enable();
      this.candidateRequirementForm.get('is_fresher_allowed')?.enable();
      this.candidateRequirementForm.get('area_experiences')?.enable();
      // this.candidateRequirementForm.get('industry_types')?.enable();
    }
  }

  getMatchingCriteria(): Array<any> {
    // const [left, right] = _.chunk(this.matchingCriteriaFormArray.controls, _.round(this.matchingCriteriaFormArray.controls.length / 2));
    //
    // return [...left, ...right];

    return this.matchingCriteriaFormArray.controls;
  }

  onChangeRadio(control: any): any {
    if (!control.get('is_selected').value) {
      control.get('is_mandatory')?.disable();
    } else {
      control.get('is_mandatory')?.enable();
    }
  }

  getStepKeyByMatchingCriteria(id: number): any {
    switch (id) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 9:
        return 'candidate_requirements';
      case 2:
      case 4:
        return 'more_job_info';
    }
  }

  private navigateWithFilterParams(queryParamsHandling: QueryParamsHandling = 'merge'): void {
    const extras: NavigationExtras = {
      queryParams: this.filterParams.value,
      queryParamsHandling,
      replaceUrl: true
    };
    this.router.navigate([], extras).then();
  }


  get postNatureIds(): FormArray {
    return this.primaryJobInfoForm.get('post_nature_ids') as FormArray;
  }

  get jobLevelIds(): FormArray {
    return this.moreJobInfoForm.get('job_level_ids') as FormArray;
  }

  get workspaceIds(): FormArray {
    return this.moreJobInfoForm.get('workspace_ids') as FormArray;
  }

  get degreeFormArray(): FormArray {
    return this.candidateRequirementForm.get('degrees') as FormArray;
  }

  // get instituteFormArray(): FormArray {
  //   return this.candidateRequirementForm.get('employer-change-password') as FormArray;
  // }

  get trainingFormArray(): FormArray {
    return this.candidateRequirementForm.get('trainings') as FormArray;
  }

  get certificateFormArray(): FormArray {
    return this.candidateRequirementForm.get('certificates') as FormArray;
  }

  get isExpRequired(): FormControl {
    return this.candidateRequirementForm.get('is_experience_require') as FormControl;
  }

  get matchingCriteriaFormArray(): FormArray {
    return this.matchingCriteriaForm.get('matching_criteria') as FormArray;
  }

  get ageMin(): FormControl {
    return this.candidateRequirementForm.get('age_min') as FormControl;
  }

  get ageMax(): FormControl {
    return this.candidateRequirementForm.get('age_max') as FormControl;
  }

  get expMin(): FormControl {
    return this.candidateRequirementForm.get('experience_min') as FormControl;
  }

  get expMax(): FormControl {
    return this.candidateRequirementForm.get('experience_max') as FormControl;
  }

  get salaryMin(): FormControl {
    return this.moreJobInfoForm.get('salary_min') as FormControl;
  }

  get salaryMax(): FormControl {
    return this.moreJobInfoForm.get('salary_max') as FormControl;
  }

  get gendersFormControl(): FormControl {
    return this.candidateRequirementForm.get('genders') as FormControl;
  }

  get jobLocations(): Array<any> {
    if (this.moreJobInfoForm.get('job_location')?.value === 'inside_bd') {
      return this.initialData.job_locations?.filter((item: any) => item.country_id === 1);
    } else {
      return this.initialData.job_locations?.filter((item: any) => item.country_id !== 1);
    }
  }

  get filteredCategories(): Array<any> {
    const categoryTypeId = +this.primaryJobInfoForm.get('category_type')?.value;
    if (categoryTypeId === 0 || categoryTypeId === 1) {
      const tagId = categoryTypeId === 0 ? 1 : 2;
      return this.initialData.categories.filter((item: any) => {
        if (item.category_type_id === 1 && item.tag_id === tagId) {
          return item;
        }
      });

    } else {
      return this.initialData.categories.filter((item: any) => {
        if (item.category_type_id === this.primaryJobInfoForm.get('category_type')?.value) {
          return item;
        }
      });
    }
  }

  get languageControl(): FormControl {
    return this.primaryJobInfoForm.get('language') as FormControl;
  }


  get filteredMaxAgeRange(): Array<any> {
    return this.experienceOptions.filter(x => x > +this.candidateRequirementForm.get('experience_min')?.value);
  }

}
