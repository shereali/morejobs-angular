import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {SpinnerService} from '../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {FilterParams, ObjectMap} from '../../../../../../../common/includes/utilities/filterParams';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ApiResponse, CommonSelectBox} from '../../../../../../../common/includes/models/common';
import {Pagination} from '../../../../../../../common/includes/utilities/pagination';
import {perPageOptions} from '../../../../../../../common/includes/models/employer/job-post';
import {MatDialog} from '@angular/material/dialog';
import {CompaniesService} from '../../../../../../../common/includes/services/admin/companies.service';
import {CompanyModel} from '../../../../../../../common/includes/models/admin/company';
import {AddNewCompanyComponent} from './add-new-company/add-new-company.component';
import {pick} from 'lodash';
import {ToastService} from '../../../../../../../common/includes/services/toast.service';
import {environment} from '../../../../../../../common/src/environments/environment';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent implements OnInit {
  apiUrl = environment.apiUrl;
  isLoading = true;

  summary: { pending: number, approved: number, inactive: number } = {pending: 0, approved: 0, inactive: 0};
  initialData: { organization_types: Array<{ id: number; title_en: string }> } = {organization_types: []};
  companies: Array<CompanyModel> = [];

  searchForm: FormGroup | any;

  filterParams = new FilterParams();
  pagination = new Pagination();

  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cs: CompaniesService,
    private spinner: SpinnerService,
    private ts: ToastService) {
    this.prepareSearchForm();
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngOnInit(): void {
    this.cs.initiateSummary()
      .then((res) => {
        if (res.success) {
          this.summary = res.data.summary;
          this.initialData = res.data.initial_data;
        }
      });
  }

  private handleQueryParams(params: ObjectMap): void {
    this.filterParams.setFilterFromQueryParams(params);
    this.setSearchValueFromParams(params);
    this.loadCompanies(params).then();
  }

  async loadCompanies(params: ObjectMap = {}): Promise<any> {
    this.isLoading = true;
    this.spinner.show('company_table_spinner');
    await this.cs.loadCompanyList(this.filterParams.formattedFilterParams(params))
      .then((res) => {
        if (res.success) {
          this.handleResponse(res);
        }
      }).finally(() => {
        this.isLoading = false;
        this.spinner.hide('company_table_spinner');
      });
  }

  handleResponse(res: any): void {
    this.companies = res.data.data;
    this.pagination = new Pagination(res.data);
  }

  openCreateModal(item: CompanyModel | {} = ''): void {
    const dialogRef = this.dialog.open(AddNewCompanyComponent, {
      width: '900px', data: item
    });

    dialogRef.afterClosed().subscribe((res: ApiResponse<any>) => {
      if (res && res.success) {
        this.loadCompanies().then();
        this.ngOnInit();
      }
    });
  }

  onChangeStatus(item: CompanyModel, e: any): void {
    this.spinner.show('company_status_change_spinner' + item.id);
    this.cs.changeStatus(item.id, e.target.value).then((res) => {
      this.ts.apiMessage(res);
      if (res.success) {
        this.spinner.hide('company_status_change_spinner' + item.id);
        this.loadCompanies(this.filterParams.value).then();
        this.ngOnInit();
      }
    });
  }

  changePage(page: number): void {
    const extras: NavigationExtras = {queryParams: {page}, queryParamsHandling: 'merge'};
    this.router.navigate([], extras).then();
  }

  search(): void {
    this.filterParams.set('company_name', this.companyNameControl.value);
    this.filterParams.set('organization_type_id', this.organizationTypeIdControl.value);
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
    this.organizationTypeIdControl.setValue('');
  }

  setPerPage(data: CommonSelectBox): void {
    this.filterParams.set('per_page', data.value);
    this.filterParams.set('page', '');
    this.navigateWithFilterParams();
  }

  private prepareSearchForm(): void {
    this.searchForm = this.fb.group({
      company_name: '',
      organization_type_id: '',
      status: '',
    });
  }

  private setSearchValueFromParams(data: any = {}): void {
    Object
      .keys(pick(data, ['company_name', 'organization_type_id', 'status']))
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
      this.filterParams.value.company_name,
      this.filterParams.value.organization_type_id,
      // this.filterParams.value.status,
    ].some(value => value);
  }

  get totalRecord(): number {
    return this.pagination.total;
  }

  get companyNameControl(): FormControl {
    return this.searchForm.get('company_name') as FormControl;
  }

  get organizationTypeIdControl(): FormControl {
    return this.searchForm.get('organization_type_id') as FormControl;
  }

  get statusControl(): FormControl {
    return this.searchForm.get('status') as FormControl;
  }
}
