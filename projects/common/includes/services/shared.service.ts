import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
   isExpanded = new Subject<any>();

  constructor() { }

  pushIsExpanded(value: any): void {
    this.isExpanded.next(value);
  }

  getIsExpanded(): any {
    return this.isExpanded.asObservable();
  }
}
