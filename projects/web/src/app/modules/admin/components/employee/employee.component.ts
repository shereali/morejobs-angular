import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FilterParams, ObjectMap} from '../../../../../../../common/includes/utilities/filterParams';
import {Pagination} from '../../../../../../../common/includes/utilities/pagination';
import {CommonSelectBox, perPageOptions} from '../../../../../../../common/includes/models/common';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {SpinnerService} from '../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../../common/includes/services/toast.service';
import {AddDegreesComponent} from '../settings/degrees/add-degrees/add-degrees.component';
import {pick} from 'lodash';
import {UserModel} from '../../../../../../../common/includes/models/user';
import {EmployeesService} from '../../../../../../../common/includes/services/admin/employees.service';
import {EmployeeDetailsComponent} from './employee-details/employee-details.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit, AfterViewChecked {
  isLoading = true;

  employees: Array<UserModel> = [];
  // filters: { education_levels: Array<{ id: number; title: string }> } = {education_levels: []};

  filterParams = new FilterParams();
  pagination = new Pagination();
  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  searchForm: FormGroup | any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private es: EmployeesService,
    private spinner: SpinnerService,
    private fb: FormBuilder,
    private ts: ToastService,
  ) {
    this.prepareSearchForm();
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngOnInit(): void {
    // this.ds.initiateFilters().then((res) => {
    //   if (res.success) {
    //     this.filters = res.data;
    //   }
    // });
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  private handleQueryParams(params: ObjectMap): void {
    this.filterParams.setFilterFromQueryParams(params);
    this.loadList(params);
  }

  loadList(params: ObjectMap = {}): void {
    this.isLoading = true;
    this.spinner.show('employee_table_spinner');
    this.es.loadList(this.filterParams.formattedFilterParams(params)).then((res) => {
      if (res.success) {
        this.employees = res.data.data;
        this.pagination = new Pagination(res.data);
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('employee_table_spinner');
    });
  }

  search(): void {
    this.filterParams.set('search_value', this.searchValueControl.value);
    this.filterParams.set('page', '');

    this.navigateWithFilterParams();
  }

  reset(): void {
    this.searchForm.reset();
    this.search();
  }

  openDetailModel(item: UserModel): void {
    this.dialog.open(EmployeeDetailsComponent, {
      width: '900px', height: '800px', data: item
    });
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

  private prepareSearchForm(): void {
    this.searchForm = this.fb.group({
      search_value: '',
    });
  }

  private setSearchValueFromParams(data: any = {}): void {
    Object
      .keys(pick(data, ['search_value']))
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
      this.filterParams.value.search_value,
    ].some(value => value);
  }

  get totalRecord(): number {
    return this.pagination.total;
  }

  get searchValueControl(): FormControl {
    return this.searchForm.get('search_value') as FormControl;
  }
}
