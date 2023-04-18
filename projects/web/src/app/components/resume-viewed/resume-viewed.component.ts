import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {CommonSelectBox} from '../../../../../common/includes/models/common';
import {FilterParams, ObjectMap} from '../../../../../common/includes/utilities/filterParams';
import {Pagination} from '../../../../../common/includes/utilities/pagination';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {perPageOptions, ResumeViewModel} from '../../../../../common/includes/models/company-activity';
import {ResumeViewedService} from '../../../../../common/includes/services/company-activity/resume-viewed.service';

@Component({
  selector: 'app-resume-viewed',
  templateUrl: './resume-viewed.component.html',
  styleUrls: ['./resume-viewed.component.scss'],
})
export class ResumeViewedComponent {

  isLoading = false;

  public resumeViewed: Array<ResumeViewModel> = [];

  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  filterParams = new FilterParams();
  pagination = new Pagination();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private rvs: ResumeViewedService,
  ) {
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  private handleQueryParams(params: ObjectMap): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.rvs.loadResumeViewList()
      .then((res) => {
        if (res.success) {
          this.handleResponse(res);
        }
      }).finally(() => {
      this.isLoading = false;
    });
  }

  handleResponse(res: any): void {
    this.resumeViewed = res.data.data;
    this.pagination = new Pagination(res.data);
  }

  changePage(page: number): void {
    const extras: NavigationExtras = {queryParams: {page}, queryParamsHandling: 'merge'};
    this.router.navigate([], extras).then();
  }

  setPerPage(data: CommonSelectBox): void {
    this.filterParams.set('per_page', data.value);
    this.filterParams.set('page', '');
    this.navigateWithFilterParams();
  }

  private navigateWithFilterParams(filterParams?: any, queryParamsHandling: QueryParamsHandling = 'merge'): void {
    const extras: NavigationExtras = {
      queryParams: filterParams || this.filterParams.value,
      queryParamsHandling,
      replaceUrl: true
    };
    this.router.navigate([], extras).then();
  }

  get totalRecord(): number {
    return this.pagination.total;
  }
}
