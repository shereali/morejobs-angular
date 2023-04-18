import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CommonSelectBox} from '../../../../../common/includes/models/common';
import {FilterParams, ObjectMap} from '../../../../../common/includes/utilities/filterParams';
import {Pagination} from '../../../../../common/includes/utilities/pagination';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {FollowingCompanyModel, perPageOptions} from '../../../../../common/includes/models/following-company';
import {FollowingCompanyService} from '../../../../../common/includes/services/following-company.service';
import {CompanyDetailsComponent} from '../company-list/company-details/company-details.component';
import {MatDialog} from '@angular/material/dialog';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [{
  type: 'primary',
  message: 'You didn\'t follow any Employer yet\n',
}
];

@Component({
  selector: 'app-following-company',
  templateUrl: './following-company.component.html',
  styleUrls: ['./following-company.component.scss'],
})
export class FollowingCompanyComponent {
  isLoading = false;
  isSearchMode = false;

  alerts: Alert[] | any;

  followingCompanies: Array<FollowingCompanyModel> = [];

  searchForm: FormGroup | any;

  // public selectedRowIndex: number;
  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  filterParams = new FilterParams();
  pagination = new Pagination();

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private fs: FollowingCompanyService,
  ) {
    this.prepareSearchForm();
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  private handleQueryParams(params: ObjectMap): void {
    this.filterParams.setFilterFromQueryParams(params);

    this.loadFollowingCompany(params);
  }

  loadFollowingCompany(params: ObjectMap): void {
    this.isLoading = true;
    this.fs.followingCompanyList(this.filterParams.formattedFilterParams(params))
      .then((res) => {
        if (res.success) {
          this.handleResponse(res);
        }
      }).finally(() => {
      this.isLoading = false;
    });
  }

  handleResponse(res: any): void {
    this.followingCompanies = res.data.data;
    this.pagination = new Pagination(res.data);
  }

  changePage(page: number): void {
    const extras: NavigationExtras = {queryParams: {page}, queryParamsHandling: 'merge'};
    this.router.navigate([], extras).then();
  }

  search(): void {
    this.isSearchMode = true;

    this.filterParams.set('company_name', this.companyName.value);
    this.filterParams.set('page', '');

    this.navigateWithFilterParams();
  }

  show(item: any): void {
    const dialogRef = this.dialog.open(CompanyDetailsComponent, {
      width: '800px', data: {id: item.company_id, open_from: 'flowing_company'}
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadFollowingCompany(this.filterParams.value);
      }
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

  unfollow(item: FollowingCompanyModel, index: number): void {
    this.fs.unfollowCompany(item.company.id)
      .then((res) => {
        if (res.success) {
          this.handleResponse(res);
        }
      }).finally(() => {
      this.followingCompanies.splice(index, 1);
      this.pagination.total -= 1;
    });
  }

  close(alert: Alert): any {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  private prepareSearchForm(): void {
    this.searchForm = this.fb.group({
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

  get companyName(): FormControl {
    return this.searchForm.get('company_name') as FormControl;
  }
}
