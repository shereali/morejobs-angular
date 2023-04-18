import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastComponent} from './components/common/toast/toast.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from '../../../common/interceptors/auth.interceptor';
import {LoginComponent} from './components/auth/login/login.component';
import {RegistrationComponent} from './components/auth/registration/registration.component';
import {CookieService} from 'ngx-cookie-service';
import {NotFoundComponent} from './components/common/not-found/not-found.component';
import {HomeComponent} from './components/home/home.component';
import {HomeContentComponent} from './components/home/home-content/home-content.component';
import {HeaderComponent} from './components/common/header/header.component';
import {SidebarComponent} from './components/common/sidebar/sidebar.component';
import {FooterComponent} from './components/common/footer/footer.component';
import {EditResumeComponent} from './components/edit-resume/edit-resume.component';
import {ViewResumeComponent} from './components/view-resume/view-resume.component';
import {UploadResumeComponent} from './components/upload-resume/upload-resume.component';
import {OnlineApplicationComponent} from './components/online-application/online-application.component';
import {FavoriteJobsComponent} from './components/favorite-jobs/favorite-jobs.component';
import {FollowingCompanyComponent} from './components/following-company/following-company.component';
import {CompanyListComponent} from './components/company-list/company-list.component';
import {ResumeViewedComponent} from './components/resume-viewed/resume-viewed.component';
import {EmployerMessageComponent} from './components/employer-message/employer-message.component';
import {EmployerMessageDetailsComponent} from './components/employer-message/employer-message-details/employer-message-details.component';
import {ResumeSummaryComponent} from './components/resume-viewed/resume-summary/resume-summary.component';
import {ElementsModule} from '../../../common/includes/shared/elements/elements.module';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import {CompanyDetailsComponent} from './components/company-list/company-details/company-details.component';
import {ReactiveErrorModule} from '../../../common/includes/shared/shared-directives/reactive-error/reactive-error.module';
import {ToastrModule} from 'ngx-toastr';
import {ChangeDeadlineModalComponent} from './modules/company/components/dashboard-content/change-deadline-modal/change-deadline-modal.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {EmployerRegComponent} from './components/auth/employer-reg/employer-reg.component';
import {ErrorPageComponent} from './components/common/error-page/error-page.component';
import {ConfirmationDialogComponent} from './components/common/confirmation-dialog/confirmation-dialog.component';
import {ForgotPasswordComponent} from './components/auth/forgot-password/forgot-password.component';
import {ChangePasswordComponent} from './components/auth/change-password/change-password.component';
import {EmailResumeComponent} from './components/email-resume/email-resume.component';
import {AccountSettingsComponent} from './components/account-settings/account-settings.component';
import {AccountSettingContainerComponent} from './components/account-settings/account-setting-container/account-setting-container.component';
import {EmployerChangePasswordComponent} from './components/account-settings/employer-change-password/employer-change-password.component';
import {ChangeUseridOptionsComponent} from './components/account-settings/change-userid-options/change-userid-options.component';
import {ChangeUseridComponent} from './components/account-settings/change-userid-options/change-userid/change-userid.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    ToastComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    HomeContentComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    EditResumeComponent,
    ViewResumeComponent,
    UploadResumeComponent,
    OnlineApplicationComponent,
    FavoriteJobsComponent,
    FollowingCompanyComponent,
    CompanyListComponent,
    CompanyDetailsComponent,
    ResumeViewedComponent,
    ResumeSummaryComponent,
    EmployerMessageComponent,
    EmployerMessageDetailsComponent,
    ChangeDeadlineModalComponent,
    EmployerRegComponent,
    ErrorPageComponent,
    ConfirmationDialogComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    EmailResumeComponent,
    AccountSettingsComponent,
    AccountSettingContainerComponent,
    EmployerChangePasswordComponent,
    ChangeUseridOptionsComponent,
    ChangeUseridComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ElementsModule,
    NoopAnimationsModule,
    MatDialogModule,
    ReactiveErrorModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      toastClass: 'ngx-toastr',
      closeButton: true,
    }),
    NgMultiSelectDropDownModule.forRoot()
  ],
  entryComponents: [
    // CompanyDetailsComponent
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, CookieService],
  exports: [
    ViewResumeComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
