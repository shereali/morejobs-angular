import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {environment} from '../../../../../../common/src/environments/environment';
import {ResumeDetailModel} from '../../../../../../common/includes/models/resume';
import {FilterParams, ObjectMap} from '../../../../../../common/includes/utilities/filterParams';
import {AuthService} from '../../../../../../common/includes/services/auth.service';
import {ActivatedRoute, NavigationExtras, QueryParamsHandling, Router} from '@angular/router';
import {ViewResumeService} from '../../../../../../common/includes/services/employees/resume/view-resume.service';
import {SpinnerService} from '../../../../../../common/includes/shared/elements/spinner/spinner.service';
import {asBlob} from 'html-docx-js-typescript';
import {ToastService} from '../../../../../../common/includes/services/toast.service';
// @ts-ignore
import * as pdfMake from 'pdfmake/build/pdfmake';
// @ts-ignore
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

const htmlToPdfmake = require('html-to-pdfmake');
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-shared-view-resume',
  templateUrl: './shared-view-resume.component.html',
  styleUrls: ['./shared-view-resume.component.scss'],
})
export class SharedViewResumeComponent implements OnInit {
  @ViewChild('temRef') temRef: ElementRef | any;
  @Input() viewMode = 'details';
  @Input() id = 0;

  apiUrl = environment.apiUrl;
  loading = true;
  resumeDetail: ResumeDetailModel | any;
  imageUrl = '';

  filterParams = new FilterParams();

  constructor(
    private as: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private vrs: ViewResumeService,
    private spinner: SpinnerService,
    private ts: ToastService) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((data) => this.handleQueryParams(data));
  }

  private handleQueryParams(params: ObjectMap): void {
    this.viewMode = params.view_mode || this.viewMode;
    this.filterParams.setFilterFromQueryParams(params);

    this.loadResumeDetail();
  }

  loadResumeDetail(): void {
    this.spinner.show('view_resume_spinner');
    this.vrs.resumeDetails(this.id).then(res => {
      if (res.success === true) {
        this.resumeDetail = res.data;

        this.getBase64ImageFromUrl()
          .then(result => {
            this.imageUrl = result;
          })
          .catch(err => console.error(err));
      } else {
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

  downloadResume(fileType = 'docx'): void {
    if (fileType === 'docx') {
      const html = this.temRef.nativeElement.innerHTML;
      const blob = asBlob(html, {orientation: 'landscape', margins: {top: 100}});

      const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
      const downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);

      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, this.resumeDetail.first_name + '.pdf');
      } else {
        downloadLink.href = url;
        downloadLink.download = this.resumeDetail.first_name + '.docx';
        downloadLink.click();
      }

      document.body.removeChild(downloadLink);

    } else if (fileType === 'pdf') {
      const pdfTable = this.temRef.nativeElement;
      const html1 = htmlToPdfmake(pdfTable.innerHTML);
      const documentDefinition = {content: html1};
      pdfMake.createPdf(documentDefinition).download();
    }
  }

  printPage(): void {
    const printContents = this.temRef.nativeElement.innerHTML;
    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    // @ts-ignore
    popupWin.document.open();
    // @ts-ignore
    popupWin.document.write(`
      <html>
        <head>
<!--          <title>Print tab</title>-->
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    // @ts-ignore
    popupWin.document.close();
  }

  async getBase64ImageFromUrl(): Promise<any> {
    const imageUrl = this.resumeDetail.image ? this.resumeDetail.image : 'assets/images/avatar.png';

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
