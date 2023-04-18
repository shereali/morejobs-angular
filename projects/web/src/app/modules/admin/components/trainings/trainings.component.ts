import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {SpinnerService} from '../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {FilterParams, ObjectMap} from '../../../../../../../common/includes/utilities/filterParams';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ApiResponse, CommonSelectBox} from '../../../../../../../common/includes/models/common';
import {Pagination} from '../../../../../../../common/includes/utilities/pagination';
import {perPageOptions} from '../../../../../../../common/includes/models/employer/job-post';
import {MatDialog} from '@angular/material/dialog';
import {AddNewTrainingsComponent} from './add-new-company/add-new-trainings.component';
import {pick} from 'lodash';
import {ToastService} from '../../../../../../../common/includes/services/toast.service';
import {environment} from '../../../../../../../common/src/environments/environment';
import {TrainingModel} from '../../../../../../../common/includes/models/admin/training';
import {TrainingsService} from '../../../../../../../common/includes/services/admin/trainings.service';
import {ConfirmationDialogComponent} from '../../../../components/common/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss'],
})
export class TrainingsComponent implements OnInit {
  apiUrl = environment.apiUrl;
  isLoading = true;

  summary: { pending: number, approved: number, inactive: number } = {pending: 0, approved: 0, inactive: 0};
  initialData: { organization_types: Array<{ id: number; title_en: string }> } = {organization_types: []};
  trainings: Array<TrainingModel> = [];

  searchForm: FormGroup | any;

  filterParams = new FilterParams();
  pagination = new Pagination();

  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private trs: TrainingsService,
    private spinner: SpinnerService,
    private ts: ToastService) {
    this.prepareSearchForm();
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngOnInit(): void {
    // this.trs.initiateSummary().then((res) => {
    //     if (res.success) {
    //       this.summary = res.data.summary;
    //       this.initialData = res.data.initial_data;
    //     }
    //   });
  }

  private handleQueryParams(params: ObjectMap): void {
    this.filterParams.setFilterFromQueryParams(params);
    this.setSearchValueFromParams(params);
    this.loadList(params).then();
  }

  async loadList(params: ObjectMap = {}): Promise<any> {
    this.isLoading = true;
    this.spinner.show('training_table_spinner');
    await this.trs.loadList(this.filterParams.formattedFilterParams(params)).then((res) => {
      if (res.success) {
        this.handleResponse(res);
      }
    }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('training_table_spinner');
    });
  }

  handleResponse(res: any): void {
    this.trainings = res.data.data;
    this.pagination = new Pagination(res.data);
  }

  openCreateModal(item: TrainingModel | {} = ''): void {
    const dialogRef = this.dialog.open(AddNewTrainingsComponent, {
      width: '900px', data: item
    });

    dialogRef.afterClosed().subscribe((res: ApiResponse<any>) => {
      if (res && res.success) {
        this.loadList().then();
        this.ngOnInit();
      }
    });
  }

  deleteItem(item: TrainingModel): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.spinner.show('action_spinner_' + item.id);
        this.trs.delete(item.id).then((res) => {
          this.ts.apiMessage(res);
          if (res.success) {
            this.loadList(this.filterParams.value).then();
          }
        }).finally(() => {
          this.spinner.hide('action_spinner_' + item.id);
        });
      }
    });
  }

  onChangeStatus(item: TrainingModel, e: any): void {
    // this.spinner.show('company_status_change_spinner' + item.id);
    // this.trs.changeStatus(item.id, e.target.value).then((res) => {
    //   this.ts.apiMessage(res);
    //   if (res.success) {
    //     this.spinner.hide('company_status_change_spinner' + item.id);
    //     this.loadList(this.filterParams.value).then();
    //     this.ngOnInit();
    //   }
    // });
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
