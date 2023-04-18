import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {CompanyRoutingModule} from './company-routing.module';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {DashboardContentComponent} from './components/dashboard-content/dashboard-content.component';
import {HeaderComponent} from './components/common/header/header.component';
import {SidebarComponent} from './components/common/sidebar/sidebar.component';
import {FooterComponent} from './components/common/footer/footer.component';
import {CvBankComponent} from './components/cv-bank/cv-bank.component';
import {JobPostingBoardComponent} from './components/job-posting-board/job-posting-board.component';
import {SelectModule} from '../../../../../common/includes/shared/elements/select/select.module';
import {SpinnerModule} from '../../../../../common/includes/shared/elements/spinner/spinner.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ReactiveErrorModule} from '../../../../../common/includes/shared/shared-directives/reactive-error/reactive-error.module';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {ApplicantProcessComponent} from './components/applicant-process/applicant-process.component';
import {JobPreviewComponent} from './components/applicant-process/job-preview/job-preview.component';
import {ApplicantsComponent} from './components/applicant-process/applicants/applicants.component';
import {JobViewResumeComponent} from './components/applicant-process/job-view-resume/job-view-resume.component';
import {PackagesComponent} from './components/packages/packages.component';
import {JobsComponent} from './components/packages/jobs/jobs.component';
import {SubscribeComponent} from './components/subscribe/subscribe.component';
import {ClipboardModule} from 'ngx-clipboard';
import {A11yModule} from '@angular/cdk/a11y';
import {EditCompanyComponent} from './components/edit-company/edit-company.component';
import {CVBanksComponent} from './components/packages/cv_banks/cv-banks.component';
import {AppModule} from '../../app.module';
import {SharedModule} from '../../shared/shared.module';
import {CvBankListComponent} from './components/cv-bank/cv-bank-list/cv-bank-list.component';
import {CvbankViewResumeComponent} from './components/cv-bank/cv-bank-list/cvbank-view-resume/cvbank-view-resume.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardContentComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    CvBankComponent,
    CvBankListComponent,
    CvbankViewResumeComponent,
    JobPostingBoardComponent,
    ApplicantProcessComponent,
    JobPreviewComponent,
    ApplicantsComponent,
    JobViewResumeComponent,
    PackagesComponent,
    JobsComponent,
    CVBanksComponent,
    SubscribeComponent,
    EditCompanyComponent,
  ],
  exports: [
    JobPreviewComponent,
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    NgbModule,
    SelectModule,
    SpinnerModule,
    ReactiveFormsModule,
    ReactiveErrorModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    ClipboardModule,
    A11yModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class CompanyModule {
}
