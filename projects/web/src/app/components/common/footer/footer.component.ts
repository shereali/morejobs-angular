import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../../../common/src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @Input() footerSalesPerson = true;
  apiUrl = environment.apiUrl;

  constructor() {
  }

  ngOnInit(): void {
  }

}
