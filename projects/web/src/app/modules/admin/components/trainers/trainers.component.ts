import {AfterViewChecked, ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {FilterParams, ObjectMap} from '../../../../../../../common/includes/utilities/filterParams';
import {Pagination} from '../../../../../../../common/includes/utilities/pagination';
import {ApiResponse, CommonSelectBox, perPageOptions} from '../../../../../../../common/includes/models/common';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {SpinnerService} from '../../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {ToastService} from '../../../../../../../common/includes/services/toast.service';
import {AddNewCompanyComponent} from '../companies/add-new-company/add-new-company.component';
import {pick} from 'lodash';
import {TrainerModel} from '../../../../../../../common/includes/models/admin/trainer';
import {TrainersService} from '../../../../../../../common/includes/services/admin/trainers.service';
import {AddNewTrainerComponent} from './add-new-trainer/add-new-trainer.component';
import {CategoryModel} from '../../../../../../../common/includes/models/admin/settings/category';
import {ConfirmationDialogComponent} from '../../../../components/common/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-trainers',
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.scss'],
})
export class TrainersComponent implements AfterViewChecked {
  isLoading = true;

  trainers: Array<TrainerModel> = [];

  searchForm: FormGroup | any;

  filterParams = new FilterParams();
  pagination = new Pagination();

  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private trainerService: TrainersService,
    private spinner: SpinnerService,
    private ts: ToastService) {
    this.prepareSearchForm();
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  private handleQueryParams(params: ObjectMap): void {
    this.filterParams.setFilterFromQueryParams(params);
    this.setSearchValueFromParams(params);
    this.loadTrainers(params).then();
  }

  async loadTrainers(params: ObjectMap = {}): Promise<any> {
    this.isLoading = true;
    this.spinner.show('trainer_table_spinner');
    await this.trainerService.loadList(this.filterParams.formattedFilterParams(params)).then((res) => {
        if (res.success) {
          this.handleResponse(res);
        }
      }).finally(() => {
        this.isLoading = false;
        this.spinner.hide('trainer_table_spinner');
      });
  }

  handleResponse(res: any): void {
    this.trainers = res.data.data;
    this.pagination = new Pagination(res.data);
  }

  openCreateModal(item: TrainerModel | {} = ''): void {
    const dialogRef = this.dialog.open(AddNewTrainerComponent, {
      width: '600px', data: item
    });

    dialogRef.afterClosed().subscribe((res: ApiResponse<any>) => {
      if (res && res.success) {
        this.loadTrainers().then();
      }
    });
  }

  deleteItem(item: TrainerModel): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.spinner.show('action_spinner_' + item.id);
        this.trainerService.delete(item.id).then((res) => {
          this.ts.apiMessage(res);
          if (res.success) {
            this.loadTrainers(this.filterParams.value).then();
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
