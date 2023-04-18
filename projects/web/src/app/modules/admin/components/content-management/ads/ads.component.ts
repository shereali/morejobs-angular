import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {FilterParams, ObjectMap} from '../../../../../../../../common/includes/utilities/filterParams';
import {Pagination} from '../../../../../../../../common/includes/utilities/pagination';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {ApiResponse, CommonSelectBox, perPageOptions} from '../../../../../../../../common/includes/models/common';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {pick} from 'lodash';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';
import {ConfirmationDialogComponent} from '../../../../../components/common/confirmation-dialog/confirmation-dialog.component';
import {BlogService} from '../../../../../../../../common/includes/services/admin/blog.service';
import {BlogModel} from '../../../../../../../../common/includes/models/admin/blog';
import {AddNewAdsComponent} from './add-new-ads/add-new-ads.component';
import {AdsModel} from '../../../../../../../../common/includes/models/admin/ads';
import {AdsService} from '../../../../../../../../common/includes/services/admin/ads.service';
import {PostModel} from '../../../../../../../../common/includes/models/admin/post';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss'],
})
export class AdsComponent implements OnInit, AfterViewChecked {
  isLoading = true;

  records: Array<AdsModel> = [];

  filterParams = new FilterParams();
  pagination = new Pagination();
  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  searchForm: FormGroup | any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private as: AdsService,
    private spinner: SpinnerService,
    private fb: FormBuilder,
    private ts: ToastService,
  ) {
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

  }

  private handleQueryParams(params: ObjectMap): void {
    this.filterParams.setFilterFromQueryParams(params);

    this.loadList(params);
  }

  loadList(params: ObjectMap = {}): void {
    this.isLoading = true;
    this.spinner.show('ads_table_spinner');
    this.as.loadList(this.filterParams.formattedFilterParams(params)).then((res) => {
        if (res.success) {
          this.records = res.data.data;
          this.pagination = new Pagination(res.data);
        }
      }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('ads_table_spinner');
    });
  }

  search(): void {
    this.filterParams.set('title', this.titleControl.value);
    this.filterParams.set('category_type_id', this.categoryTypeIdControl.value);
    this.filterParams.set('tag_id', this.tagIdControl.value);
    this.filterParams.set('page', '');

    this.navigateWithFilterParams();
  }

  reset(): void {
    this.searchForm.reset();
    this.setSearchFormDefault();
    this.search();
  }

  private setSearchFormDefault(): void {
    this.categoryTypeIdControl.setValue('');
    this.tagIdControl.setValue('');
  }

  openCreateModal(item?: AdsModel | undefined): void {
    const dialogRef = this.dialog.open(AddNewAdsComponent, {
      width: '800px', data: item
    });

    dialogRef.afterClosed().subscribe((res: ApiResponse<any>) => {
      if (res && res.success) {
        this.loadList(this.filterParams.value);
      }
    });
  }

  deleteItem(item: AdsModel): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.spinner.show('action_spinner_' + item.id);
        this.as.delete(item.id).then((res) => {
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

  onChangeStatus(item: AdsModel, e: any): void {
    this.spinner.show('ads_status_change_spinner' + item.id);
    this.as.changeStatus(item.id, e.target.value).then((res) => {
      this.ts.apiMessage(res);
      if (res.success) {
        this.spinner.hide('ads_status_change_spinner' + item.id);
        this.loadList(this.filterParams.value);
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

  private setSearchValueFromParams(data: any = {}): void {
    Object
      .keys(pick(data, ['title', 'category_type_id', 'tag_id']))
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
      this.filterParams.value.category_type_id,
      this.filterParams.value.tag_id,
    ].some(value => value);
  }

  get totalRecord(): number {
    return this.pagination.total;
  }

  get titleControl(): FormControl {
    return this.searchForm.get('title') as FormControl;
  }

  get categoryTypeIdControl(): FormControl {
    return this.searchForm.get('category_type_id') as FormControl;
  }

  get tagIdControl(): FormControl {
    return this.searchForm.get('tag_id') as FormControl;
  }

}
