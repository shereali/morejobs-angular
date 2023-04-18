import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  confirmMessage: string = '' as string;
  public title: string = '' as string;
  public confirmTitle = 'Confirm';
  cancelTitle = 'Cancel';
  isCancel = true;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {
  }

  closeModal(type: any): void {
    this.dialogRef.close(type);
  }

  ngOnInit(): void {
  }
}
