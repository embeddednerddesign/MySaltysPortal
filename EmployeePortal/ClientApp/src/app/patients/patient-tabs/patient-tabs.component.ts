import * as moment from 'moment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from '../../models/patient';
import { Address } from '../../models/address';
import { PatientService } from '../../services/patient.service';
import { MasterOverlayService } from '../../services/actionpanel.service';
import { MatDialog } from '@angular/material';
import { VisitStatusDialogComponent } from '../../visit-status-dialog/visit-status-dialog.component';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-patient-tabs',
  templateUrl: './patient-tabs.component.html',
  styleUrls: ['./patient-tabs.component.less']
})
export class PatientTabsComponent implements OnInit {
  @ViewChild('patientNotesEntry') patientNotesEntry;

  currentDate: Date;

  editIsEnabled = false;

  get thePatient(): Patient {
    return this.patientService.patientPanelPatient;
  }
  set thePatient(value: Patient) {
    this.patientService.patientPanelPatient = value;
  }

  constructor(private router: Router,
              private patientService: PatientService,
              private eventsService: EventsService,
              private masterOverlayService: MasterOverlayService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.eventsService.currentDate.subscribe(date => this.currentDate = date);
  }

  getBirthday(date) {
    return moment(date).format('MMMM Do YYYY');
  }

  getAge(date) {
    return moment(new Date(Date.now())).diff(moment(date), 'years');
  }

  editPatientNotes() {
    this.editIsEnabled = true;
  }

  savePatientNotes() {
    this.thePatient.notesAndAlerts = this.patientNotesEntry.nativeElement.value;
    this.patientService.updatePatient(this.thePatient).subscribe(() => {
    });
    this.editIsEnabled = false;
  }

  cancelPatientNotes() {
    this.editIsEnabled = false;
  }

  closePatientPanel() {
    this.masterOverlayService.masterOverlayState(false);
    const returnURL = this.router.url.slice(0, this.router.url.indexOf('('));
    this.router.navigate([returnURL, { outlets: {'action-panel': null}}]);
  }

  bookAppointment() {
    this.patientService.previousPage = this.router.url;
    this.masterOverlayService.masterOverlayState(false);
    this.router.navigate(['schedule', { outlets: { 'action-panel': ['create-visit'] } }]);
  }

  patientCheckInClicked() {
    const dialogRef = this.dialog.open(VisitStatusDialogComponent, {
      width: '330px',
      data: { date: this.currentDate }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.eventsService.appointmentAdded.next();
    });
  }

}
