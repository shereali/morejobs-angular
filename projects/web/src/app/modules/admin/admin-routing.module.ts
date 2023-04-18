import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {DashboardContentComponent} from './components/dashboard/dashboard-content/dashboard-content.component';
import {CompaniesComponent} from './components/companies/companies.component';
import {PostsComponent} from './components/posts/posts.component';
import {EmployeeComponent} from './components/employee/employee.component';
import {SettingsComponent} from './components/settings/settings.component';
import {AuthGuard} from '../../guards/auth.guard';
import {CategoriesComponent} from './components/settings/categories/categories.component';
import {IndustryComponent} from './components/settings/industry/industry.component';
import {InstitutesComponent} from './components/settings/institutes/institutes.component';
import {DegreesComponent} from './components/settings/degrees/degrees.component';
import {SkillsComponent} from './components/settings/skills/skills.component';
import {SettingContainerComponent} from './components/settings/setting-container/setting-container.component';
import {TrainersComponent} from './components/trainers/trainers.component';
import {TrainingsComponent} from './components/trainings/trainings.component';
import {ContentManagementComponent} from './components/content-management/content-management.component';
import {ContentManagementContainerComponent} from './components/content-management/content-management-container/content-management-container.component';
import {BlogsComponent} from './components/content-management/blogs/blogs.component';
import {AreaComponent} from './components/settings/areas/area.component';
import {AdsComponent} from './components/content-management/ads/ads.component';
import {SubscriptionsComponent} from './components/subscriptions/subscriptions.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: DashboardContentComponent
      },
      {
        path: 'companies',
        component: CompaniesComponent
      },
      {
        path: 'subscriptions',
        component: SubscriptionsComponent
      },
      {
        path: 'posts',
        component: PostsComponent
      },
      {
        path: 'employee',
        component: EmployeeComponent
      },
      {
        path: 'trainers',
        component: TrainersComponent
      },
      // {
      //   path: 'trainings',
      //   component: TrainingsComponent
      // },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          {
            path: '',
            component: SettingContainerComponent
          },
          {
            path: 'categories',
            component: CategoriesComponent
          },
          {
            path: 'industry',
            component: IndustryComponent
          },
          {
            path: 'institutes',
            component: InstitutesComponent
          },
          {
            path: 'degrees',
            component: DegreesComponent
          },
          {
            path: 'skills',
            component: SkillsComponent
          },
          {
            path: 'areas',
            component: AreaComponent
          }
        ]
      },
      {
        path: 'content-management',
        component: ContentManagementComponent,
        children: [
          {
            path: '',
            component: ContentManagementContainerComponent
          },
          {
            path: 'trainings',
            component: TrainingsComponent
          },
          {
            path: 'admissions',
            component: BlogsComponent,
          },
          {
            path: 'events',
            component: BlogsComponent,
          },
          {
            path: 'scholarships',
            component: BlogsComponent,
          },
          {
            path: 'articles',
            component: BlogsComponent,
          },
          {
            path: 'ads',
            component: AdsComponent,
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
