import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {InvalidMessageDirective} from './error-message.directive';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Directive({
  selector: '[appInvalidType]'
})
export class InvalidTypeDirective implements OnInit, OnDestroy {

  @Input() appInvalidType: any;
  private hasView = false;
  private componentDestroyed = new Subject();

  constructor(
    private invalidMessage: InvalidMessageDirective,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
  }

  ngOnInit(): void {
    this.invalidMessage.controlValue$
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(() => this.setVisible());
  }

  private setVisible(): void {
    if (this.invalidMessage.match(this.appInvalidType)) {
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
    } else if (this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }

}
