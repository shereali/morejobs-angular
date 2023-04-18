import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

interface Spinner {
  status: boolean;
  name: string | number;
}

@Injectable(
  {providedIn: 'root'}
)
export class SpinnerService {
  private spinner: BehaviorSubject<Array<Spinner>> | any = new BehaviorSubject([]);
  private spinners: Array<Spinner> = [];

  show(name: number | string): void {
    const r = this.spinners.find(spinner => spinner.name === name);
    if (r) {
      r.status = true;
    } else {
      this.spinners.push({name, status: true});
    }
    this.spinner.next(this.spinners);
  }

  hide(name: number | string): void {
    const r = this.spinners.find(spinner => spinner.name === name);
    if (r) {
      r.status = false;
    } else {
      this.spinners.push({name, status: false});
    }
    this.spinner.next(this.spinners);
  }

  hideAll(): void {
    this.spinners.forEach(spinner => spinner.status = false);
    this.spinner.next(this.spinners);
  }

  get allSpinner(): any {
    return this.spinner.asObservable();
  }
}
