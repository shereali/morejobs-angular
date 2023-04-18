import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedRoutingModule} from './shared-routing.module';
import {SharedViewResumeComponent} from './components/shared-view-resume/shared-view-resume.component';
import {SpinnerModule} from '../../../../common/includes/shared/elements/spinner/spinner.module';


@NgModule({
  declarations: [
    SharedViewResumeComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    SpinnerModule
  ],
  exports: [
    SharedViewResumeComponent,
  ]
})
export class SharedModule {
}
