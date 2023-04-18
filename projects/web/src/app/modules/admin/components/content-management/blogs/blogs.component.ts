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
import {AddNewBlogComponent} from './add-new-blog/add-new-blog.component';

@Component({
  selector: 'app-blog',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
})
export class BlogsComponent implements OnInit, AfterViewChecked {
  isLoading = true;

  records: Array<BlogModel> = [];

  blogType = 'admissions';

  filterParams = new FilterParams();
  pagination = new Pagination();
  perPageOptions: Array<CommonSelectBox> = perPageOptions;

  searchForm: FormGroup | any;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private bs: BlogService,
    private spinner: SpinnerService,
    private fb: FormBuilder,
    private ts: ToastService,
  ) {
    if (location.isCurrentPathEqualTo('/admin/content-management/events')) {
      this.blogType = 'events';
    } else if (location.isCurrentPathEqualTo('/admin/content-management/scholarships')) {
      this.blogType = 'scholarships';
    }else if (location.isCurrentPathEqualTo('/admin/content-management/articles')) {
      this.blogType = 'articles';
    }

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
    this.spinner.show('blog_table_spinner');
    this.bs.loadList(this.filterParams.formattedFilterParams(params), this.blogType)
      .then((res) => {
        if (res.success) {
          this.records = res.data.data;
          this.pagination = new Pagination(res.data);
        }
      }).finally(() => {
      this.isLoading = false;
      this.spinner.hide('blog_table_spinner');
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


  openCreateModal(item?: BlogModel | undefined): void {
    const dialogRef = this.dialog.open(AddNewBlogComponent, {
      width: '800px', data: {data: item, blog_type: this.blogType},
    });

    dialogRef.afterClosed().subscribe((res: ApiResponse<any>) => {
      if (res && res.success) {
        this.loadList(this.filterParams.value);
      }
    });
  }

  deleteItem(item: BlogModel): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.spinner.show('action_spinner_' + item.id);
        this.bs.delete(item.id).then((res) => {
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
