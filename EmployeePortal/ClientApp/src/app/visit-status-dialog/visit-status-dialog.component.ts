import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VisitService } from '../services/visit.service';
import { Visit } from '../models/visit';
import * as moment from 'moment';
import { Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-visit-status-dialog',
  templateUrl: './visit-status-dialog.component.html',
  styleUrls: ['./visit-status-dialog.component.less']
})
export class VisitStatusDialogComponent implements OnInit, OnDestroy {

  visits: Visit[] = [];
  patients: Patient[];
  unsub: Subject<void> = new Subject<void>();
  date: Date;
  checkedInList: number[] = [];

  constructor(
    public visitService: VisitService,
    public patientService: PatientService,
    public dialogRef: MatDialogRef<VisitStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.dialogRef.close();
    this.visits.forEach(v => {
      if (this.checkedInList.includes(v.visitId)) {
        v.noShow = false;
        v.confirmed = true;
        v.checkedIn = true;
      }
      this.updateVisit(v);
    });
  }

  checkInClick(visit: Visit) {
    this.checkedInList.push(visit.visitId);
  }

  ngOnInit() {
    // this.date = this.data.date;
    // const timezoneOffset = this.date.getTimezoneOffset();
    // moment(this.date).add(timezoneOffset, 'minutes');
    this.checkedInList = [];
    this.date = new Date();
    this.visitService.getVisitsByDate(this.date.toDateString()).pipe(takeUntil(this.unsub)).subscribe(visits => {
      visits.forEach(v => {
        if (!v.checkedIn) {
          this.visits.push(v);
        }
      });
      this.patientService.getAllPatients().pipe(takeUntil(this.unsub)).subscribe(patients => {
        this.patients = patients;
      });
    });
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  getPatientName(patientId) {
    if (this.patients) {
      const patient = this.patients.find(p => p.patientId === patientId);
      return patient.firstName + ' ' + patient.lastName;
    } else {
      return '';
    }
  }

  updateVisit(visit) {
    this.visitService.updateVisit(visit).pipe(takeUntil(this.unsub)).subscribe(v => {
    });
  }

  notConfirmedClicked(visit) {
    visit.noShow = false;
    visit.confirmed = false;
    visit.checkedIn = false;
    this.updateVisit(visit);
  }

  confirmedClicked(visit) {
    visit.noShow = false;
    visit.confirmed = true;
    visit.checkedIn = false;
    this.updateVisit(visit);
  }

  checkInClicked(visit) {
    visit.noShow = false;
    visit.confirmed = true;
    visit.checkedIn = true;
    this.updateVisit(visit);
  }

  noShowClicked(visit) {
    visit.confirmed = false;
    visit.checkedIn = false;
    visit.noShow = true;
    this.updateVisit(visit);
  }

  visitStatusClicked(visit) {
    if (visit.noShow === false && visit.confirmed === false && visit.checkedIn === false) {
      visit.noShow = false;
      visit.confirmed = true;
      visit.checkedIn = false;
    }
    else if (visit.noShow === false && visit.confirmed === true && visit.checkedIn === false) {
      visit.noShow = false;
      visit.confirmed = true;
      visit.checkedIn = true;
    }
    else if (visit.noShow === false && visit.confirmed === true && visit.checkedIn === true) {
      visit.noShow = false;
      visit.confirmed = false;
      visit.checkedIn = false;
    }
    this.updateVisit(visit);
  }

  getReadableDate() {
    return moment(this.date).format('MMM Do YYYY');
  }
}

export interface DialogData {
  date: Date;
}
