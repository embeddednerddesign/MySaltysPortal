import * as moment from 'moment';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PatientService } from '../../../services/patient.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Patient } from '../../../models/patient';
import { Subject } from 'rxjs/Subject';
import { CatalogueUpdatesService } from '../../../services/catalogueupdates.service';
import { Address } from '../../../models/address';
import { ValidationService } from '../../../services/validation.service';
import { GeographyService } from '../../../services/geography.service';
import { MasterOverlayService } from '../../../services/actionpanel.service';
import { FormatterService } from '../../../services/formatter.service';
import { DoctorsService } from '../../../services/doctors.service';
import { PharmaciesService } from '../../../services/pharmacies.service';
import { Doctor } from '../../../models/doctor';
import { Pharmacy } from '../../../models/pharmacy';
import { isNullOrUndefined } from 'util';
import { VisitService } from './../../../services/visit.service';
import { Location } from '@angular/common';
import { Visit } from '../../../models/visit';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.less']
})
export class EditPatientComponent implements OnInit, AfterViewInit, OnDestroy {

  editPatientPanelVisible = false;
  addOrEdit = 'Add';

  // boolean choices
  boolChoices: string[] = [
    'Yes',
    'No'
  ]

  // communication preference strings
  communicationPreferences: string[] = [
    'Email',
    'Phone',
    'Text',
    'None'
  ]

  patientIdParam: string;
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
  familyPhysician: FormControl;
  preferredPharmacy: FormControl;
  communicationPreference: FormControl;
  sendAppointmentReminders: FormControl;
  sendRetentionEmails: FormControl;
  isPreferred: FormControl;
  isNew: boolean;

  selectedPatient: Patient;
  editedPatient: Patient;
  selectedAddress: Address;
  editedAddress: Address;
  theDoctors: Doctor[];
  thePharmacies: Pharmacy[];

  countriesOfTheWorld: string[] = [];
  provincesAndStates: string[] = [];

  submitButtonDisabledState: Boolean = false;

  unsub: Subject<void> = new Subject<void>();

  loading = false;

constructor(private patientService: PatientService,
    private doctorService: DoctorsService,
    private pharmaciesService: PharmaciesService,
    private visitService: VisitService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private validationService: ValidationService,
    public formatterService: FormatterService,
    private geographyService: GeographyService,
    private masterOverlayService: MasterOverlayService,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location) {
    this.clientId = new FormControl('', [Validators.maxLength(10), this.validationService.validateMSPNumber]);
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
    this.familyPhysician = new FormControl();
    this.preferredPharmacy = new FormControl();
    this.communicationPreference = new FormControl();
    this.sendAppointmentReminders = new FormControl();
    this.sendRetentionEmails = new FormControl();
    this.isPreferred = new FormControl();
}

  ngOnInit() {
    this.loading = true;
    for (let key in this.geographyService.countriesByName()) {
      this.countriesOfTheWorld.push(key);
    }
    this.theDoctors = [];
    this.thePharmacies = [];
    // load the list of doctors
    this.doctorService.getDoctors().subscribe(docs => {
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
      // now get all the pharmacies
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

        this.selectedPatient = this.initPatient(this.selectedPatient);
        this.editedPatient = this.initPatient(this.editedPatient);

        const patientCountry = 'Canada';
        const patientProvince = 'British Columbia';
        this.isNew = true;
        this.addOrEdit = 'Add';
        this.route.params.takeUntil(this.unsub).subscribe(params => {
          this.patientIdParam = params['patid'];
          if (this.patientIdParam !== '_' && this.patientIdParam != null) {
            this.patientService.getPatientById(this.patientIdParam).subscribe(snapshot => {
              const patient: Patient = snapshot as Patient;
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
              this.selectedPatient = patient;
              this.editedPatient = patient;
              this.updateProvincesStates();
              this.updateSubmitButtonState();
              this.isNew = false;
              this.addOrEdit = 'Edit';
            });
          } else {
            if (this.countriesOfTheWorld.includes(patientCountry)) {
              this.selectedPatient.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(patientCountry)];
              this.editedPatient.address.country = this.countriesOfTheWorld[this.countriesOfTheWorld.indexOf(patientCountry)];
            } else {
              this.selectedPatient.address.country = 'Canada';
              this.editedPatient.address.country = 'Canada';
            }
            this.updateProvincesStates();
            if (this.provincesAndStates.includes(patientProvince)) {
              this.selectedPatient.address.province = this.provincesAndStates[this.provincesAndStates.indexOf(patientProvince)];
              this.editedPatient.address.province = this.provincesAndStates[this.provincesAndStates.indexOf(patientProvince)];
            } else {
              this.selectedPatient.address.province = 'British Columbia';
              this.editedPatient.address.province = 'British Columbia';
            }
          }
        });
        this.loading = false;
      });
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  getFormattedBirthDate() {
    return moment(this.editedPatient.birthDate).toDate();
  }

