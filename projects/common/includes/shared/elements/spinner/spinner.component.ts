import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {Subject} from 'rxjs';
import {SpinnerService} from './spinner.service';
import {filter, map, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent implements OnDestroy, OnInit {
  @Input() name: string | number = 'spinner';
  @Input() type: 'btn' | 'page' = 'page';
  @Input() height = 400;
  @Input() classes = '';
  @Input() style: any;
  @Input() class: any;

  @Input() public active = false;
  @Output() public activeChange = new EventEmitter();
  public inactive = !this.active;
  private componentDestroyed = new Subject();

  constructor(
    private spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.inactive = !this.active;
    this.spinnerService.allSpinner
      .pipe(
        takeUntil(this.componentDestroyed),
        filter((spinners: any) => spinners.map((spinner: any) => spinner.name).includes(this.name)),
        map((spinners: any) => spinners.find((spinner: any) => spinner.name === this.name)))
      .subscribe((spinner: any) => {
        this.active = spinner.status;
        this.inactive = !this.active;
        this.activeChange.emit(this.active);
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }

}
