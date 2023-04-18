import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UploadResumeService} from '../../../../../common/includes/services/employees/resume/upload-resume.service';
import {ToastService} from '../../../../../common/includes/services/toast.service';
import {ApiResponse} from '../../../../../common/includes/models/common';
import {SpinnerService} from '../../../../../common/includes/shared/elements/spinner/spinner.service';
import {AuthService} from '../../../../../common/includes/services/auth.service';
import {CookieService} from 'ngx-cookie-service';
import {HttpResponse} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-upload-resume',
  templateUrl: './upload-resume.component.html',
  styleUrls: ['./upload-resume.component.scss'],
})
export class UploadResumeComponent implements OnInit {

  loading = false;
  submitAttempt = false;
  deleteAttempt = false;
  downloadAttempt = false;
  resumeCompleted = 0;

  resumeFileName = 'You didn\'t upload any CV yet.';
  fileExtension = '';
  resumeFileLink: string | '' = '';

  myForm = new FormGroup({
    file: new FormControl('', [Validators.required, requiredFileType(['pdf', 'doc', 'docx'])]),
  });


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private as: AuthService,
    private rs: UploadResumeService,
    private ts: ToastService,
    private spinner: SpinnerService,
    private cookieService: CookieService) {
  }

  ngOnInit(): void {
    const user = this.as.getUser();
    this.resumeCompleted = user ? user.resume_completed : 0;

    if (this.resumeCompleted) {
      this.loading = true;
      this.spinner.show('upload_resume_spinner');
      this.rs.loadUploadedResume().then((res: ApiResponse<any>) => {
        if (res.success === true) {
          if (res.data?.resume_file) {
            this.handleResponse(res.data.resume_file);
          }
        }
      }).finally(() => {
        this.loading = false;
        this.spinner.hide('upload_resume_spinner');
      });
    }
  }

  uploadResumeFile(fileInput: any): void {
    const file: File | '' = fileInput ? fileInput.files[0] : '';

    if (this.myForm.valid) {
      this.submitAttempt = true;
      this.spinner.show('resume_file_upload_btn_spinner');
      this.rs.uploadResumeFile(file).then(res => {
        this.ts.apiMessage(res);
        if (res.success === true) {
          this.handleResponse(res.data.profile.resume_file);
        }
      }).finally(() => {
        this.submitAttempt = false;
        this.spinner.hide('resume_file_upload_btn_spinner');
      });
    }
  }

  deleteResumeFile(): void {
    this.deleteAttempt = true;
    this.spinner.show('resume_file_delete_btn_spinner');
    this.rs.deleteResumeFile().then(res => {
      this.ts.apiMessage(res);
      if (res.success === true) {
        // @ts-ignore
        this.document.defaultView.location.reload();
        // this.handleResponse(res.data);
      }
    }).finally(() => {
      this.deleteAttempt = false;
      this.spinner.hide('resume_file_delete_btn_spinner');
    });
  }

  async downloadResumeFile(): Promise<void> {
    this.downloadAttempt = true;
    this.spinner.show('resume_file_download_btn_spinner');
    await this.rs.downloadResumeFile().then((res: HttpResponse<Blob>) => {
      console.log(res.headers);
      const url = window.URL.createObjectURL(res.body);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'export file.pdf';
      link.click();

      window.URL.revokeObjectURL(url);
    }).finally(() => {
      this.downloadAttempt = false;
      this.spinner.hide('resume_file_download_btn_spinner');
    });
  }

  private handleResponse(resumeFile: string): void {
    this.resumeFileName = 'You didn\'t upload any CV yet.';
    this.fileExtension = '';
    this.resumeFileLink = '';


    if (resumeFile) {
      const user = JSON.parse(this.cookieService.get('user') as string);
      this.fileExtension = resumeFile.substr(resumeFile.lastIndexOf('.') + 1);
      this.resumeFileName = user.first_name + '.' + this.fileExtension;
      this.resumeFileLink = resumeFile;
    }
  }

  get file(): FormControl {
    return this.myForm.get('file') as FormControl;
  }
}

export function requiredFileType(types: Array<string>): any {
  return (control: FormControl) => {
    const file = control.value;
    if (file) {
      const extension = file.split('.').pop().toLowerCase();
      const typesLowercase = types.map(x => x.toLowerCase());

      if (!typesLowercase.includes(extension)) {
        return {
          requiredFileType: true
        };
      }
      return null;
    }
    return null;
  };
}
