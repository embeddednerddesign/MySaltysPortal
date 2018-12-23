import * as moment from 'moment';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Patient, PatientSocialHistoryEntry } from '../../../models/patient';
import { Subject } from 'rxjs/Subject';
import { Address } from '../../../models/address';
import { ValidationService } from '../../../services/validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { MasterOverlayService } from '../../../services/actionpanel.service';
import { VisitService } from '../../../services/visit.service';
import { Visit } from '../../../models/visit';
import { PharmaciesService } from '../../../services/pharmacies.service';
import { Pharmacy } from '../../../models/pharmacy';
import { Doctor } from '../../../models/doctor';
import { DoctorsService } from './../../../services/doctors.service';
import { FormatterService } from '../../../services/formatter.service';
import { isNullOrUndefined } from 'util';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-patient-profile-tab',
  templateUrl: './patient-profile-tab.component.html',
  styleUrls: ['./patient-profile-tab.component.less']
})
export class PatientProfileTabComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('socialHistoryEntry') socialHistoryEntry;
  get thePatient(): Patient {
    return this.patientService.patientPanelPatient;
  }
  set thePatient(value: Patient) {
    this.patientService.patientPanelPatient = value;
    this.patientService.thePatientHasBeenUpdated(value);
  }

  patientIdParam = '0';
  patientPanelVisible = false;
  addOrEdit = 'Add';
  loading = false;
  disableGrid = false;
  showNewSocialHistoryField = false;

  // boolean choices
  boolChoices: string[] = [
    'Yes',
    'No'
  ];

  // communication preference strings
  communicationPreferences: string[] = [
    'Email',
    'Phone',
    'Text',
    'None'
  ]

  clientId: FormControl;
  firstName: FormControl;
  lastName: FormControl;
  nickname: FormControl;
  birthDate: FormControl;
  gender: FormControl;
  addressAddress1: FormControl;
  addressAddress2: FormControl;
  addressCity: FormControl;
  addressCountry: FormControl;
  addressPostalCode: FormControl;
  addressProvince: FormControl;
  homeNumber: FormControl;
  mobileNumber: FormControl;
  email: FormControl;
  isPreferred: FormControl;
  isNew: boolean;

  selectedPatient: Patient;
  editedPatient: Patient;
  selectedAddress: Address;
  editedAddress: Address;

  patientInfoEditable = false;

  minNumberOfPreviousVisitsShown = 3;
  countriesOfTheWorld: string[] = [];
  provincesAndStates: string[] = [];
  previousVisits: Visit[];
  attendedAppts: number;
  noShowAppts: number;
  totalAppts: number;
  attendedPercentage: string;
  noShowPercentage: string;
  hasPreviousVisits = false;
  showAllPreviousVisits = false;
  numberOfPreviousVisits = this.minNumberOfPreviousVisitsShown;

  editIsEnabled = false;
  thePharmacies: Pharmacy[];
  theDoctors: Doctor[];
  theSocialHistory: PatientSocialHistoryEntry[];

  submitButtonDisabledState = false;

  unsub: Subject<void> = new Subject<void>();

