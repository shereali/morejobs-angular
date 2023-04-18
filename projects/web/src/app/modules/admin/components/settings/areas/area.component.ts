import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddAreaComponent} from './add-area/add-area.component';
import {FilterParams, ObjectMap} from '../../../../../../../../common/includes/utilities/filterParams';
import {Pagination, perPageOptions} from '../../../../../../../../common/includes/utilities/pagination';
import {ApiResponse, CommonSelectBox} from '../../../../../../../../common/includes/models/common';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';
import {ConfirmationDialogComponent} from '../../../../../components/common/confirmation-dialog/confirmation-dialog.component';
import {pick} from 'lodash';
import {AreaModel} from '../../../../../../../../common/includes/models/admin/settings/area';
import {AreasService} from '../../../../../../../../common/includes/services/admin/settings/areas.service';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
})
export class AreaComponent implements AfterViewChecked, OnInit {
  isLoading = true;

  areas: Array<AreaModel> = [];
  filters: { countries: Array<{ id: number; title: string }> } = {countries: []};

  filterParams = new FilterParams();
  pagination = new Pagination();
  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  searchForm: FormGroup | any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private as: AreasService,
    private spinner: SpinnerService,
    private fb: FormBuilder,
    private ts: ToastService,
  ) {
    this.prepareSearchForm();
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.as.initiateFilters().then((res) => {
      if (res.success) {
        this.filters = res.data;
      }
    });
  }

  private handleQueryParams(params: ObjectMap): void {
    this.filterParams.setFilterFromQueryParams(params);
    this.loadList(params);
  }

  loadList(params: ObjectMap = {}): void {
    this.isLoading = true;
    this.spinner.show('area_table_spinner');
    this.as.loadList(this.filterParams.formattedFilterParams(params)).then((res) => {
      if (res.success) {
        this.areas = res.data.data;
        this.pagination = new Pagination(res.data);
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('area_table_spinner');
    });
  }

  search(): void {
    this.filterParams.set('title', this.titleControl.value);
    this.filterParams.set('country_id', this.countryIdlControl.value);
    this.filterParams.set('page', '');

    this.navigateWithFilterParams();
  }

  reset(): void {
    this.searchForm.reset();
    this.setSearchFormDefault();
    this.search();
  }

  private setSearchFormDefault(): void {
    this.countryIdlControl.setValue(1);
  }

  openCreateModal(item?: any, mode = 'create'): void {
    const dialogRef = this.dialog.open(AddAreaComponent, {
      width: '600px', data: {data: item, mode, countries: this.filters.countries}
    });

    dialogRef.afterClosed().subscribe((res: ApiResponse<any>) => {
      if (res && res.success) {
        this.loadList(this.filterParams.value);
      }
    });
  }

  deleteItem(item: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.spinner.show('action_spinner_' + item.id);
        this.as.deleteItem(item.id).then((res) => {
          this.ts.apiMessage(res);
          if (res.success) {
            this.loadList(this.filterParams.value);
          }
        }).finally(() => {
          this.spinner.hide('action_spinner_' + item.id);
        });
      }
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
      title: '',
      country_id: 1,
    });
  }

  private setSearchValueFromParams(data: any = {}): void {
    Object
      .keys(pick(data, ['title', 'country_id']))
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
      this.filterParams.value.title,
      this.filterParams.value.country_id,
    ].some(value => value);
  }

  get totalRecord(): number {
    return this.pagination.total;
  }

  get titleControl(): FormControl {
    return this.searchForm.get('title') as FormControl;
  }

  get countryIdlControl(): FormControl {
    return this.searchForm.get('country_id') as FormControl;
  }
}
