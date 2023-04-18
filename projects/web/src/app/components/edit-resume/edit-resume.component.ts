import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ResumeService} from '../../../../../common/includes/services/resume.service';
import {
  PersonalDetailModel,
  ResumeEditInitialDataModel,
  UserContactModal
} from '../../../../../common/includes/models/resume';
import {environment} from '../../../../../common/src/environments/environment';
import * as _ from 'lodash';
import {SpinnerService} from '../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../common/includes/services/toast.service';
import {FilterParams, ObjectMap} from '../../../../../common/includes/utilities/filterParams';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {CookieService} from 'ngx-cookie-service';
import {CustomCookieServiceService} from '../../../../../common/includes/services/CustomCookieService.service';
import {AuthService} from '../../../../../common/includes/services/auth.service';

@Component({
  selector: 'app-edit-resume',
  templateUrl: './edit-resume.component.html',
  styleUrls: ['./edit-resume.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditResumeComponent {
  apiUrl = environment.apiUrl;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'title',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  editOption = 'personal';
  editType = 'personal_details';
  mode = 'view';
  modeClass = 'formControl-viewMode';
  avatarActionMode = 'view';
  isCollapsed = false;
  limit = {
    max_preferred_job_cat_fun: 3,
    max_preferred_job_special_skill: 3,
    max_preferred_job_loc_in: 15,
    max_preferred_job_loc_out: 10,
    max_preferred_org_types: 12,
  };

  submitAttempt = false;
  isLoading = true;

  resumeData: PersonalDetailModel | any;
  initialData: ResumeEditInitialDataModel | any;

  userAcademics = [];

  selectedFile: { src: string, file: File } | {} = {};

  filterParams = new FilterParams();

  personalDetailsForm = new FormGroup({
    first_name: new FormControl(null, Validators.required),
    last_name: new FormControl(null, Validators.required),
    father_name: new FormControl(),
    mother_name: new FormControl(),
    dob: new FormControl(null, Validators.required),
    gender_id: new FormControl(null, Validators.required),
    religion_id: new FormControl(),
    marital_status_id: new FormControl(null, Validators.required),
    nationality: new FormControl('Bangladeshi', Validators.required),
    is_bd_nationality: new FormControl({value: 'Bangladeshi', disabled: true}),
    country_id: new FormControl(null),
    nid_no: new FormControl(),
    passport_no: new FormControl(),
    passport_issue_date: new FormControl(),
    contact_mobiles: this.fb.array([
      this.fb.group({title: [null], type: [2]}),
      this.fb.group({title: [null], type: [2]})
    ]),
    contact_emails: this.fb.array([
      this.fb.group({title: [null, Validators.email], type: [1]}),
      this.fb.group({title: [null, Validators.email], type: [1]})
    ]),
  });

  addressForm = new FormGroup({
    same_as_present_address: new FormControl(false),
    present_address: this.fb.group({
      address_present: new FormControl(null, Validators.required),
      district_present: new FormControl(null),
      thana_present: new FormControl(null),
      po_present: new FormControl(null),
      is_present_address_inside: new FormControl({value: 1, disabled: true}, Validators.required),
      present_area_id_outside: new FormControl(null),
    }),
    permanent_address: this.fb.group({
      address_permanent: new FormControl(null),
      district_permanent: new FormControl(null),
      thana_permanent: new FormControl(null),
      po_permanent: new FormControl(null),
      is_permanent_address_inside: new FormControl({value: 1, disabled: true}, Validators.required),
      permanent_area_id_outside: new FormControl(null),
    })
  });

  careerInfoForm = new FormGroup({
    objective: new FormControl(null, Validators.required),
    present_salary: new FormControl(),
    expected_salary: new FormControl(),
    job_level_id: new FormControl(),
    job_nature_id: new FormControl(),
  });

  preferredAreaForm = new FormGroup({
    preferred_job_categories: new FormArray([]),
    preferred_job_categories_special_skill: new FormArray([]),
    preferred_areas: new FormControl([]),
    preferred_countries: new FormControl([]),
    preferred_org_types: new FormControl([]),
  });

  otherInfoForm = new FormGroup({
    career_summary: new FormControl(),
    specialization: new FormControl(),
    keywords: new FormControl(null, Validators.required),
  });

  employmentForm = new FormGroup({
    experiences: this.fb.array([]),
  });

  specializationForm = new FormGroup({
    skills: this.fb.array([], [Validators.required, Validators.max(3)]),
  });

  languageForm = new FormGroup({
    languages: this.fb.array([]),
  });

  referenceForm = new FormGroup({
    references: this.fb.array([]),
  });

  educationForm = new FormGroup({
    educations: this.fb.array([]),
  });

  trainingForm = new FormGroup({
    trainings: this.fb.array([]),
  });

  certificateForm = new FormGroup({
    certificates: this.fb.array([]),
  });

  constructor(
    private as: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private rs: ResumeService,
    private spinner: SpinnerService,
    private ts: ToastService,
    public cookieService: CookieService,
    private customCookieService: CustomCookieServiceService) {
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  private handleQueryParams(params: ObjectMap): void {
    this.editOption = params.edit_option || 'personal';
    this.editType = params.edit_type || 'personal_details';

    this.mode = 'edit';
    this.switchMode();

    this.filterParams.setFilterFromQueryParams(params);

    this.initiate();
  }

  initiate(): void {
    this.isLoading = true;
    this.spinner.show('view_form_spinner');
    this.rs.personalDetails(this.mode, this.editOption, this.editType)
      .then((res) => {
        if (res.success) {
          this.resumeData = res.data.resume_data;
          this.initialData = res.data.initial_data;

          this.isLoading = false;

          this.prepareFormWithData();
        }
      }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('view_form_spinner');
    });
  }

  prepareFormWithData(): any {
    if (this.editOption === 'personal') {
      if (this.editType === 'personal_details' && this.resumeData) {
        this.firstName.setValue(this.resumeData.first_name);
        this.lastName.setValue(this.resumeData.last_name);
        this.fatherName.setValue(this.resumeData.profile?.father_name);
        this.motherName.setValue(this.resumeData.profile?.mother_name);
        this.dob.setValue(this.resumeData.profile?.dob);
        this.genderId.setValue(this.resumeData.profile?.gender_id);
        this.religionId.setValue(this.resumeData.profile?.religion_id);
        this.maritalStatusId.setValue(this.resumeData.profile?.marital_status_id);
        this.nationality.setValue(this.resumeData.profile?.nationality);
        // tslint:disable-next-line:max-line-length
        this.personalDetailsForm.get('is_bd_nationality')?.setValue(this.resumeData.profile?.nationality === 'Bangladeshi' || this.resumeData.profile?.nationality === 'bangladeshi');
        this.countryId.setValue(this.resumeData.profile?.country_id);
        this.nid.setValue(this.resumeData.profile?.nid_no);
        this.personalDetailsForm.get('passport_no')?.setValue(this.resumeData.profile?.passport_no);
        this.personalDetailsForm.get('passport_issue_date')?.setValue(this.resumeData.profile?.passport_issue_date);

        this.resumeData.contact_mobiles.forEach((item: UserContactModal, i: number) => {
          this.contactMobiles.controls[i].get('title')?.setValue(item.title);
        });

        this.resumeData.contact_emails.forEach((item: UserContactModal, i: number) => {
          this.contactEmails.controls[i].get('title')?.setValue(item.title);
        });

      } else if (this.editType === 'address' && this.resumeData.profile) {
        this.sameAsPresentAddress.setValue(false);

        if (this.resumeData.profile.present_area) {
          this.isPresentAddressInside.setValue(this.resumeData.profile.present_area?.country_id === 1 ? 1 : 0);
        } else {
          this.isPresentAddressInside.setValue(1);
        }

        if (this.resumeData.profile.permanent_area) {
          this.isPermanentAddressInside.setValue(this.resumeData.profile.permanent_area?.country_id === 1 ? 1 : 0);
        } else {
          this.isPermanentAddressInside.setValue(1);
        }

        this.presentAddress.setValue(this.resumeData.profile.present_address);
        this.permanentAddress.setValue(this.resumeData.profile.permanent_address);
        // this.presentAreaId.setValue(this.resumeData.profile.present_area_id);

        if (this.resumeData.profile.present_area) {
          if (this.resumeData.profile.present_area?.country_id === 1) {
           // this.isPermanentAddressInside.setValue(1);

            if (this.resumeData.profile.present_area.level === 1) {
              this.presentDistrict.setValue(this.resumeData.profile.present_area.id);
            } else if (this.resumeData.profile.present_area.level === 2) {
              this.presentDistrict.setValue(this.resumeData.profile.present_area.parent_id);
              this.addressForm.get('present_address')?.get('thana_present')?.setValue(this.resumeData.profile.present_area.id);

            } else if (this.resumeData.profile.present_area.level === 3) {
              this.presentDistrict.setValue(this.resumeData.profile.present_area.parent.parent_id);
              this.addressForm.get('present_address')?.get('thana_present')?.setValue(this.resumeData.profile.present_area.parent_id);
              // this.addressForm.get('present_address')?.get('po_present')?.setValue(this.resumeData.profile.present_area.id);
            }

            this.addressForm.get('present_address')?.get('po_present')?.setValue(this.resumeData.profile.present_po); //temporary
          } else {
           // this.isPermanentAddressInside.setValue(0);
            this.presentAreaIdOutside.setValue(this.resumeData.profile.present_area.id);
          }
        }

        if (this.resumeData.profile.permanent_area) {
          if (this.resumeData.profile.permanent_area?.country_id === 1) {
           // this.isPermanentAddressInside.setValue(1);

            if (this.resumeData.profile.permanent_area.level === 1) {
              this.permanentDistrict.setValue(this.resumeData.profile.permanent_area.id);
            } else if (this.resumeData.profile.permanent_area.level === 2) {
              this.permanentDistrict.setValue(this.resumeData.profile.permanent_area.parent_id);
              this.addressForm.get('permanent_address')?.get('thana_permanent')?.setValue(this.resumeData.profile.permanent_area.id);

            } else if (this.resumeData.profile.permanent_area.level === 3) {
              this.permanentDistrict.setValue(this.resumeData.profile.permanent_area.parent.parent_id);
              this.addressForm.get('permanent_address')?.get('thana_permanent')?.setValue(this.resumeData.profile.permanent_area.parent_id);
              // this.addressForm.get('permanent_address')?.get('po_permanent')?.setValue(this.resumeData.profile.permanent_area.id);
            }

            this.addressForm.get('permanent_address')?.get('po_permanent')?.setValue(this.resumeData.profile.permanent_po); //temporary
          } else {
           // this.isPermanentAddressInside.setValue(0);
            this.permanentAreaIdOutside.setValue(this.resumeData.profile.permanent_area.id);
          }
        }

      } else if (this.editType === 'career_objective' && this.resumeData.profile) {
        this.objective.setValue(this.resumeData.profile.objective);
        this.presentSalary.setValue(this.resumeData.profile.present_salary);
        this.expectedSalary.setValue(this.resumeData.profile.expected_salary);
        this.jobLevelId.setValue(this.resumeData.profile.job_level_id);
        this.jobNatureId.setValue(this.resumeData.profile.job_nature_id);

      } else if (this.editType === 'preferred_area') {
        this.preferredJobCategoriesFunctional.setValue([]);
        this.preferredJobCategoriesSpecialSkill.setValue([]);

        this.resumeData.preferred_job_categories.filter((x: any) => x.category_type_id === 1).forEach((item: any) => {
          this.preferredJobCategoriesFunctional.push(new FormControl(item.id));
        });

        this.resumeData.preferred_job_categories.filter((x: any) => x.category_type_id === 2).forEach((item: any) => {
          this.preferredJobCategoriesSpecialSkill.push(new FormControl(item.id));
        });

        this.preferredAreaForm.get('preferred_areas')?.setValue(this.resumeData.preferred_areas);
        this.preferredAreaForm.get('preferred_countries')?.setValue(this.resumeData.preferred_areas_outside_bd);
        this.preferredAreaForm.get('preferred_org_types')?.setValue(this.resumeData.preferred_organization_types);

      } else if (this.editType === 'other' && this.resumeData.profile) {
        this.careerSummary.setValue(this.resumeData.profile.career_summary);
        this.specialization.setValue(this.resumeData.profile.specialization);
        this.keywords.setValue(this.resumeData.profile.keywords);
      }

    } else if (this.editOption === 'employment') {
      if (this.editType === 'employment_history') {
        this.experiences.setValue([]);
        this.resumeData.job_experiences.forEach((item: any, i: number) => {
          this.experiences.push(this.fb.group({
            id: item.id,
            mode: 'view',
            mode_class: 'formControl-viewMode',
            company_name: item.company_name,
            industry_type_id: item.industry_type_id,
            designation: item.designation,
            department: item.department,
            address: item.address,
            responsibilities: item.responsibilities,
            from: item.from,
            to: item.to,
            is_current: item.is_current,
            experience_skills: [item.experience_skills],
          }));
        });
      }
    } else if (this.editOption === 'specialization') {
      if (this.editType === 'specialization') {
        this.skills.setValue([]);
        if (this.resumeData.specializations.length > 0) {
          this.skills.push(this.fb.group({
            mode: 'view',
            mode_class: 'formControl-viewMode',
            skill_id: new FormControl(this.resumeData.specializations, [Validators.required]),
          }));
        }
      } else if (this.editType === 'language') {
        this.languages.setValue([]);

        this.resumeData.language_proficiencies.forEach((item: any, i: number) => {
          this.languages.push(this.fb.group({
            id: item.id,
            mode: 'view',
            mode_class: 'formControl-viewMode',
            title: new FormControl(item.title, Validators.required),
            reading_skill: new FormControl(item.reading_skill, Validators.required),
            writing_skill: new FormControl(item.writing_skill, Validators.required),
            speaking_skill: new FormControl(item.speaking_skill, Validators.required),
          }));
        });
      } else if (this.editType === 'references') {
        this.references.setValue([]);

        this.resumeData.references.forEach((item: any, i: number) => {
          this.references.push(this.fb.group({
            id: item.id,
            mode: 'view',
            mode_class: 'formControl-viewMode',
            name: new FormControl(item.name, Validators.required),
            designation: new FormControl(item.designation, Validators.required),
            organization: new FormControl(item.organization, Validators.required),
            email: new FormControl(item.email),
            mobile: item.mobile,
            phone: item.phone,
            address: item.address,
            relation_type: item.relation_type.id,
          }));
        });
      }
    } else if (this.editOption === 'education_training') {
      if (this.editType === 'academic') {
        this.educations.setValue([]);

        this.resumeData.educations.forEach((item: any, i: number) => {
          this.educations.push(this.fb.group({
            id: item.id,
            mode: 'view',
            mode_class: 'formControl-viewMode',
            education_level_id: new FormControl(item.education_level_id, Validators.required),
            degree_id: new FormControl(item.degree_id, Validators.required),
            major: new FormControl(item.major),
            duration: new FormControl(item.duration, Validators.required),
            institute_name: new FormControl(item.institute_name, Validators.required),
            achievement: item.achievement,
            hide_mark: item.hide_mark,
            result_type_id: new FormControl(item.result_type_id, Validators.required),
            passing_year: new FormControl(item.passing_year, Validators.required),
            cgpa: new FormControl(item.cgpa, Validators.required),
          }));
        });
      } else if (this.editType === 'training') {
        this.trainings.setValue([]);

        this.resumeData.trainings.forEach((item: any, i: number) => {
          this.trainings.push(this.fb.group({
            id: item.id,
            mode: 'view',
            mode_class: 'formControl-viewMode',
            title: new FormControl(item.title, Validators.required),
            topic: new FormControl(item.topic, Validators.required),
            country_id: new FormControl(item.country_id, Validators.required),
            year: new FormControl(item.year, Validators.required),
            duration: new FormControl(item.duration, Validators.required),
            institute_name: new FormControl(item.institute_name, Validators.required),
            address: new FormControl(item.address, Validators.required),
          }));
        });
      } else if (this.editType === 'certification') {
        this.certificates.setValue([]);

        this.resumeData.certifications.forEach((item: any, i: number) => {
          this.certificates.push(this.fb.group({
            id: item.id,
            mode: 'view',
            mode_class: 'formControl-viewMode',
            title: new FormControl(item.title, Validators.required),
            institute_name: new FormControl(item.institute_name, Validators.required),
            from: new FormControl(item.from, Validators.required),
            to: new FormControl(item.to, Validators.required),
            address: new FormControl(item.address),
          }));
        });
      }
    }
  }

  switchMode(): void {
    this.mode = this.mode === 'view' ? 'edit' : 'view';
    this.modeClass = this.mode === 'view' ? 'formControl-viewMode' : '';

    this.resetFormFields();
  }

  switchArrayMode(item: any): void {
    let currentMode = item.get('mode')?.value;

    currentMode = currentMode === 'view' ? 'edit' : 'view';
    const currentModeClass = currentMode === 'view' ? 'formControl-viewMode' : '';

    item.get('mode').setValue(currentMode);
    item.get('mode_class').setValue(currentModeClass);
  }

  resetFormFields(): void {
    if (this.editType === 'career_objective') {
      if (this.mode === 'view') {
        this.jobLevelId.disable();
        this.jobNatureId.disable();
      } else {
        this.jobLevelId.enable();
        this.jobNatureId.enable();
      }
    } else if (this.editType === 'address') {
      if (this.mode === 'view') {
        this.isPresentAddressInside.disable();
        this.isPermanentAddressInside.disable();
      } else {
        this.isPresentAddressInside.enable();
        this.isPermanentAddressInside.enable();
      }
    } else if (this.editType === 'personal_details') {
      if (this.mode === 'view') {
        this.personalDetailsForm.get('is_bd_nationality')?.disable();
      } else {
        this.personalDetailsForm?.get('is_bd_nationality')?.enable();
      }
    }
  }

  resetEditType(editOption: string = '', editType: string): void {
    this.editOption = editOption;
    this.editType = editType;

    this.filterParams.set('edit_option', this.editOption);
    this.filterParams.set('edit_type', this.editType);
    this.navigateWithFilterParams();
  }

  resetEditOption(editOption: string, editType: string): void {
    this.editOption = editOption;
    this.editType = editType;

    this.filterParams.set('edit_option', this.editOption);
    this.filterParams.set('edit_type', this.editType);
    this.navigateWithFilterParams();
  }

  setSameAsPresentAddress(event: any): void {
    if (event.target.checked) {
      this.permanentAddress.disable();
      this.isPermanentAddressInside.disable();
      this.permanentAddress.disable();
      this.permanentDistrict.disable();
      this.permanentThana.disable();
      this.permanentPO.disable();
      this.permanentAreaIdOutside.disable();
    } else {
      this.permanentAddress.enable();
      this.isPermanentAddressInside.enable();
      this.presentAddress.enable();
      this.permanentDistrict.enable();
      this.permanentThana.enable();
      this.permanentPO.enable();
      this.permanentAreaIdOutside.enable();
    }
  }

  onChangeFnJobCategories(event: any): void {
    if (event.target.checked) {
      this.preferredJobCategoriesFunctional.push(new FormControl(+event.target.value));

      if (this.preferredJobCategoriesFunctional.controls.length === this.limit.max_preferred_job_cat_fun) {
        this.initialData.job_categories_functional.map((item: any) => {
          if (!this.preferredJobCategoriesFunctional.value.includes(item.id)) {
            item.disabled = true;
          }
        });
      }

    } else {
      if (this.preferredJobCategoriesFunctional.controls.length === this.limit.max_preferred_job_cat_fun) {
        this.initialData.job_categories_functional.map((item: any) => {
          if (item.disabled === true) {
            item.disabled = false;
          }
        });
      }

      let i = 0;
      this.preferredJobCategoriesFunctional.controls.forEach((item) => {
        if (item.value === +event.target.value) {
          this.preferredJobCategoriesFunctional.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onChangeSpecialSkillJobCategories(event: any): void {
    if (event.target.checked) {
      this.preferredJobCategoriesSpecialSkill.push(new FormControl(+event.target.value));

      if (this.preferredJobCategoriesSpecialSkill.controls.length === this.limit.max_preferred_job_special_skill) {
        this.initialData.job_categories_special_skill.map((item: any) => {
          if (!this.preferredJobCategoriesSpecialSkill.value.includes(item.id)) {
            item.disabled = true;
          }
        });
      }

    } else {
      if (this.preferredJobCategoriesSpecialSkill.controls.length === this.limit.max_preferred_job_special_skill) {
        this.initialData.job_categories_special_skill.map((item: any) => {
          if (item.disabled === true) {
            item.disabled = false;
          }
        });
      }

      let i = 0;
      this.preferredJobCategoriesSpecialSkill.controls.forEach((item) => {
        if (item.value === +event.target.value) {
          this.preferredJobCategoriesSpecialSkill.removeAt(i);
          return;
        }
        i++;
      });
    }
  }


  /*Employment History*/
  addExpSkill(item: any, skill: any): void {
    const expSkills = item.get('experience_skills').value;

    if (expSkills.find((x: any) => x.id === skill.id)) {
      alert(`This skill is already exits!`);
    } else if (expSkills.length >= 3) {
      alert(`You cannot add more than 3 skill!`);
    } else {
      const expSkillFA = item.controls.experience_skills as FormArray;
      expSkillFA.push(this.fb.group(skill));
    }
  }

  removeExpSkill(item: any, elementId: number): void {
    const expSkillFA = item.controls.experience_skills as FormArray;
    expSkillFA.removeAt(expSkillFA.value.findIndex((x: { id: number; }) => x.id === elementId));
  }

  updateEmploymentExp(item: any): void {
    const formData = item.value;
    formData.edit_option = this.editOption;
    formData.edit_type = this.editType;

    this.submitAttempt = true;
    this.rs.updateEmploymentExperience(formData).then(res => {
      this.ts.apiMessage(res);
    }).finally(() => {
      this.submitAttempt = false;
    });
  }

  addNewExperience(): void {
    this.experiences.push(this.fb.group({
      mode: 'store',
      mode_class: '',
      company_name: new FormControl('', Validators.required),
      industry_type_id: new FormControl('', Validators.required),
      designation: new FormControl('', Validators.required),
      department: new FormControl(''),
      address: new FormControl(''),
      responsibilities: new FormControl(''),
      from: new FormControl(null, Validators.required),
      to: new FormControl(null),
      is_current: new FormControl(false),
      experience_skills: new FormControl([], Validators.required),
    }));
  }

  removeExperience(position: number): void {
    this.experiences.removeAt(position);
  }

  deleteExperience(item: any, position: number): void {
    this.spinner.show('view_form_spinner');
    this.rs.deleteExperience(item.value.id).then(res => {
      this.spinner.hide('view_form_spinner');
      this.ts.apiMessage(res);
      if (res.success) {
        this.removeExperience(position);
      }
    });
  }

  addNewEducation(): void {
    this.educations.push(this.fb.group({
      id: null,
      mode: 'store',
      mode_class: '',
      education_level_id: new FormControl('', Validators.required),
      degree_id: new FormControl('', Validators.required),
      major: new FormControl(null),
      hide_mark: false,
      passing_year: new FormControl('', Validators.required),
      duration: new FormControl(null),
      institute_name: new FormControl('', Validators.required),
      achievement: new FormControl(null),
      cgpa: new FormControl(null, Validators.required),
      result_type_id: new FormControl('', Validators.required),
    }));
  }

  removeEducation(position: number): void {
    this.educations.removeAt(position);
  }

  deleteEducation(item: any, position: number): void {
    this.spinner.show('view_form_spinner');
    this.rs.deleteEducation(item.value.id).then(res => {
      this.spinner.hide('view_form_spinner');
      this.ts.apiMessage(res);
      if (res.success) {
        this.removeEducation(position);
      }
    });
  }

  addNewTraining(): void {
    this.trainings.push(this.fb.group({
      id: null,
      mode: 'store',
      mode_class: '',
      title: new FormControl(null, Validators.required),
      topic: new FormControl(null, Validators.required),
      country_id: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required),
      duration: new FormControl(null, Validators.required),
      institute_name: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
    }));
  }

  removeTraining(position: number): void {
    this.trainings.removeAt(position);
  }

  deleteTraining(item: any, position: number): void {
    this.spinner.show('view_form_spinner');
    this.rs.deleteTraining(item.value.id).then(res => {
      this.spinner.hide('view_form_spinner');
      this.ts.apiMessage(res);
      if (res.success) {
        this.removeTraining(position);
      }
    });
  }

  addNewCertificate(): void {
    this.certificates.push(this.fb.group({
      id: null,
      mode: 'store',
      mode_class: '',
      title: new FormControl(null, Validators.required),
      institute_name: new FormControl(null, Validators.required),
      from: new FormControl(null, Validators.required),
      to: new FormControl(null, Validators.required),
      address: new FormControl(null),
    }));
  }

  removeCertificate(position: number): void {
    this.certificates.removeAt(position);
  }

  deleteCertificate(item: any, position: number): void {
    this.spinner.show('view_form_spinner');
    this.rs.deleteCertificate(item.value.id).then(res => {
      this.spinner.hide('view_form_spinner');
      this.ts.apiMessage(res);
      if (res.success) {
        this.removeCertificate(position);
      }
    });
  }

  addNewSkill(): void {
    this.skills.push(this.fb.group({
      id: null,
      mode: 'store',
      mode_class: '',
      skill_id: new FormControl([], [Validators.required]),
      learning_technique_id: new FormControl(null),
    }));
  }

  removeSkill(position: number): void {
    this.skills.removeAt(position);
  }

  deleteSkill(position: number): void {
    const formData = {
      edit_option: this.editOption,
      edit_type: this.editType,
      skill_id: []
    };

    this.spinner.show('view_form_spinner');
    this.submitAttempt = true;
    this.rs.updateSkill(formData).then(res => {
      this.ts.apiMessage(res);
      if (res.success) {
        this.removeSkill(position);
      }
    }).finally(() => {
      this.spinner.hide('view_form_spinner');
      this.submitAttempt = false;
    });
  }

  addNewLanguage(): void {
    this.languages.push(this.fb.group({
      id: null,
      mode: 'store',
      mode_class: '',
      title: new FormControl('', Validators.required),
      reading_skill: new FormControl('', Validators.required),
      writing_skill: new FormControl('', Validators.required),
      speaking_skill: new FormControl('', Validators.required),
    }));
  }

  removeLanguage(position: number): void {
    this.languages.removeAt(position);
  }

  deleteLanguage(item: any, position: number): void {
    this.spinner.show('view_form_spinner');
    this.rs.deleteLanguage(item.value.id).then(res => {
      this.spinner.hide('view_form_spinner');
      this.ts.apiMessage(res);
      if (res.success) {
        this.removeLanguage(position);
      }
    });
  }

  addNewReference(): void {
    this.references.push(this.fb.group({
      id: null,
      mode: 'store',
      mode_class: '',
      name: new FormControl('', Validators.required),
      designation: new FormControl('', Validators.required),
      organization: new FormControl('', Validators.required),
      email: '',
      mobile: '',
      phone: '',
      address: '',
      relation_type: new FormControl(null, Validators.required),
    }));
  }

  removeReference(position: number): void {
    this.references.removeAt(position);
  }

  deleteReference(item: any, position: number): void {
    this.spinner.show('view_form_spinner');
    this.rs.deleteReference(item.value.id).then(res => {
      this.spinner.hide('view_form_spinner');
      this.ts.apiMessage(res);
      if (res.success) {
        this.removeReference(position);
      }
    });
  }

  updateData(item: any, editType = '', mode = 'array'): void {
    if (item.valid) {
      const formData = item.value;
      formData.edit_option = this.editOption;
      formData.edit_type = this.editType;

      this.spinner.show('view_form_spinner');
      this.submitAttempt = true;
      this.rs.updateData(formData).then(res => {
        this.ts.apiMessage(res);
        if (res.success) {
          if (editType === 'personal_details') {
            const user = _.pick(res.data, ['id', 'first_name', 'last_name', 'user_type', 'image', 'status', 'resume_completed']);

            if (user.first_name !== this.as.getUser().first_name) {
              window.location.reload();
            }

            this.customCookieService.setCookie('user', JSON.stringify(user));
          }

          if (mode === 'array') {
            if (res.data.optional_id) {
              item.id = res.data.optional_id;
            }
            this.switchArrayMode(item);
          } else {
            this.switchMode();
          }
        }
      }).finally(() => {
        this.spinner.hide('view_form_spinner');
        this.submitAttempt = false;
      });
    } else {
      this.ts.error('Please fill up the form properly');
    }
  }

  /*Employment History End*/

  /*Profile picture upload section start...*/
  uploadAvatar(imageInput: any, actionType = 'upload'): void {
    const file: File | '' = imageInput ? imageInput.files[0] : '';

    if (actionType === 'upload' && !file) {
      this.ts.error('Please select an image');
    } else {
      this.submitAttempt = true;
      this.spinner.show('view_form_spinner');
      this.rs.uploadAvatar(file, this.editOption).then(res => {
        this.ts.apiMessage(res);
        if (res.success) {
          window.location.reload();
          this.resumeData = res.data;
          this.customCookieService.setCookie('user', JSON.stringify(res.data));
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('view_form_spinner');
      });
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

  /*Profile picture upload section end*/

  get firstName(): FormControl {
    return this.personalDetailsForm.get('first_name') as FormControl;
  }

  get lastName(): FormControl {
    return this.personalDetailsForm.get('last_name') as FormControl;
  }

  get fatherName(): FormControl {
    return this.personalDetailsForm.get('father_name') as FormControl;
  }

  get motherName(): FormControl {
    return this.personalDetailsForm.get('mother_name') as FormControl;
  }

  get dob(): FormControl {
    return this.personalDetailsForm.get('dob') as FormControl;
  }

  get genderId(): FormControl {
    return this.personalDetailsForm.get('gender_id') as FormControl;
  }

  get religionId(): FormControl {
    return this.personalDetailsForm.get('religion_id') as FormControl;
  }

  get maritalStatusId(): FormControl {
    return this.personalDetailsForm.get('marital_status_id') as FormControl;
  }

  get nationality(): FormControl {
    return this.personalDetailsForm.get('nationality') as FormControl;
  }

  get countryId(): FormControl {
    return this.personalDetailsForm.get('country_id') as FormControl;
  }

  get nid(): FormControl {
    return this.personalDetailsForm.get('nid_no') as FormControl;
  }

  get contactMobiles(): FormArray {
    return this.personalDetailsForm.get('contact_mobiles') as FormArray;
  }

  get contactEmails(): FormArray {
    return this.personalDetailsForm.get('contact_emails') as FormArray;
  }

  get presentFC(): any {
    return this.addressForm.get('present_address');
  }

  get presentAddress(): FormControl {
    return this.presentFC.get('address_present') as FormControl;
  }

  get presentDistrict(): FormControl {
    return this.presentFC.get('district_present') as FormControl;
  }

  get presentThana(): FormControl {
    return this.presentFC.get('thana_present') as FormControl;
  }

  get presentPO(): FormControl {
    return this.presentFC.get('po_present') as FormControl;
  }

  get presentAreaIdOutside(): FormControl {
    return this.presentFC.get('present_area_id_outside') as FormControl;
  }

  get isPresentAddressInside(): FormControl {
    return this.presentFC.get('is_present_address_inside') as FormControl;
  }


  get permanentFC(): any {
    return this.addressForm.get('permanent_address');
  }

  get permanentAddress(): FormControl {
    return this.permanentFC.get('address_permanent') as FormControl;
  }

  get permanentDistrict(): FormControl {
    return this.permanentFC.get('district_permanent') as FormControl;
  }

  get permanentThana(): FormControl {
    return this.permanentFC.get('thana_permanent') as FormControl;
  }

  get permanentPO(): FormControl {
    return this.permanentFC.get('po_permanent') as FormControl;
  }

  get permanentAreaIdOutside(): FormControl {
    return this.permanentFC.get('permanent_area_id_outside') as FormControl;
  }


  get isPermanentAddressInside(): FormControl {
    return this.permanentFC.get('is_permanent_address_inside') as FormControl;
  }

  get sameAsPresentAddress(): FormControl {
    return this.addressForm.get('same_as_present_address') as FormControl;
  }

  get objective(): FormControl {
    return this.careerInfoForm.get('objective') as FormControl;
  }

  get presentSalary(): FormControl {
    return this.careerInfoForm.get('present_salary') as FormControl;
  }

  get expectedSalary(): FormControl {
    return this.careerInfoForm.get('expected_salary') as FormControl;
  }

  get jobLevelId(): FormControl {
    return this.careerInfoForm.get('job_level_id') as FormControl;
  }

  get jobNatureId(): FormControl {
    return this.careerInfoForm.get('job_nature_id') as FormControl;
  }

  get careerSummary(): FormControl {
    return this.otherInfoForm.get('career_summary') as FormControl;
  }

  get specialization(): FormControl {
    return this.otherInfoForm.get('specialization') as FormControl;
  }

  get keywords(): FormControl {
    return this.otherInfoForm.get('keywords') as FormControl;
  }

  get preferredJobCategoriesFunctional(): FormArray {
    return this.preferredAreaForm.get('preferred_job_categories') as FormArray;
  }

  get preferredJobCategoriesSpecialSkill(): FormArray {
    return this.preferredAreaForm.get('preferred_job_categories_special_skill') as FormArray;
  }

  get preferredAreas(): FormControl {
    return this.preferredAreaForm.get('preferred_areas') as FormControl;
  }

  get preferredCountries(): FormControl {
    return this.preferredAreaForm.get('preferred_countries') as FormControl;
  }

  get preferredOrganizationTypes(): FormControl {
    return this.preferredAreaForm.get('preferred_org_types') as FormControl;
  }

  get experiences(): FormArray {
    return this.employmentForm.get('experiences') as FormArray;
  }

  get educations(): FormArray {
    return this.educationForm.get('educations') as FormArray;
  }

  get trainings(): FormArray {
    return this.trainingForm.get('trainings') as FormArray;
  }

  get certificates(): FormArray {
    return this.certificateForm.get('certificates') as FormArray;
  }

  get skills(): FormArray {
    return this.specializationForm.get('skills') as FormArray;
  }

  get languages(): FormArray {
    return this.languageForm.get('languages') as FormArray;
  }

  get references(): FormArray {
    return this.referenceForm.get('references') as FormArray;
  }

  get districts(): Array<any> {
    return this.initialData.areas.filter((item: any) => {
      return item.level === 1 && item.country_id === 1;
    });
  }

  thanas(id: any): Array<any> {
    return this.initialData.areas.filter((item: any) => {
      return item.parent_id === +id && item.country_id === 1;
    });
  }

  po(id: any): Array<any> {
    return this.initialData.areas.filter((item: any) => {
      return item.parent_id === +id && item.country_id === 1;
    });
  }

  get outsideAreas(): Array<any> {
    return this.initialData.areas.filter((item: any) => {
      return item.parent_id === null && item.country_id !== 1;
    });
  }

  maxLengthArray = (max: number) => {
    return (c: AbstractControl): { [p: string]: any } | null => {
      if (c.value.length > max) {
        return {MaxLengthArray: true};
      }
      return null;
    };
  };

  resetNationality(event: any): void {
    if (event.target.checked) {
      this.nationality.setValue('Bangladeshi');
    }
  }

  restoreImage(): void {
    const user = this.cookieService.get('user');
    if (user) {
      console.log(user);
      this.resumeData = JSON.parse(user);
    }
  }
}
