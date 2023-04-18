import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {ApplicationService} from '../../../../../common/includes/services/application.service';
import {FilterParams, ObjectMap} from '../../../../../common/includes/utilities/filterParams';
import {Pagination} from '../../../../../common/includes/utilities/pagination';
import {ApplicationModel, perPageOptions} from '../../../../../common/includes/models/application';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CommonSelectBox} from '../../../../../common/includes/models/common';
import {SpinnerService} from '../../../../../common/includes/shared/elements/spinner/spinner.service';
import {environment} from '../../../../../common/src/environments/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-online-application',
  templateUrl: './online-application.component.html',
  styleUrls: ['./online-application.component.scss'],
})
export class OnlineApplicationComponent {
  public applications: Array<ApplicationModel> = [];

  private searchForm: FormGroup | any;
  viewStatusOptions: Array<{ id: number | '', title: string }> = [
    {id: '', title: 'All'},
    {id: 1, title: 'Viewed'},
    {id: 0, title: 'Not Viewed'},
  ];
  public isLoading = false;

  // public selectedRowIndex: number;
  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  filterParams = new FilterParams();
  pagination = new Pagination();
  apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private as: ApplicationService,
    private spinner: SpinnerService) {
    this.prepareSearchForm();
    this.setSearchFormDefault();
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  private handleQueryParams(params: ObjectMap): void {
    this.filterParams.setFilterFromQueryParams(params);

    this.loadApplications(params);
  }

  loadApplications(params: ObjectMap): void {
    this.isLoading = true;
    this.spinner.show('application_table_spinner');
    this.as.onlineApplicationList(this.filterParams.formattedFilterParams(params))
      .then((res) => {
        if (res.success) {
          this.handleResponse(res);
        }
      }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('application_table_spinner');
    });
  }

  handleResponse(res: any): void {
    this.applications = res.data.data;
    this.pagination = new Pagination(res.data);
  }

  changePage(page: number): void {
    this.applications = [];
    const extras: NavigationExtras = {queryParams: {page}, queryParamsHandling: 'merge'};
    this.router.navigate([], extras).then();
  }

  search(): void {
    this.filterParams.set('from_date', this.fromDate.value);
    this.filterParams.set('to_date', this.toDate.value);
    this.filterParams.set('company_name', this.companyName.value);
    this.filterParams.set('view_status', this.viewStatus.value);
    this.filterParams.set('page', '');

    this.navigateWithFilterParams();
  }

  reset(): void {
    this.searchForm.reset();
    this.search();
    this.setSearchFormDefault();
  }

  setPerPage(data: CommonSelectBox): void {
    this.filterParams.set('per_page', data.value);
    this.filterParams.set('page', '');
    this.navigateWithFilterParams();
  }

  private prepareSearchForm(): void {
    this.searchForm = this.fb.group({
      from_date: '',
      to_date: '',
      company_name: '',
      view_status: '',
    });
  }

  private setSearchFormDefault(): void {
    this.viewStatus.setValue(this.viewStatusOptions[0].id);
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

  get viewStatus(): FormControl {
    return this.searchForm.get('view_status') as FormControl;
  }
}
