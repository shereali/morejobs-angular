import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SpinnerService} from '../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {SummaryService} from '../../../../../../common/includes/services/employees/summary.service';
import {ResumeDetailModel} from '../../../../../../common/includes/models/resume';

@Component({
  selector: 'app-home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss'],
})
export class HomeContentComponent implements OnInit {
  loading = true;
  summary: any;
  resume: ResumeDetailModel = {} as ResumeDetailModel;
  selectedOption = 'my_status';
  myStatusBtnCustomCss = {'background-color': 'white', color: 'blue'};
  resumeStatusBtnCustomCss = {'background-color': 'white', color: 'green'};

  panelTitle = '<i class="fas fa-chart-line"></i> My Status';

  resumeStatue = [
    {
      id: 1,
      title: 'Personal Details',
      routerLink: 'edit-resume',
      queryParams: {edit_option: 'personal', edit_type: 'personal_details'},
      is_completed: false,
      mode: 'edit'
    },
    {
      id: 2,
      title: 'Specialization',
      routerLink: 'edit-resume',
      queryParams: {edit_option: 'specialization', edit_type: 'specialization'},
      is_completed: false,
      mode: 'edit'
    },
    {
      id: 3,
      title: 'Academic Qualification',
      routerLink: 'edit-resume',
      queryParams: {edit_option: 'education_training', edit_type: 'academic'},
      is_completed: false,
      mode: 'edit'
    },
    {
      id: 4,
      title: 'Language Skills',
      routerLink: 'edit-resume',
      queryParams: {edit_option: 'specialization', edit_type: 'language'},
      is_completed: false,
      mode: 'edit'
    },
    {
      id: 5,
      title: 'Training',
      routerLink: 'edit-resume',
      queryParams: {edit_option: 'education_training', edit_type: 'training'},
      is_completed: false,
      mode: 'edit'
    },
    {
      id: 6,
      title: 'Reference',
      routerLink: 'edit-resume',
      queryParams: {edit_option: 'specialization', edit_type: 'references'},
      is_completed: false,
      mode: 'edit'
    },
    {
      id: 7,
      title: 'Professional Qualification',
      routerLink: 'edit-resume',
      queryParams: {edit_option: 'education_training', edit_type: 'certification'},
      is_completed: false,
      mode: 'edit'
    },
    {
      id: 8,
      title: 'Photograph',
      routerLink: 'edit-resume',
      queryParams: {edit_option: 'profile_image', edit_type: 'avatar_upload'},
      is_completed: false,
      mode: 'edit'
    },
    {
      id: 9,
      title: 'Experience',
      routerLink: 'edit-resume',
      queryParams: {edit_option: 'employment', edit_type: 'employment_history'},
      is_completed: false,
      mode: 'edit'
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ss: SummaryService,
    private spinner: SpinnerService
  ) {
    this.switchOption(this.selectedOption);
  }

  ngOnInit(): void {
    this.spinner.show('employee_summary_spinner');
    this.ss.loadSummary().then(res => {
      if (res.success === true) {
        this.summary = res.data;
        this.resume = res.data.resume;

        this.modifyResumeStatus();
      }
    }).finally(() => {
      this.loading = false;
      this.spinner.hide('employee_summary_spinner');
    });
  }

  switchOption(selectOption: string): void {
    this.selectedOption = selectOption;

    if (selectOption === 'my_status') {
      this.myStatusBtnCustomCss = {
        color: '#ffffff',
        'background-color': '#004db3',
      };
      this.resumeStatusBtnCustomCss = {'background-color': 'white', color: 'green'};
      this.panelTitle = '<i class="fas fa-chart-line"></i> My Status';

    } else {
      this.resumeStatusBtnCustomCss = {
        color: '#ffffff',
        'background-color': '#008020',
      };
      this.myStatusBtnCustomCss = {'background-color': 'white', color: 'blue'};
      this.panelTitle = '<i class="fas fa-file-alt"></i> Resume Status';
    }
  }

  private modifyResumeStatus(): void {
    this.resumeStatue.map(item => {
      if (item.id === 1) {
        if (this.resume.first_name && this.resume.last_name && this.resume.profile.dob && this.resume.profile.gender_id &&
          this.resume.profile.marital_status_id && this.resume.profile.nationality) {
          item.is_completed = true;
        }
      } else if (item.id === 2) {
        if (this.resume.specializations.length === 0) {
          item.mode = 'add';
        } else {
          item.is_completed = true;
        }
      } else if (item.id === 3) {
        if (this.resume.educations.length === 0) {
          item.mode = 'add';
        } else {
          item.is_completed = true;
        }
      } else if (item.id === 4) {
        if (this.resume.language_proficiencies.length === 0) {
          item.mode = 'add';
        } else {
          item.is_completed = true;
        }
      } else if (item.id === 5) {
        if (this.resume.trainings.length === 0) {
          item.mode = 'add';
        } else {
          item.is_completed = true;
        }
      } else if (item.id === 6) {
        if (this.resume.references.length === 0) {
          item.mode = 'add';
        } else {
          item.is_completed = true;
        }
      } else if (item.id === 7) {
        if (this.resume.certifications.length === 0) {
          item.mode = 'add';
        } else {
          item.is_completed = true;
        }
      } else if (item.id === 8) {
        if (this.resume.image) {
          item.is_completed = true;
        }
      } else if (item.id === 9) {
        if (this.resume.job_experiences.length === 0) {
          item.mode = 'add';
        } else {
          item.is_completed = true;
        }
      }
    });
  }
}
