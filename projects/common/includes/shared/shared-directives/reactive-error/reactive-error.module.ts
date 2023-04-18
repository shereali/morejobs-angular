import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InvalidTypeDirective} from './directives/error-type.directive';
import {InvalidMessageDirective} from './directives/error-message.directive';

@NgModule({
  imports: [CommonModule],
  exports: [
    InvalidTypeDirective,
    InvalidMessageDirective
  ],
  declarations: [
    InvalidTypeDirective,
    InvalidMessageDirective
  ]
})
export class ReactiveErrorModule {
}
