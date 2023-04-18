import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ResumeDetailModel} from '../../../../../common/includes/models/resume';
import {environment} from '../../../../../common/src/environments/environment';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {FilterParams, ObjectMap} from '../../../../../common/includes/utilities/filterParams';
import {ViewResumeService} from '../../../../../common/includes/services/employees/resume/view-resume.service';
import {SpinnerService} from '../../../../../common/includes/shared/elements/spinner/spinner.service';
import {AuthService} from '../../../../../common/includes/services/auth.service';
import {asBlob} from 'html-docx-js-typescript';
import {ToastService} from '../../../../../common/includes/services/toast.service';

@Component({
  selector: 'app-view-resume',
  templateUrl: './view-resume.component.html',
  styleUrls: ['./view-resume.component.scss'],
})
export class ViewResumeComponent implements OnInit {
  @ViewChild('temRef') temRef: ElementRef | any;

  apiUrl = environment.apiUrl;
  loading = true;
  viewMode = 'details';
  resumeDetail: ResumeDetailModel | any;
  resumeCompleted = 0;
  id: any;

  imageUrl = '';

  filterParams = new FilterParams();

  constructor(
    private as: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private vrs: ViewResumeService,
    private spinner: SpinnerService,
    private ts: ToastService) {
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  ngOnInit(): void {
  }

  private handleQueryParams(params: ObjectMap): void {
    const user = this.as.getUser();
    this.id = user?.id;
    this.resumeCompleted = user ? user.resume_completed : 0;
    this.viewMode = params.view_mode || this.viewMode;
    this.filterParams.setFilterFromQueryParams(params);

    this.loadResumeDetail();
  }

  loadResumeDetail(): void {
    this.spinner.show('view_resume_spinner');
    console.log(this.id)
    this.vrs.resumeDetails(this.id).then(res => {
      if (res.success === true) {
        this.resumeDetail = res.data;

        this.getBase64ImageFromUrl()
          .then(result => {
            this.imageUrl = result;
          })
          .catch(err => console.error(err));
      }else{
        this.ts.apiMessage(res);
      }
    }).finally(() => {
      this.loading = false;
      this.spinner.hide('view_resume_spinner');
    });
  }

  switchViewMode(mode: string): void {
    this.viewMode = mode;

    this.filterParams.set('view_mode', mode);
    this.navigateWithFilterParams();
  }

  convertedArrayToString(items: Array<[]>, title: string, delimiter: string = ', '): string {
    return Array.prototype.map.call(items, x => {
      return x[title];
    }).join(delimiter);
  }

  formattedData(data: Array<any>, key: string): string {
    return data.map((item: any) => item[key]).join(', ');
  }

  private navigateWithFilterParams(queryParamsHandling: QueryParamsHandling = 'merge'): void {
    const extras: NavigationExtras = {
      queryParams: this.filterParams.value,
      queryParamsHandling,
      replaceUrl: true
    };
    this.router.navigate([], extras).then();
  }

  downloadResume(): void {
    const html = this.temRef.nativeElement.innerHTML;

    const blob = asBlob(html, {orientation: 'landscape', margins: {top: 100}});

    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, this.resumeDetail.first_name + '.docx');
    } else {
      downloadLink.href = url;
      downloadLink.download = this.resumeDetail.first_name + '.docx';
      downloadLink.click();
    }

    document.body.removeChild(downloadLink);
  }

  async getBase64ImageFromUrl(): Promise<any> {
    const imageUrl = this.resumeDetail.image ? this.apiUrl + this.resumeDetail.image : 'assets/images/avatar.png';
    const res = await fetch(imageUrl);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // tslint:disable-next-line:only-arrow-functions
      reader.addEventListener('load', function(): any {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }

}
