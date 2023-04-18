import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {SpinnerService} from '../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {FilterParams, ObjectMap} from '../../../../../../../common/includes/utilities/filterParams';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CommonSelectBox} from '../../../../../../../common/includes/models/common';
import {Pagination} from '../../../../../../../common/includes/utilities/pagination';
import {perPageOptions} from '../../../../../../../common/includes/models/employer/job-post';
import {MatDialog} from '@angular/material/dialog';
import {pick} from 'lodash';
import {ToastService} from '../../../../../../../common/includes/services/toast.service';
import {environment} from '../../../../../../../common/src/environments/environment';
import {SubscriptionsService} from '../../../../../../../common/includes/services/admin/subscriptions.service';
import {SubscriptionModel} from '../../../../../../../common/includes/models/admin/subscription';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  apiUrl = environment.apiUrl;
  isLoading = true;

  summary: { total: number; pending: number, approved: number, inactive: number } = {
    total: 0,
    pending: 0,
    approved: 0,
    inactive: 0
  };
  initialData: { companies: Array<{ id: number; title_en: string }> } = {companies: []};
  subscriptions: Array<SubscriptionModel> = [];

  searchForm: FormGroup | any;

  filterParams = new FilterParams();
  pagination = new Pagination();

  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ss: SubscriptionsService,
    private spinner: SpinnerService,
    private ts: ToastService) {
    this.prepareSearchForm();
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngOnInit(): void {
    this.ss.initiateSummary().then((res) => {
      if (res.success) {
        this.summary = res.data.summary;
        this.initialData = res.data.initial_data;
      }
    });
  }

  private handleQueryParams(params: ObjectMap): void {
    this.filterParams.setFilterFromQueryParams(params);
    this.setSearchValueFromParams(params);
    this.loadList(params).then();
  }

  async loadList(params: ObjectMap = {}): Promise<any> {
    this.isLoading = true;
    this.spinner.show('subscription_spinner');
    await this.ss.loadSubscriptionList(this.filterParams.formattedFilterParams(params))
      .then((res) => {
        if (res.success) {
          this.handleResponse(res);
        }
      }).finally(() => {
        this.isLoading = false;
        this.spinner.hide('subscription_spinner');
      });
  }

  handleResponse(res: any): void {
    this.subscriptions = res.data.data;
    this.pagination = new Pagination(res.data);
  }

  onChangeStatus(item: SubscriptionModel, e: any): void {
    this.spinner.show('subscription_status_change_spinner' + item.id);
    this.ss.changeStatus(item.id, e.target.value).then((res) => {
      this.ts.apiMessage(res);
      if (res.success) {
        this.spinner.hide('subscription_status_change_spinner' + item.id);
        this.loadList(this.filterParams.value).then();
        this.ngOnInit();
      }
    });
  }

  changePage(page: number): void {
    const extras: NavigationExtras = {queryParams: {page}, queryParamsHandling: 'merge'};
    this.router.navigate([], extras).then();
  }

  search(): void {
    this.filterParams.set('company_id', this.companyIdControl.value);
    this.filterParams.set('status', this.statusControl.value);
    this.filterParams.set('page', '');

    this.navigateWithFilterParams();
  }

  reset(): void {
    this.searchForm.reset();
    this.setSearchFormDefault();
    this.search();
  }

  private setSearchFormDefault(): void {
    this.companyIdControl.setValue('');
  }

  setPerPage(data: CommonSelectBox): void {
    this.filterParams.set('per_page', data.value);
    this.filterParams.set('page', '');
    this.navigateWithFilterParams();
  }

  private prepareSearchForm(): void {
    this.searchForm = this.fb.group({
      company_id: '',
      status: '',
    });
  }

  private setSearchValueFromParams(data: any = {}): void {
    Object
      .keys(pick(data, ['company_id', 'status']))
      .filter(key => data[key])
      .forEach(key => {
        this.searchForm.get(key).setValue(data[key]);
      });
  }

  onChangeStatusFilter(status: string): void {
    this.filterParams.set('status', status);

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

  get showSearchClearButton(): any {
    return [
      // this.filterParams.value.company_name,
      this.filterParams.value.company_id,
      // this.filterParams.value.status,
    ].some(value => value);
  }

  get totalRecord(): number {
    return this.pagination.total;
  }

  get companyIdControl(): FormControl {
    return this.searchForm.get('company_id') as FormControl;
  }

  get statusControl(): FormControl {
    return this.searchForm.get('status') as FormControl;
  }
}
