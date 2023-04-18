import {Component, OnInit} from '@angular/core';
import {ResumeViewedService} from '../../../../../../common/includes/services/company-activity/resume-viewed.service';
import {CvSummary} from '../../../../../../common/includes/models/company-activity';
import {environment} from '../../../../../../common/src/environments/environment';

@Component({
  selector: 'app-resume-summary',
  templateUrl: './resume-summary.component.html',
  styleUrls: ['./resume-summary.component.scss'],
})
export class ResumeSummaryComponent implements OnInit {
  apiUrl = environment.apiUrl;

  isLoading = false;
  cvSummary: CvSummary | any;

  constructor(
    private rvs: ResumeViewedService,
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.rvs.loadCvSummary()
      .then((res) => {
        if (res.success) {
          this.cvSummary = res.data;
        }
      }).finally(() => {
      this.isLoading = false;
    });
  }

}
