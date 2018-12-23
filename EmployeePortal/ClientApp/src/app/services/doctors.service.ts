import { Injectable } from '@angular/core';
import { Doctor } from '../models/doctor';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class DoctorsService {

  constructor(private http: HttpClient) { }

  addDoctor(doctor: Doctor) {
    return this.http.post<Doctor>(environment.baseUrl + 'api/Doctors', doctor);
  }

  updateDoctor(doctor: Doctor) {
    return this.http.put<void>(environment.baseUrl + 'api/Doctors/' + doctor.doctorId, doctor);
  }

  removeDoctor(doctor: Doctor) {
    return this.http.delete(environment.baseUrl + 'api/Doctors/' + doctor.doctorId);
  }

  getDoctors() {
    return this.http.get<Doctor[]>(environment.baseUrl + 'api/Doctors');
  }

  getDoctorById(doctorId) {
    return this.http.get<Doctor>(environment.baseUrl + 'api/Doctors/' + doctorId);
  }
}