  onChangeCountry() {
    this.updateProvincesStates();
    this.addressPostalCode.setValue('');
  }

  updateProvincesStates() {
    this.provincesAndStates = this.geographyService.updateProvinceStateList(this.editedPatient.address.country);
    if (this.editedPatient.address.country.toLowerCase() === 'canada') {
      this.addressPostalCode.validator = this.validationService.validatePostalCode;
    }
    else if (this.editedPatient.address.country.toLowerCase() === 'united states') {
      this.addressPostalCode.validator = this.validationService.validateZipCode;
    }
    else {
      this.addressPostalCode.validator = null;
    }
  }

  updateSubmitButtonState() {
    if ((this.email.value !== '' && this.email.hasError('email')) ||
        (this.homeNumber.hasError('phoneError')) ||
        (this.mobileNumber.hasError('phoneError')) ||
        (this.birthDate.hasError('dateError')) ||
        (this.addressPostalCode.hasError('postalCodeError')) ||
        (this.addressPostalCode.hasError('zipCodeError'))) {
      this.submitButtonDisabledState = true;
    }
    else {
      this.submitButtonDisabledState = false;
    }
  }

  updatePatient() {
    if (this.isNew) {
      this.patientService.addPatient(this.editedPatient).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.masterOverlayService.masterOverlayState(false);
        const baseURL = this.router.url.split('/(action')[0];
        this.router.navigate([baseURL, { outlets: { 'action-panel': null } }]);
      });
    }
    else {
      this.patientService.updatePatient(this.editedPatient).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.masterOverlayService.masterOverlayState(false);
        if (this.router.url.includes('patienttabs')) {
          this.patientService.patientPanelPatient = this.editedPatient;
        }
        const baseURL = this.router.url.split('/(action')[0];
        this.router.navigate([baseURL, { outlets: { 'action-panel': null } }]);
      });
    }
  }

  cancelUpdate() {
    this.catalogueUpdatesService.refreshRequired = false;
    this.catalogueUpdatesService.catalogueUpdateComplete();
    this.masterOverlayService.masterOverlayState(false);
    const returnURL = this.router.url.slice(0, this.router.url.indexOf('('));
    this.router.navigate([returnURL, { outlets: {'action-panel': null}}]);
}

  initPatient(patient: Patient) {
    patient = {
      patientId: 0,
      clientId: null,
      firstName: '',
      lastName: '',
      nickName: '',
      birthDate: '',
      gender: '',
      address: {
        address1: '',
        address2: '',
        city: '',
        country: 'Canada',
        postalCode: '',
        province: 'British Columbia'
      },
      email: '',
      homeNumber: '',
      mobileNumber: '',
      familyPhysician: {
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
      },
      preferredPharmacy: {
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
      },
      communicationPreference: '',
      sendAppointmentNotifications: true,
      sendRetentionEmails: false,
      isPreferred: false,
      socialHistory: [],
      notesAndAlerts: '',
      services: []
      };
    return patient;
  }
}
