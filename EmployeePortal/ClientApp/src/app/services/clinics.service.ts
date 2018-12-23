import { Injectable } from '@angular/core';
import { Clinic } from '../models/clinic';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ClinicsService {

  constructor(private http: HttpClient) { }

  addClinic(clinic: Clinic) {
    return this.http.post<Clinic>(environment.baseUrl + 'api/Clinics', clinic);
  }

  getClinics() {
    return this.http.get<Clinic[]>(environment.baseUrl + 'api/Clinics');
  }

  getClinicById(clinicId) {
    return this.http.get<Clinic>(environment.baseUrl + 'api/Clinics/' + clinicId);
  }

  updateClinic(clinic: Clinic) {
    return this.http.put<void>(environment.baseUrl + 'api/Clinics/' + clinic.clinicId, clinic);
  }

  removeClinic(clinic: Clinic) {
    return this.http.delete(environment.baseUrl + 'api/Clinics/' + clinic.clinicId);
  }
}
