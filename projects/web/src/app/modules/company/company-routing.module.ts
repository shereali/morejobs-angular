import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {DashboardContentComponent} from './components/dashboard-content/dashboard-content.component';
import {CvBankComponent} from './components/cv-bank/cv-bank.component';
import {JobPostingBoardComponent} from './components/job-posting-board/job-posting-board.component';
import {ApplicantProcessComponent} from './components/applicant-process/applicant-process.component';
import {JobViewResumeComponent} from './components/applicant-process/job-view-resume/job-view-resume.component';
import {AuthGuard} from '../../guards/auth.guard';
import {PackagesComponent} from './components/packages/packages.component';
import {JobsComponent} from './components/packages/jobs/jobs.component';
import {SubscribeComponent} from './components/subscribe/subscribe.component';
import {EditCompanyComponent} from './components/edit-company/edit-company.component';
import {CVBanksComponent} from './components/packages/cv_banks/cv-banks.component';
import {CvBankListComponent} from './components/cv-bank/cv-bank-list/cv-bank-list.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardContentComponent
      },
      {
        path: 'home',
        component: DashboardContentComponent
      },
      {
        path: 'job-posting-board',
        component: JobPostingBoardComponent
      },
      {
        path: 'cv-bank',
        component: CvBankComponent
      },
      {
        path: 'cv-bank/:id',
        component: CvBankListComponent
      },
      {
        path: ':id/applicant-process',
        component: ApplicantProcessComponent
      },
      {
        path: 'job-view-resume',
        component: JobViewResumeComponent
      },
      {
        path: 'packages',
        component: PackagesComponent,
        children: [
          {
            path: 'jobs',
            component: JobsComponent
          },
          {
            path: 'cv-banks',
            component: CVBanksComponent
          }
        ]
      },
      {
        path: 'subscribe',
        component: SubscribeComponent
      },
      {
        path: 'edit-account',
        component: EditCompanyComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {
}
