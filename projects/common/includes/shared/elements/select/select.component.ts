import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {CommonSelectBox} from '../../../models/common';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  @Input() options: Array<CommonSelectBox> = [];
  @Input() title: string | '' = '';
  @Input() selected: CommonSelectBox | {} = {};
  @Input() value: string | number = '';
  @Input() id: string | number = '';

  @Output() whenSelect = new EventEmitter();

  control = new FormControl('');

  onChange(value: any): void {
    const i = this.options.find(item => item.title === value);
    this.whenSelect.emit(i);
  }

  isSelected(item: any): boolean {
    /* tslint:disable */
    return (item.value == this.value);
    /* tslint:enable */
  }

}
