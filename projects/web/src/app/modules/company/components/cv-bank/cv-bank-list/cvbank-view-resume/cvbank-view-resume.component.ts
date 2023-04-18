import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SharedViewResumeComponent} from '../../../../../../shared/components/shared-view-resume/shared-view-resume.component';


@Component({
  selector: 'app-cv-bank-view-resume',
  templateUrl: './cvbank-view-resume.component.html',
  styleUrls: ['./cvbank-view-resume.component.scss'],
})
export class CvbankViewResumeComponent implements OnInit {
  @ViewChild(SharedViewResumeComponent) sharedViewResumeRef: SharedViewResumeComponent | any;

  viewMode = 'details';

  constructor(
    private dialogRef: MatDialogRef<CvbankViewResumeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
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
