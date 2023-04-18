import { Component, OnInit } from '@angular/core';
import {environment} from '../../../../../../../../common/src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  apiUrl = environment.apiUrl;
  constructor() { }

  ngOnInit() {}

}
