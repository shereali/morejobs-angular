import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-job-preview',
  templateUrl: './job-preview.component.html',
  styleUrls: ['./job-preview.component.scss'],
})
export class JobPreviewComponent implements OnInit {
  @Input() data: any;

  constructor() {

  }

  ngOnInit(): void {
     // console.log('ttttttttttttttt>>>>>>>>>>', this.data);
  }

  formattedData(data: Array<any>, key: string): string {
    return data.map((item: any) => item[key]).join(', ');
  }

  salaryTypeTitle(data: any): any {
    if (data.salary_type === 1) {
      return 'Hourly';
    } else if (data.salary_type === 2) {
      return 'Daily';
    } else if (data.salary_type === 3) {
      return 'Monthly';
    } else if (data.salary_type === 4) {
      return 'Yearly';
    }
  }

}
