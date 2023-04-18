import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/auth/login/login.component';
import {RegistrationComponent} from './components/auth/registration/registration.component';
import {NotFoundComponent} from './components/common/not-found/not-found.component';
import {HomeComponent} from './components/home/home.component';
import {HomeContentComponent} from './components/home/home-content/home-content.component';
import {EditResumeComponent} from './components/edit-resume/edit-resume.component';
import {ViewResumeComponent} from './components/view-resume/view-resume.component';
import {UploadResumeComponent} from './components/upload-resume/upload-resume.component';
import {OnlineApplicationComponent} from './components/online-application/online-application.component';
import {FavoriteJobsComponent} from './components/favorite-jobs/favorite-jobs.component';
import {FollowingCompanyComponent} from './components/following-company/following-company.component';
import {CompanyListComponent} from './components/company-list/company-list.component';
import {ResumeViewedComponent} from './components/resume-viewed/resume-viewed.component';
import {ResumeSummaryComponent} from './components/resume-viewed/resume-summary/resume-summary.component';
import {EmployerMessageComponent} from './components/employer-message/employer-message.component';
import {EmployerMessageDetailsComponent} from './components/employer-message/employer-message-details/employer-message-details.component';
import {AuthGuard} from './guards/auth.guard';
import {EmployerRegComponent} from './components/auth/employer-reg/employer-reg.component';
import {ErrorPageComponent} from './components/common/error-page/error-page.component';
import {ForgotPasswordComponent} from './components/auth/forgot-password/forgot-password.component';
import {ChangePasswordComponent} from './components/auth/change-password/change-password.component';
import {EmailResumeComponent} from './components/email-resume/email-resume.component';
import {AccountSettingsComponent} from './components/account-settings/account-settings.component';
import {SettingsComponent} from './modules/admin/components/settings/settings.component';
import {SettingContainerComponent} from './modules/admin/components/settings/setting-container/setting-container.component';
import {CategoriesComponent} from './modules/admin/components/settings/categories/categories.component';
import {IndustryComponent} from './modules/admin/components/settings/industry/industry.component';
import {InstitutesComponent} from './modules/admin/components/settings/institutes/institutes.component';
import {DegreesComponent} from './modules/admin/components/settings/degrees/degrees.component';
import {SkillsComponent} from './modules/admin/components/settings/skills/skills.component';
import {AreaComponent} from './modules/admin/components/settings/areas/area.component';
import {AccountSettingContainerComponent} from './components/account-settings/account-setting-container/account-setting-container.component';
import {EmployerChangePasswordComponent} from './components/account-settings/employer-change-password/employer-change-password.component';
import {ChangeUseridOptionsComponent} from './components/account-settings/change-userid-options/change-userid-options.component';
import {ChangeUseridComponent} from './components/account-settings/change-userid-options/change-userid/change-userid.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'employer-registration',
    component: EmployerRegComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
  {
    path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
  },
  ...['company', ':lang/company'].map(path => ({
    path,
    loadChildren: () => import('./modules/company/company.module').then(m => m.CompanyModule)
  })),
  ...['home', ':lang/home'].map(path => ({
    path,
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeContentComponent
      },
      {
        path: 'edit-resume',
        component: EditResumeComponent
      },
      {
        path: 'view-resume',
        component: ViewResumeComponent,
      },
      {
        path: 'upload-resume',
        component: UploadResumeComponent
      },
      {
        path: 'email-resume',
        component: EmailResumeComponent
      },
      {
        path: 'online-application',
        component: OnlineApplicationComponent
      },
      {
        path: 'favorite-jobs',
        component: FavoriteJobsComponent
      },
      {
        path: 'following-company',
        component: FollowingCompanyComponent
      },
      {
        path: 'company-list',
        component: CompanyListComponent
      },
      {
        path: 'resume-viewed',
        component: ResumeViewedComponent
      },
      {
        path: 'resume-summary',
        component: ResumeSummaryComponent
      },
      {
        path: 'employer-message',
        component: EmployerMessageComponent
      },
      {
        path: 'employer-message-details',
        component: EmployerMessageDetailsComponent
      },
      {
        path: 'account-settings',
        children: [
          {
            path: '',
            component: AccountSettingContainerComponent
          },
          {
            path: 'employer-change-password',
            component: EmployerChangePasswordComponent
          },
          {
            path: 'change-user-id-options',
            component: ChangeUseridOptionsComponent
          },
          {
            path: 'change-user-id',
            component: ChangeUseridComponent
          },
          // {
          //   path: 'industry',
          //   component: IndustryComponent
          // },
          // {
          //   path: 'employer-change-password',
          //   component: ChangeUseridComponent
          // },
          // {
          //   path: 'degrees',
          //   component: DegreesComponent
          // },
          // {
          //   path: 'account-settings-container',
          //   component: SkillsComponent
          // },
          // {
          //   path: 'areas',
          //   component: AreaComponent
          // }
        ]
      }
    ]
  })),
  {
    path: '**',
    component: NotFoundComponent
  },
  {
    path: 'error-404',
    component: ErrorPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
