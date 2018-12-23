import { Component, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Patient } from '../models/patient';
import { isNullOrUndefined } from 'util';
import { VisitService } from '../services/visit.service';
import { Visit } from '../models/visit';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.less']
})
export class PatientComponent implements OnInit {

  get thePatient(): Patient {
    return this.patientService.patientPanelPatient;
  }
  set thePatient(value: Patient) {
    this.patientService.patientPanelPatient = value;
  }

  unsub: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private patientService: PatientService,
              private visitService: VisitService) { }

  ngOnInit() {
    this.route.params.takeUntil(this.unsub).subscribe(params => {
      const id = params['patId'];
      if (id && id !== '_') {
        // TODO: add this to the condition: && isNumber(id) && id > 0
        this.patientService.getPatientById(id).subscribe(patient => {
          if (isNullOrUndefined(patient.address)) {
            patient.address = {
              address1: '',
              address2: '',
              city: '',
              country: 'Canada',
              postalCode: '',
              province: 'British Columbia'
             };
          }
          if (isNullOrUndefined(patient.familyPhysician)) {
            patient.familyPhysician = {
              doctorId: 0,
              proTitle: '',
              firstName: '',
              lastName: '',
              address: {
                address1: '',
                address2: '',
                city: '',
                country: 'Canada',
                postalCode: '',
                province: 'British Columbia'
              },
              phoneNumber: '',
              faxNumber: '',
              email: '',
              website: '',
              hoursOfOperation: null,
              specialty: '',
            };
          }
          if (isNullOrUndefined(patient.preferredPharmacy)) {
            patient.preferredPharmacy = {
              pharmacyId: 0,
              name: '',
              address: {
                address1: '',
                address2: '',
                city: '',
                country: 'Canada',
                postalCode: '',
                province: 'British Columbia'
              },
              phoneNumber1: '',
              phoneNumber2: '',
              phoneNumber3: '',
              faxNumber: '',
              email: '',
              website: '',
              hoursOfOperation: null
            };
          }
          this.loadPreviousAppts(patient);
        });
      }
    });
  }

  loadPreviousAppts(patient: Patient) {
    this.patientService.previousVisits = [];
    this.visitService.getAllVisitsByPatientId(patient.patientId).subscribe(visits => {
      visits.forEach(visit => {
        const vis: Visit = {
          visitId: visit.visitId,
          visitIdString: visit.visitIdString,
          patientId: visit.patientId,
          patient: visit.patient,
          visitNotes: visit.visitNotes,
          patientNotes: visit.patientNotes,
          cancellationReason: visit.cancellationReason,
          isCancellationAlert: visit.isCancellationAlert,
          cancellationDate: visit.cancellationDate,
          cancelled: visit.cancelled,
          appointments: visit.appointments,
          totalVisitCost: visit.totalVisitCost,
          checkedIn: visit.checkedIn,
          confirmed: visit.confirmed,
          noShow: visit.noShow,
          date: visit.date,
          createdBy: visit.createdBy
        };
        this.patientService.previousVisits.push(vis);
      });
      this.patientService.attendedAppts = 0;
      this.patientService.noShowAppts = 0;
      this.patientService.totalAppts = 0;
      this.patientService.previousVisits.forEach(v => {
        v.appointments.forEach(a => {
          if (a.cancellationReason.toLowerCase() === 'no-show' || a.cancellationReason.toLowerCase() === 'no show' ||
          a.cancellationReason.toLowerCase() === 'noshow') {
            this.patientService.noShowAppts += 1;
          }
          this.patientService.totalAppts += 1;
        });
      });
      this.patientService.attendedAppts = this.patientService.totalAppts - this.patientService.noShowAppts;
      if (this.patientService.totalAppts !== 0) {
        this.patientService.attendedPercentage = ((this.patientService.attendedAppts / this.patientService.totalAppts) * 100).toFixed(0);
        this.patientService.noShowPercentage = ((this.patientService.noShowAppts / this.patientService.totalAppts) * 100).toFixed(0);
        this.patientService.hasPreviousVisits = true;
      } else {
        this.patientService.attendedPercentage = '0';
        this.patientService.noShowPercentage = '0';
        this.patientService.hasPreviousVisits = false;
      }
      this.thePatient = patient;
      this.patientService.thePatientHasBeenUpdated(patient);
    });
  }
}
