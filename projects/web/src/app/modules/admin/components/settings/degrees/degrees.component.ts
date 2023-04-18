import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddDegreesComponent} from './add-degrees/add-degrees.component';
import {FilterParams, ObjectMap} from '../../../../../../../../common/includes/utilities/filterParams';
import {Pagination} from '../../../../../../../../common/includes/utilities/pagination';
import {ApiResponse, CommonSelectBox, perPageOptions} from '../../../../../../../../common/includes/models/common';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';
import {ConfirmationDialogComponent} from '../../../../../components/common/confirmation-dialog/confirmation-dialog.component';
import {pick} from 'lodash';
import {DegreesService} from '../../../../../../../../common/includes/services/admin/settings/degrees.service';
import {DegreeModel} from '../../../../../../../../common/includes/models/admin/degree';

@Component({
  selector: 'app-degrees',
  templateUrl: './degrees.component.html',
  styleUrls: ['./degrees.component.scss'],
})
export class DegreesComponent implements OnInit, AfterViewChecked {
  isLoading = true;

  degrees: Array<DegreeModel> = [];
  filters: { education_levels: Array<{ id: number; title: string }> } = {education_levels: []};

  filterParams = new FilterParams();
  pagination = new Pagination();
  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  searchForm: FormGroup | any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private ds: DegreesService,
    private spinner: SpinnerService,
    private fb: FormBuilder,
    private ts: ToastService,
  ) {
    this.prepareSearchForm();
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngOnInit(): void {
    this.ds.initiateFilters().then((res) => {
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
    this.spinner.show('degree_table_spinner');
    this.ds.loadList(this.filterParams.formattedFilterParams(params)).then((res) => {
      if (res.success) {
        this.degrees = res.data.data;
        this.pagination = new Pagination(res.data);
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('degree_table_spinner');
    });
  }

  search(): void {
    this.filterParams.set('title', this.titleControl.value);
    this.filterParams.set('education_level_id', this.educationLevelControl.value);
    this.filterParams.set('page', '');

    this.navigateWithFilterParams();
  }

  reset(): void {
    this.searchForm.reset();
    this.setSearchFormDefault();
    this.search();
  }

  private setSearchFormDefault(): void {
    this.educationLevelControl.setValue('');
  }


  openCreateModal(item?: DegreeModel | undefined): void {
    const dialogRef = this.dialog.open(AddDegreesComponent, {
      width: '600px', data: item
    });

    dialogRef.afterClosed().subscribe((res: ApiResponse<any>) => {
      if (res && res.success) {
        this.loadList(this.filterParams.value);
      }
    });
  }

  deleteItem(item: DegreeModel): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.spinner.show('action_spinner_' + item.id);
        this.ds.deleteDegree(item.id).then((res) => {
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
      education_level_id: '',
      tag_id: '',
    });
  }

  private setSearchValueFromParams(data: any = {}): void {
    Object
      .keys(pick(data, ['title', 'education_level_id', 'tag_id']))
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
      this.filterParams.value.education_level_id,
      this.filterParams.value.tag_id,
    ].some(value => value);
  }

  get totalRecord(): number {
    return this.pagination.total;
  }

  get titleControl(): FormControl {
    return this.searchForm.get('title') as FormControl;
  }

  get educationLevelControl(): FormControl {
    return this.searchForm.get('education_level_id') as FormControl;
  }
}
