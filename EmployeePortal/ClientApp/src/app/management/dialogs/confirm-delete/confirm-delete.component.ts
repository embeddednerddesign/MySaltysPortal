import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-confirm-delete',
    templateUrl: './confirm-delete.component.html',
    styleUrls: ['./confirm-delete.component.less']
  })
  export class ConfirmDeleteDialogComponent {
    public dialog: MatDialog;

    constructor(
      public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.data.result = 'cancel';
    }
}
