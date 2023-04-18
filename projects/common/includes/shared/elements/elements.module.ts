import {NgModule} from '@angular/core';
import {SelectModule} from './select/select.module';
import {SpinnerModule} from './spinner/spinner.module';
import {ConfirmationDialogComponent} from '../../../../web/src/app/components/common/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  imports: [
    SelectModule,
    SpinnerModule,
  ],
  exports: [
    SelectModule,
    SpinnerModule,
  ]
})
export class ElementsModule {
}
