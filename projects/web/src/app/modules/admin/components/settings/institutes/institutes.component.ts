import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddInstitutesComponent} from './add-institutes/add-institutes.component';
import {FilterParams, ObjectMap} from '../../../../../../../../common/includes/utilities/filterParams';
import {Pagination} from '../../../../../../../../common/includes/utilities/pagination';
import {ApiResponse, CommonSelectBox, perPageOptions} from '../../../../../../../../common/includes/models/common';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {SkillsService} from '../../../../../../../../common/includes/services/admin/settings/skills.service';
import {SpinnerService} from '../../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../../../common/includes/services/toast.service';
import {AddSkillsComponent} from '../skills/add-skills/add-skills.component';
import {ConfirmationDialogComponent} from '../../../../../components/common/confirmation-dialog/confirmation-dialog.component';
import {pick} from 'lodash';
import {InstitutesService} from '../../../../../../../../common/includes/services/admin/settings/institutes.service';

@Component({
  selector: 'app-institutes',
  templateUrl: './institutes.component.html',
  styleUrls: ['./institutes.component.scss'],
})
export class InstitutesComponent implements AfterViewChecked {
  isLoading = true;

  institutes: Array<{ id: number; title: string }> = [];

  filterParams = new FilterParams();
  pagination = new Pagination();
  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  searchForm: FormGroup | any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private is: InstitutesService,
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

  private handleQueryParams(params: ObjectMap): void {
    this.filterParams.setFilterFromQueryParams(params);
    this.loadList(params);
  }

  loadList(params: ObjectMap = {}): void {
    this.isLoading = true;
    this.spinner.show('institute_table_spinner');
    this.is.loadList(this.filterParams.formattedFilterParams(params)).then((res) => {
      if (res.success) {
        this.institutes = res.data.data;
        this.pagination = new Pagination(res.data);
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('institute_table_spinner');
    });
  }

  search(): void {
    this.filterParams.set('title', this.titleControl.value);
    this.filterParams.set('page', '');

    this.navigateWithFilterParams();
  }

  reset(): void {
    this.searchForm.reset();
    this.search();
  }


  openCreateModal(item?: any): void {
    const dialogRef = this.dialog.open(AddInstitutesComponent, {
      width: '600px', data: item
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
        this.is.deleteInstitute(item.id).then((res) => {
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
      title: ''
    });
  }

  private setSearchValueFromParams(data: any = {}): void {
    Object
      .keys(pick(data, ['title']))
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

}
