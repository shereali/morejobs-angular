import { Component } from '@angular/core';
import {NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class AppComponent {
  title = 'morejobsbd.net';
  constructor(config: NgbModalConfig) {
    config.backdropClass = 'transparent';
    config.windowClass = 'cus-modal-wrapper modal-small slideInUp';
  }
}
