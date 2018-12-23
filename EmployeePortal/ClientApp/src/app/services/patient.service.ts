import { Injectable } from '@angular/core';
import { Patient } from '../models/patient';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Visit } from '../models/visit';

@Injectable()
export class PatientService {

  private thePatientUpdated = new Subject<any>();
  thePatientUpdated$ = this.thePatientUpdated.asObservable();

  editPatientSourceURL: string;
  previousVisits: Visit[] = [];
  attendedAppts: number;
  noShowAppts: number;
  totalAppts: number;
  attendedPercentage: string;
  noShowPercentage: string;
  hasPreviousVisits = false;
  previousPage = '';

  patientPanelPatient: Patient = {
    patientId: 0,
    clientId: 0,
    firstName: '',
    lastName: '',
    nickName: '',
    birthDate: '',
    gender: '',
    address: {
      address1: '',
      address2: '',
      city: '',
      province: 'British Columbia',
      country: 'Canada',
      postalCode: ''
    },
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
    sendAppointmentNotifications: false,
    sendRetentionEmails: false,
    isPreferred: false,
    socialHistory: [],
    notesAndAlerts: '',
    email: '',
    homeNumber: '',
    mobileNumber: ''
  };

  constructor(private http: HttpClient) { }

  thePatientHasBeenUpdated(value) {
    this.thePatientUpdated.next(value);
  }

  addPatient(patient: Patient) {
    return this.http.post<Patient>(environment.baseUrl + 'api/Patients', patient);
  }

  getAllPatients() {
    return this.http.get<Patient[]>(environment.baseUrl + 'api/Patients');
  }

  getPatientById(patientId) {
    return this.http.get<Patient>(environment.baseUrl + 'api/Patients/' + patientId);
  }

  updatePatient(patient: Patient) {
    return this.http.put<void>(environment.baseUrl + 'api/Patients/' + patient.patientId, patient);
  }

  removePatient(patient: Patient) {
    return this.http.delete(environment.baseUrl + 'api/Patients/' + patient.patientId);
  }
}
