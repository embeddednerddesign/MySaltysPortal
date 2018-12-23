import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Patient } from '../models/patient';

import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { AuthService } from '../services/auth.service';
import { MasterOverlayService } from '../services/actionpanel.service';
import { EventsService } from '../services/events.service';
import { PatientService } from '../services/patient.service';
import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material';
import { VisitStatusDialogComponent } from '../visit-status-dialog/visit-status-dialog.component';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.less']
})
export class TopnavComponent implements OnInit {

  searchCtrl: FormControl;
  filteredPatients: Observable<Patient[]>;

  patients: Patient[] = [];
  currentDate: Date;

  constructor(private authService: AuthService,
              private eventsService: EventsService,
              private patientService: PatientService,
              private masterOverlayService: MasterOverlayService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog) {
    this.searchCtrl = new FormControl();
    this.filteredPatients = this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        map(patient => patient ? this.filterPatients(patient) : this.patients.slice())
      );
    this.eventsService.patientListChanged$.subscribe(() => this.updatePatientList());
  }

  ngOnInit() {
    this.updatePatientList();
    this.eventsService.currentDate.subscribe(date => this.currentDate = date);
  }

  filterPatients(name: string) {
    let searchArgs: string[] = [];
    searchArgs = name.split(' ', 2);
    return this.patients.filter(patient =>
      (((patient.firstName.toLowerCase().includes(searchArgs[0].toLowerCase())) ||
        (patient.lastName.toLowerCase().includes(searchArgs[0].toLowerCase()))) &&
          (searchArgs[1] === undefined || searchArgs[1] === '' ||
           ((patient.firstName.toLowerCase().includes(searchArgs[1].toLowerCase())) ||
            (patient.lastName.toLowerCase().includes(searchArgs[1].toLowerCase()))))));
  }

  addPatient() {
    this.patientService.editPatientSourceURL = this.router.url;
    this.masterOverlayService.masterOverlayState(true);
    this.router.navigate([this.router.url, { outlets: {'action-panel': ['edit-patient', '_']}}]);
  }

  updatePatientList() {
    this.patientService.getAllPatients().subscribe(p => {
      p.forEach (patient => {
        this.patients.push(patient as Patient);
      });
    });
  }

  patientSelected(patientValue) {
    const selectedPatient: Patient = this.patients.find(p => (p.firstName + ' ' + p.lastName) === patientValue);
    if (!isNullOrUndefined(selectedPatient)) {
      this.masterOverlayService.masterOverlayState(true);
      this.router.navigate([this.router.url, { outlets: {'action-panel': ['patient', selectedPatient.patientId]}}]);
      // this.router.navigate(['/patient/', selectedPatient.patientId]);
    }
  }

  onTap(event) {
  }

  logout() {
    this.authService.logout();
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
