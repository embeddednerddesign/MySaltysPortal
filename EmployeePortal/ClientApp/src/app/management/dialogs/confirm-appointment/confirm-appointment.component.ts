import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Appointment } from '../../../models/scheduler/event';

@Component({
    selector: 'app-confirm-appointment',
    templateUrl: './confirm-appointment.component.html',
    styleUrls: ['./confirm-appointment.component.less']
  })
  export class ConfirmAppointmentDialogComponent {
    public dialog: MatDialog;

    constructor(
      public dialogRef: MatDialogRef<ConfirmAppointmentDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Appointment) { }

    onNoClick(): void {
        this.data = null;
    }
}
