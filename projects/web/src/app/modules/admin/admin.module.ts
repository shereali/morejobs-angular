import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AdminRoutingModule} from './admin-routing.module';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {HeaderComponent} from './components/common/header/header.component';
import {SidebarComponent} from './components/common/sidebar/sidebar.component';
import {FooterComponent} from './components/common/footer/footer.component';
import {DashboardContentComponent} from './components/dashboard/dashboard-content/dashboard-content.component';
import {PostsComponent} from './components/posts/posts.component';
import {AddNewCompanyComponent} from './components/companies/add-new-company/add-new-company.component';
import {CompaniesComponent} from './components/companies/companies.component';
import {SpinnerModule} from '../../../../../common/includes/shared/elements/spinner/spinner.module';
import {SelectModule} from '../../../../../common/includes/shared/elements/select/select.module';
import {ReactiveErrorModule} from '../../../../../common/includes/shared/shared-directives/reactive-error/reactive-error.module';
import {AddNewPostComponent} from './components/posts/add-new-post/add-new-post.component';
import {PostDetailsComponent} from './components/posts/post-details/post-details.component';
import {CompanyModule} from '../company/company.module';
import {EmployeeComponent} from './components/employee/employee.component';
import {SettingsComponent} from './components/settings/settings.component';
import {CategoriesComponent} from './components/settings/categories/categories.component';
import {AddNewCategoriesComponent} from './components/settings/categories/add-new-categories/add-new-categories.component';
import {IndustryComponent} from './components/settings/industry/industry.component';
import {AddIndustryComponent} from './components/settings/industry/add-industry/add-industry.component';
import {InstitutesComponent} from './components/settings/institutes/institutes.component';
import {AddInstitutesComponent} from './components/settings/institutes/add-institutes/add-institutes.component';
import {DegreesComponent} from './components/settings/degrees/degrees.component';
import {AddDegreesComponent} from './components/settings/degrees/add-degrees/add-degrees.component';
import {SkillsComponent} from './components/settings/skills/skills.component';
import {AddSkillsComponent} from './components/settings/skills/add-skills/add-skills.component';
import {SettingContainerComponent} from './components/settings/setting-container/setting-container.component';
import {TrainersComponent} from './components/trainers/trainers.component';
import {AddNewTrainerComponent} from './components/trainers/add-new-trainer/add-new-trainer.component';
import {EmployeeDetailsComponent} from './components/employee/employee-details/employee-details.component';
import {AddNewTrainingsComponent} from './components/trainings/add-new-company/add-new-trainings.component';
import {TrainingsComponent} from './components/trainings/trainings.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {ContentManagementComponent} from './components/content-management/content-management.component';
import {ContentManagementContainerComponent} from './components/content-management/content-management-container/content-management-container.component';
import {BlogsComponent} from './components/content-management/blogs/blogs.component';
import {AddNewBlogComponent} from './components/content-management/blogs/add-new-blog/add-new-blog.component';
import {NgxEditorModule} from 'ngx-editor';
import {AreaComponent} from './components/settings/areas/area.component';
import {AddAreaComponent} from './components/settings/areas/add-area/add-area.component';
import {AdsComponent} from './components/content-management/ads/ads.component';
import {AddNewAdsComponent} from './components/content-management/ads/add-new-ads/add-new-ads.component';
import {SubscriptionsComponent} from './components/subscriptions/subscriptions.component';


@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    DashboardContentComponent,
    PostsComponent,
    AddNewPostComponent,
    CompaniesComponent,
    AddNewCompanyComponent,
    PostDetailsComponent,
    EmployeeComponent,
    SettingsComponent,
    CategoriesComponent,
    AddNewCategoriesComponent,
    IndustryComponent,
    AddIndustryComponent,
    InstitutesComponent,
    AddInstitutesComponent,
    DegreesComponent,
    AddDegreesComponent,
    SkillsComponent,
    AddSkillsComponent,
    SettingContainerComponent,
    TrainersComponent,
    AddNewTrainerComponent,
    EmployeeDetailsComponent,
    AddNewTrainingsComponent,
    TrainingsComponent,

    ContentManagementComponent,
    ContentManagementContainerComponent,
    BlogsComponent,
    AddNewBlogComponent,
    AreaComponent,
    AddAreaComponent,

    AdsComponent,
    AddNewAdsComponent,

    SubscriptionsComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    AdminRoutingModule,
    SpinnerModule,
    SelectModule,
    ReactiveErrorModule,
    CompanyModule,
    NgMultiSelectDropDownModule,
    NgxEditorModule,
  ]
})
export class AdminModule {
}
