import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {FilterParams, ObjectMap} from '../../../../../common/includes/utilities/filterParams';
import {Pagination} from '../../../../../common/includes/utilities/pagination';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {FavoriteJobService} from '../../../../../common/includes/services/favorite-job.service';
import {FavJobModel, perPageOptions} from '../../../../../common/includes/models/favorite-job';
import {CommonSelectBox} from '../../../../../common/includes/models/common';
import {SpinnerService} from '../../../../../common/includes/shared/elements/spinner/spinner.service';
import {environment} from '../../../../../common/src/environments/environment';
import {CompanyDetailsComponent} from '../company-list/company-details/company-details.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-favorite-jobs',
  templateUrl: './favorite-jobs.component.html',
  styleUrls: ['./favorite-jobs.component.scss'],
})
export class FavoriteJobsComponent {
  public favJobs: Array<FavJobModel> = [];
  selectedIds: Array<number> = [];

  private searchForm: FormGroup | any;
  public isLoading = false;
  deleteActionSubmitted = false;

  //  public selectedRowIndex: number;
  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  filterParams = new FilterParams();
  pagination = new Pagination();
  apiUrl = environment.apiUrl;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private fjs: FavoriteJobService,
    private spinner: SpinnerService) {
    this.prepareSearchForm();
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  private handleQueryParams(params: ObjectMap): void {
    this.filterParams.setFilterFromQueryParams(params);

    this.loadFavoriteJobs(params);
  }

  loadFavoriteJobs(params: ObjectMap): void {
    this.isLoading = true;
    this.spinner.show('fav_job_table_spinner');
    this.fjs.favoriteJobList(this.filterParams.formattedFilterParams(params))
      .then((res) => {
        if (res.success) {
          this.handleResponse(res);
        }
      }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('fav_job_table_spinner');
    });
  }

  handleResponse(res: any): void {
    this.favJobs = res.data.data;
    this.pagination = new Pagination(res.data);
  }

  changePage(page: number): void {
    this.favJobs = [];
    const extras: NavigationExtras = {queryParams: {page}, queryParamsHandling: 'merge'};
    this.router.navigate([], extras).then();
  }

  search(): void {
    this.filterParams.set('from_date', this.fromDate.value);
    this.filterParams.set('to_date', this.toDate.value);
    this.filterParams.set('company_name', this.companyName.value);
    this.filterParams.set('page', '');

    this.navigateWithFilterParams();
  }

  show(item: any): void {
    const dialogRef = this.dialog.open(CompanyDetailsComponent, {
      width: '800px', data: {id: item.id}
    });
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

  onChange(event: any): void {
    if (event.target.checked) {
      this.selectedIds.push(event.target.value);
    } else {
      this.selectedIds.splice(this.selectedIds.indexOf(event.target.value), 1);
    }
  }

  deleteJobs(): void {
    this.deleteActionSubmitted = true;
    this.fjs.favoriteJobDelete(this.selectedIds)
      .then((res) => {
        if (res.success) {
          this.selectedIds = [];
          this.loadFavoriteJobs(this.searchForm.value);
        }
      }).finally(() => {
      this.deleteActionSubmitted = false;
    });
  }

  private prepareSearchForm(): void {
    this.searchForm = this.fb.group({
      from_date: '',
      to_date: '',
      company_name: '',
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
      this.filterParams.value.company_name,
      this.filterParams.value.view_status,
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

  get companyName(): FormControl {
    return this.searchForm.get('company_name') as FormControl;
  }
}
