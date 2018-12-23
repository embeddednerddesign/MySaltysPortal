import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-confirm-appt-cancel',
    templateUrl: './confirm-appt-cancel.component.html',
    styleUrls: ['./confirm-appt-cancel.component.less']
  })
  export class ConfirmApptCancelDialogComponent {
    public dialog: MatDialog;

    constructor(
      public dialogRef: MatDialogRef<ConfirmApptCancelDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.data.result = 'cancel';
    }
}
