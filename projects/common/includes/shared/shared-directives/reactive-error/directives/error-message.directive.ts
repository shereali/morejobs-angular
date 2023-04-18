import {Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {AbstractControl, ControlContainer, FormGroupDirective} from '@angular/forms';
import {merge, Observable, of, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

@Directive({selector: '[appInvalidMessage]'})
export class InvalidMessageDirective implements OnInit, OnDestroy {
  @Input() appInvalidMessage: any;
  @Input() showWithoutSubmit = false;

  controlValue$: Observable<any> | any;
  private control: AbstractControl | any;
  private hasSubmitted = false;

  private componentDestroyed = new Subject();

  constructor(
    private _fg: ControlContainer,
    private _el: ElementRef,
    private render: Renderer2
  ) {
  }

  get form(): any {
    return this._fg.formDirective ? (this._fg.formDirective as FormGroupDirective).form : null;
  }

  ngOnInit(): void {
    const formSubmit$ = (this._fg as FormGroupDirective).ngSubmit.pipe(map(() => this.hasSubmitted = true));
    this.control = this.form.get(this.appInvalidMessage);
    this.controlValue$ = merge(this.control.valueChanges, of(''), formSubmit$);
    this.controlValue$
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(() => this.setVisible());
  }

  match(error: string): boolean {
    if (this.control && this.control.errors) {
      if (Object.keys(this.control.errors).indexOf(error) > -1) {
        return true;
      }
    }
    return false;
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }

  private setVisible(): void {
    if (this.control.invalid && (this.control.dirty || (this.hasSubmitted || this.showWithoutSubmit))) {
      this.render.removeStyle(this._el.nativeElement, 'display');
    } else {
      this.render.setStyle(this._el.nativeElement, 'display', 'none');
    }
  }

}
