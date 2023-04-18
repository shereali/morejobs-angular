import {Component, OnInit} from '@angular/core';
import {ToastService} from '../../../../../../common/includes/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {

  constructor() {
  }
  ngOnInit(): void {
  }

  close(toast: string): void {
    // this.toastService.remove(toast);
  }

}
