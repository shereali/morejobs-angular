import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SharedViewResumeComponent} from '../../../../../shared/components/shared-view-resume/shared-view-resume.component';


@Component({
  selector: 'app-job-view-resume',
  templateUrl: './job-view-resume.component.html',
  styleUrls: ['./job-view-resume.component.scss'],
})
export class JobViewResumeComponent implements OnInit {
  @ViewChild(SharedViewResumeComponent) sharedViewResumeRef: SharedViewResumeComponent | any;

  viewMode = 'details';

  constructor(
    private dialogRef: MatDialogRef<JobViewResumeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
     console.log(this.data)
  }

  switchViewMode(mode: string): void {
    this.viewMode = mode;
  }

  downloadResume(fileType: string): void {
    this.sharedViewResumeRef.downloadResume(fileType);
  }

  print(): void {
    this.sharedViewResumeRef.printPage();
  }

  closeModal(res = ''): any {
    this.dialogRef.close(res);
  }

}
