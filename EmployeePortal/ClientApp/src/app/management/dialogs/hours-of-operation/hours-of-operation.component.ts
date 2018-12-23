import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HoursOfOperation, BusinessWeek } from '../../../models/hoursofoperation';
import { HoursOfOperationService, getBusinessWeek, getHoursOfOperationDays } from '../../../services/hoursofoperation.service';

@Component({
  selector: 'app-hours-of-operation',
  templateUrl: './hours-of-operation.component.html',
  styleUrls: ['./hours-of-operation.component.less']
})
export class HoursOfOperationDialogComponent implements OnInit {
  public dialog: MatDialog;

  buzzOn: BusinessWeek;

  constructor(
    public dialogRef: MatDialogRef<HoursOfOperationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public business: { companyId: Number; buzzHours: HoursOfOperation },
    private hoursOfOperationService: HoursOfOperationService
  ) {}

  ngOnInit() {
    this.buzzOn = getBusinessWeek(this.business.buzzHours.hoursOfOperationDays);
  }

  save() {
    const days = getHoursOfOperationDays(this.buzzOn);
    this.business.buzzHours.hoursOfOperationDays = days;

    this.hoursOfOperationService.saveHoursOfOperation(this.business.companyId, this.business.buzzHours).subscribe(
      res => {
        this.dialogRef.close(res);
      },
      err => {
        // TODO: decide what to do with err
      }
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
