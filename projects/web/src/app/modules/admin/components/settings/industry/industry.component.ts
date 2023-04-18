import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddIndustryComponent} from './add-industry/add-industry.component';
import {FilterParams, ObjectMap} from '../../../../../../../../common/includes/utilities/filterParams';
import {Pagination} from '../../../../../../../../common/includes/utilities/pagination';
import {ApiResponse, CommonSelectBox, perPageOptions} from '../../../../../../../../common/includes/models/common';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';
import {ConfirmationDialogComponent} from '../../../../../components/common/confirmation-dialog/confirmation-dialog.component';
import {pick} from 'lodash';
import {IndustryTypesService} from '../../../../../../../../common/includes/services/admin/settings/industryTypes.service';

export interface IndustryTypeModel {
  sub_industry_types_count: number;
  id: number;
  parent_id: number | null;
  title_en: string;
  title_bn: string;
  parent: { id: number; title_en: string; title_bn: string };
  sub_industry_types: Array<{ id: number; title_en: string; title_bn: string }>;
}

@Component({
  selector: 'app-industry',
  templateUrl: './industry.component.html',
  styleUrls: ['./industry.component.scss'],
})
export class IndustryComponent implements OnInit, AfterViewChecked {
  isLoading = true;

  industryTypes: Array<IndustryTypeModel> = [];
  filters: { parents: Array<IndustryTypeModel>, } = {
    parents: [],
  };

  filterParams = new FilterParams();
  pagination = new Pagination();
  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  searchForm: FormGroup | any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private its: IndustryTypesService,
    private spinner: SpinnerService,
    private fb: FormBuilder,
    private ts: ToastService,
  ) {
    this.prepareSearchForm();
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngOnInit(): void {
    this.its.initiateFilters().then((res) => {
      if (res.success) {
        this.filters = res.data;
      }
    });
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
    this.spinner.show('industry_type_table_spinner');
    this.its.loadList(this.filterParams.formattedFilterParams(params)).then((res) => {
      if (res.success) {
        this.industryTypes = res.data.data;
        this.pagination = new Pagination(res.data);
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('industry_type_table_spinner');
    });
  }

  search(): void {
    this.filterParams.set('title', this.titleControl.value);
    this.filterParams.set('parent_id', this.parentIdControl.value);
    this.filterParams.set('page', '');

    this.navigateWithFilterParams();
  }

  reset(): void {
    this.searchForm.reset();
    this.setSearchFormDefault();
    this.search();
  }

  private setSearchFormDefault(): void {
    this.parentIdControl.setValue('');
  }


  openCreateModal(item?: IndustryTypeModel | undefined): void {
    const dialogRef = this.dialog.open(AddIndustryComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: item
    });

    dialogRef.afterClosed().subscribe((res: ApiResponse<any>) => {
      if (res && res.success) {
        this.loadList(this.filterParams.value);
      }
    });
  }

  deleteItem(item: IndustryTypeModel): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.spinner.show('action_spinner_' + item.id);
        this.its.deleteIndustryType(item.id).then((res) => {
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
      parent_id: '',
    });
  }

  private setSearchValueFromParams(data: any = {}): void {
    Object
      .keys(pick(data, ['title', 'parent_id']))
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
      this.filterParams.value.parent_id,
    ].some(value => value);
  }

  get totalRecord(): number {
    return this.pagination.total;
  }

  get titleControl(): FormControl {
    return this.searchForm.get('title') as FormControl;
  }

  get parentIdControl(): FormControl {
    return this.searchForm.get('parent_id') as FormControl;
  }
}