constructor(private validationService: ValidationService,
            public patientService: PatientService,
            private userService: UsersService,
            private visitService: VisitService,
            public formatterService: FormatterService,
            private pharmaciesService: PharmaciesService,
            private doctorsService: DoctorsService,
            private masterOverlayService: MasterOverlayService,
            private route: ActivatedRoute,
            private router: Router
          ) {
    this.clientId = new FormControl('', [Validators.maxLength(10)]);
    this.firstName = new FormControl();
    this.lastName = new FormControl();
    this.nickname = new FormControl();
    this.birthDate = new FormControl('', this.validationService.validateDate);
    this.gender = new FormControl();
    this.addressAddress1 = new FormControl();
    this.addressAddress2 = new FormControl();
    this.addressCity = new FormControl();
    this.addressCountry = new FormControl();
    this.addressPostalCode = new FormControl('', null);
    this.addressProvince = new FormControl();
    this.homeNumber = new FormControl('', this.validationService.validatePhoneNumber);
    this.mobileNumber = new FormControl('', this.validationService.validatePhoneNumber);
    this.email = new FormControl('', [Validators.email]);
    this.isPreferred = new FormControl();
}

  ngOnInit() {
    // load the previous visits
    this.patientService.thePatientUpdated$.takeUntil(this.unsub).subscribe(patient => {
      this.theSocialHistory = this.thePatient.socialHistory;
      this.theSocialHistory.sort((n1, n2) => {
        if (moment(n1.entryDate) < moment(n2.entryDate)) {
        return 1;
        }
        if (moment(n1.entryDate) > moment(n2.entryDate)) {
            return -1;
        }
        return 0;
      });
      this.thePharmacies = [];
      this.pharmaciesService.getPharmacies().subscribe(pharms => {
        pharms.forEach(ph => {
          const pharm: Pharmacy = {
            pharmacyId: ph.pharmacyId,
            name: ph.name,
            address: ph.address,
            phoneNumber1: ph.phoneNumber1,
            phoneNumber2: ph.phoneNumber2,
            phoneNumber3: ph.phoneNumber3,
            faxNumber: ph.faxNumber,
            email: ph.email,
            website: ph.website,
            hoursOfOperation: ph.hoursOfOperation
          };
          this.thePharmacies.push(pharm);
        });
      });

      this.theDoctors = [];
      this.doctorsService.getDoctors().subscribe(docs => {
        docs.forEach(d => {
          const doc: Doctor = {
            doctorId: d.doctorId,
            proTitle: d.proTitle,
            firstName: d.firstName,
            lastName: d.lastName,
            address: d.address,
            phoneNumber: d.phoneNumber,
            faxNumber: d.faxNumber,
            email: d.email,
            website: d.website,
            hoursOfOperation: d.hoursOfOperation,
            specialty: d.specialty
          };
          this.theDoctors.push(doc);
        });
      });
    });
    if (this.thePatient.patientId !== 0) {
      this.patientService.thePatientHasBeenUpdated(this.thePatient);
    }
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  getBirthday() {
    if (this.thePatient.birthDate !== '') {
      return moment(this.thePatient.birthDate).format('MMMM Do YYYY');
    }
    else {
      return 'N/A';
    }
  }

  getFormattedBirthDate() {
    return moment(this.thePatient.birthDate).toDate();
  }

  getAge() {
    if (this.thePatient.birthDate !== '') {
      const today = new Date();
      const birthDate = new Date(this.thePatient.birthDate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age.toString();
    }
    else {
      return 'N/A';
    }
  }

  getGender() {
    if (this.thePatient.gender === 'Female' || this.thePatient.gender === 'F') {
      return 'F';
    } else if (this.thePatient.gender === 'Male' || this.thePatient.gender === 'M') {
      return 'M';
    } else {
      return 'U';
    }
  }

  getTotalVisitCost(visit: Visit) {
    let totalCost: number = 0;
    visit.appointments.forEach(a => {
      totalCost += a.service.defaultPrice;
    });
    return totalCost.toFixed(2);
  }

  formatVisitDate(apptStart: string) {
    return moment(apptStart).format('dddd, MMMM Do YYYY');
  }

  formatSocialDate(apptStart: string) {
    return moment(apptStart).format('MM/DD/YYYY');
  }

  formatApptTime(apptStart: string) {
    return moment(apptStart).format('hh:mm a');
  }

  getPrevApptBGColor() {
    if (Number(this.patientService.attendedPercentage) > 80) {
      return '#b1d100';
    }
    else if (Number(this.patientService.attendedPercentage) > 60) {
      return '#9b005d';
    }
    else {
      return '#b0b0b0';
    }
  }

  updateState() {
    this.patientService.updatePatient(this.thePatient).subscribe(() => {
    });
  }

  getLastAppointment(appointments) {
    const lastAppointmentDate = new Date(
      Math.max.apply(
        null,
        appointments.map(function(appointment) {
          return new Date(appointment.start);
        })
      )
    );
    const xx = appointments.find(appointment => {
      return new Date(appointment.start).getUTCDate() === lastAppointmentDate.getUTCDate();
    });
    return xx;
  }

  toggleFullHistory() {
    this.showAllPreviousVisits = !this.showAllPreviousVisits;
    if (this.showAllPreviousVisits) {
      this.numberOfPreviousVisits = this.patientService.previousVisits.length;
    }
    else {
      this.numberOfPreviousVisits = this.minNumberOfPreviousVisitsShown;
    }
  }

  editPatientInfo() {
    this.editIsEnabled = !this.editIsEnabled;
  }

  savePatientInfo() {
    this.patientService.updatePatient(this.thePatient).subscribe(() => {
      this.editIsEnabled = !this.editIsEnabled;
    });
  }

  addSocialHistoryElement() {
    this.showNewSocialHistoryField = true;
  }

  saveSocialHistoryElement() {
    if (isNullOrUndefined(this.thePatient.socialHistory)) {
      this.thePatient.socialHistory = [];
    }

    const newSocial: PatientSocialHistoryEntry = {
      patientSocialHistoryEntryId: 0,
      entryDate: new Date(),
      enteredBy: this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName,
      entryText: this.socialHistoryEntry.nativeElement.value
    };
    this.thePatient.socialHistory.push(newSocial);
    this.patientService.updatePatient(this.thePatient).subscribe(() => {
      this.patientService.getPatientById(this.thePatient.patientId).subscribe(pat => {
        this.thePatient = pat;
      });
    });
    this.showNewSocialHistoryField = false;
  }

  cancelSocialHistoryElement() {
    this.showNewSocialHistoryField = false;
  }

  bookAppointment() {
    this.patientService.previousPage = this.router.url;
    this.masterOverlayService.masterOverlayState(false);
    this.router.navigate(['schedule', { outlets: { 'action-panel': ['create-visit'] } }]);
  }

  hexToTranslucentRgbA(hex): string {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        // tslint:disable-next-line:no-bitwise
        const rgba = 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ', 0.1)';
        return rgba;
    } else if (hex === 'red') {
      return this.hexToTranslucentRgbA('#FF3F3F');
    } else if (hex === 'blue') {
      return this.hexToTranslucentRgbA('#3F3FFF');
    } else if (hex === 'green') {
      return this.hexToTranslucentRgbA('#3F9F3F');
    } else {
      return 'rgba(0,0,0,0)';
    }
  }
}
