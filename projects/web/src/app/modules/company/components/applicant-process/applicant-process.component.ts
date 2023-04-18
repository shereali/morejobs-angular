import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {JobPostService} from '../../../../../../../common/includes/services/employer/job-post.service';
import {SpinnerService} from '../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {FilterParams, ObjectMap} from '../../../../../../../common/includes/utilities/filterParams';
import {ToastService} from '../../../../../../../common/includes/services/toast.service';
import {ClipboardService} from 'ngx-clipboard';
import {environment} from '../../../../../../../common/src/environments/environment';
import {JobPostModel} from '../../../../../../../common/includes/models/employer/job-post';


@Component({
  selector: 'app-applicant-process',
  templateUrl: './applicant-process.component.html',
  styleUrls: ['./applicant-process.component.scss'],
})
export class ApplicantProcessComponent implements OnInit {
  public apiUrl = environment.apiUrl;

  isLoading = true;

  selectedOption = 'preview';
  post: any;
  previewData: any;

  filterParams = new FilterParams();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private jps: JobPostService,
    private spinner: SpinnerService,
    private ts: ToastService,
    private clipboardService: ClipboardService
  ) {
    console.log('pppppp', this.filterParams.value);
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngOnInit(): void {
    // this.summaryLoading = true;
    // this.spinner.show('summary_spinner');
    // const id = this.route.snapshot.params.id;
    // this.jps.loadApplicantProcessSummary(id)
    //   .then((res) => {
    //     if (res.success) {
    //       this.postData = res.data.post;
    //     }
    //   }).finally(() => {
    //   this.summaryLoading = false;
    //   this.spinner.hide('summary_spinner');
    // });
  }

  private handleQueryParams(params: ObjectMap): void {
    this.selectedOption = params.key || 'preview';
    // this.filterParams.setFilterFromQueryParams(params);
    this.loadData(params);
  }

  loadData(params: ObjectMap): void {
    const id = this.route.snapshot.params.id;
    if (!this.post) {
      this.spinner.show('job_summary_spinner');
    }

    if (this.selectedOption === 'preview') {
      console.log('eeeeeeeeeeeeeeeee////', this.filterParams.value);
      console.log('eeeeeeeeeeeeeeeee/zxzx///', params);

      this.spinner.show('content_spinner');
      this.jps.loadApplicantProcessJobPreview(this.filterParams.formattedFilterParams(params), id)
        .then((res) => {
          if (res.success) {
            this.handleResponse(res);
          }
        }).finally(() => {
        this.isLoading = false;
        this.spinner.hide('job_summary_spinner');
        this.spinner.hide('content_spinner');
      });
    } else {
      this.jps.loadApplicantProcessSummary(id).then((res) => {
        if (res.success) {
          this.post = res.data.post;
        }
      }).finally(() => {
        this.isLoading = false;
        this.spinner.hide('job_summary_spinner');
      });
    }
  }

  handleResponse(res: any): void {
    this.post = res.data.post;
    this.previewData = res.data.preview;
  }

  onChangeOption(key: string): void {
    this.filterParams.reset();

    this.selectedOption = key;
    this.filterParams.set('key', key);

    const queryParams = this.filterParams.value;

    this.router.navigate([], {queryParams, replaceUrl: true, relativeTo: this.route});
    // this.navigateWithFilterParams();
  }

  copy(text: string): void {
    // this.clipboardService.copy(text);
    this.ts.success('Link copied');
  }

  repost(item: JobPostModel): void {
    this.spinner.show('repost_action_spinner');
    this.jps.repost(item.id)
      .then((res) => {
        if (res.success) {
          this.router.navigate(['/company/job-posting-board'], {
            queryParams: {
              step: 'primary_job_info',
              id: res.data.id,
              action_type: 'edit'
            }
          }).then();
        }
      }).finally(() => {
      this.spinner.hide('repost_action_spinner');
    });
  }

  private navigateWithFilterParams(filterParams?: any, queryParamsHandling: QueryParamsHandling = 'merge'): void {
    const extras: NavigationExtras = {
      queryParams: filterParams || this.filterParams.value,
      queryParamsHandling,
      replaceUrl: true
    };
    this.router.navigate([], extras).then();
  }
}
