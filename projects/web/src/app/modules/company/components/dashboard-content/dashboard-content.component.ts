import {ChangeDetectionStrategy, Component, NgModule, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {SpinnerService} from '../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {JobPostService} from '../../../../../../../common/includes/services/employer/job-post.service';
import {FilterParams, ObjectMap} from '../../../../../../../common/includes/utilities/filterParams';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CommonSelectBox} from '../../../../../../../common/includes/models/common';
import {Pagination} from '../../../../../../../common/includes/utilities/pagination';
import {JobPostModel, perPageOptions} from '../../../../../../../common/includes/models/employer/job-post';
import {MatDialog} from '@angular/material/dialog';
import {ChangeDeadlineModalComponent} from './change-deadline-modal/change-deadline-modal.component';
import {pick} from 'lodash';
import {environment} from '../../../../../../../common/src/environments/environment';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContentComponent implements OnInit {
  isLoading = true;

  summary: { posted: number, drafted: number, archived: number } = {posted: 0, archived: 0, drafted: 0};
  posts: Array<JobPostModel> = [];

  searchForm: FormGroup | any;

  filterParams = new FilterParams();
  pagination = new Pagination();

  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private jps: JobPostService,
    private spinner: SpinnerService) {
    this.prepareSearchForm();
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngOnInit(): void {

  }

  private handleQueryParams(params: ObjectMap): void {
    this.jps.initiate()
      .then((res) => {
        if (res.success) {
          this.summary = res.data.summary;
        }
      });

    this.filterParams.setFilterFromQueryParams(params);
    this.setSearchValueFromParams(params);

    this.loadJobPosts(params);
  }

  loadJobPosts(params: ObjectMap): void {
    this.isLoading = true;
    this.spinner.show('job_post_table_spinner');
    this.jps.jobList(this.filterParams.formattedFilterParams(params))
      .then((res) => {
        if (res.success) {
          this.handleResponse(res);
        }
      }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('job_post_table_spinner');
    });
  }

  handleResponse(res: any): void {
    this.posts = res.data.data;
    this.pagination = new Pagination(res.data);
  }

  onChangeStatus(status: string): void {
    this.filterParams.set('status', status);

    this.navigateWithFilterParams();
  }

  changeDeadline(item: JobPostModel): void {
    const dialogRef = this.dialog.open(ChangeDeadlineModalComponent, {
      width: '300px', data: item
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res && res.success) {
        this.loadJobPosts(this.filterParams.value);
      }
    });
  }

  changePage(page: number): void {
    const extras: NavigationExtras = {queryParams: {page}, queryParamsHandling: 'merge'};
    this.router.navigate([], extras).then();
  }

  search(): void {
    this.filterParams.set('from_date', this.fromDate.value);
    this.filterParams.set('to_date', this.toDate.value);
    this.filterParams.set('title', this.title.value);
    this.filterParams.set('status', this.status.value);
    this.filterParams.set('page', '');

    this.navigateWithFilterParams();
  }

  reset(): void {
    this.searchForm.reset();
    this.search();
  }

  setPerPage(data: CommonSelectBox): void {
    this.filterParams.set('per_page', data.value);
    this.filterParams.set('page', '');
    this.navigateWithFilterParams();
  }

  goToPost(item: JobPostModel): void {
    if (item.status.id === 2) {
      const url = environment.apiUrl + `/job-list/${item.id}/details`;
      window.open(url, '_blank');
    }
  }

  repost(item: JobPostModel): void {
    this.spinner.show('action_spinner' + item.id);
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
      this.spinner.hide('action_spinner' + item.id);
    });
  }

  private prepareSearchForm(): void {
    this.searchForm = this.fb.group({
      from_date: '',
      to_date: '',
      title: '',
      status: '',
    });
  }

  private setSearchValueFromParams(data: any = {}): void {
    Object
      .keys(pick(data, ['from_date', 'to_date', 'title', 'status']))
      .filter(key => data[key])
      .forEach(key => {
        this.searchForm.get(key).setValue(data[key]);
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

  get showSearchClearButton(): any {
    return [
      this.filterParams.value.from_date,
      this.filterParams.value.to_date,
      this.filterParams.value.title,
    ].some(value => value);
  }

  get totalRecord(): number {
    return this.pagination.total;
  }

  get fromDate(): FormControl {
    return this.searchForm.get('from_date') as FormControl;
  }

  get toDate(): FormControl {
    return this.searchForm.get('to_date') as FormControl;
  }

  get title(): FormControl {
    return this.searchForm.get('title') as FormControl;
  }

  get status(): FormControl {
    return this.searchForm.get('status') as FormControl;
  }

}
