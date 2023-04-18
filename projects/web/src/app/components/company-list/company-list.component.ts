import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CommonSelectBox} from '../../../../../common/includes/models/common';
import {FilterParams, ObjectMap} from '../../../../../common/includes/utilities/filterParams';
import {Pagination} from '../../../../../common/includes/utilities/pagination';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {UnfollowedCompanyService} from '../../../../../common/includes/services/unfollowed-company.service';
import {perPageOptions, UnfollowedCompanyModel} from '../../../../../common/includes/models/following-company';
import {MatDialog} from '@angular/material/dialog';
import {CompanyDetailsComponent} from './company-details/company-details.component';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent implements OnInit {
  isLoading = false;

  unfollowedCompanies: Array<UnfollowedCompanyModel> = [];
  industryTypes: Array<{ id: number | string, title_en: string }> = [{id: '', title_en: 'Select Option'}];
  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  searchForm: FormGroup | any;

  filterParams = new FilterParams();
  pagination = new Pagination();

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ufs: UnfollowedCompanyService,
  ) {
    this.prepareSearchForm();
    this.setSearchFormDefault();
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngOnInit(): void {
    this.ufs.initiateFilter()
      .then((res) => {
        if (res.success) {
          this.industryTypes = [...this.industryTypes, ...res.data.industry_types];
        }
      });
  }

  private handleQueryParams(params: ObjectMap): void {
    this.filterParams.setFilterFromQueryParams(params);

    this.loadFollowingCompany(params);
  }

  loadFollowingCompany(params: ObjectMap): void {
    this.isLoading = true;
    this.ufs.unfollowedCompanyList(this.filterParams.formattedFilterParams(params))
      .then((res) => {
        if (res.success) {
          this.handleResponse(res);
        }
      }).finally(() => {
      this.isLoading = false;
    });
  }

  handleResponse(res: any): void {
    this.unfollowedCompanies = res.data.data;
    this.pagination = new Pagination(res.data);
  }

  show(item: UnfollowedCompanyModel): void {
    item.open_from = 'employee_list';
    const dialogRef = this.dialog.open(CompanyDetailsComponent, {
      width: '800px', data: item
    });
  }

  changePage(page: number): void {
    const extras: NavigationExtras = {queryParams: {page}, queryParamsHandling: 'merge'};
    this.router.navigate([], extras).then();
  }

  search(): void {
    this.filterParams.set('company_name', this.companyName.value);
    this.filterParams.set('industry_type', this.industryType.value);
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
      industry_type: '',
      company_name: '',
    });
  }

  private setSearchFormDefault(): void {
    this.industryType.setValue(this.industryTypes[0].id);
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
      this.filterParams.value.industry_type,
      this.filterParams.value.company_name,
    ].some(value => value);
  }

  get totalRecord(): number {
    return this.pagination.total;
  }

  get companyName(): FormControl {
    return this.searchForm.get('company_name') as FormControl;
  }

  get industryType(): FormControl {
    return this.searchForm.get('industry_type') as FormControl;
  }
}
