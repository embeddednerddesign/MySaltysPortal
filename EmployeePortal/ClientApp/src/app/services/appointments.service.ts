import { Injectable } from '@angular/core';
import { Event, DbAppointment } from '../models/scheduler/event';
import { Appointment } from '../models/scheduler/event';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { debug } from 'util';

@Injectable()
export class AppointmentService {

  constructor(private http: HttpClient) { }

  addAppointment(appointment: DbAppointment) {
    return this.http.post<Appointment>(environment.baseUrl + 'api/Appointments', appointment);
  }

  updateAppointment(appointment: DbAppointment) {
    return this.http.put<Appointment>(environment.baseUrl + 'api/Appointments/' + appointment.appointmentId, appointment);
  }

  removeAppointment(appointment) {
    return this.http.delete(environment.baseUrl + 'api/Appointments/' + appointment.appointmentId);
  }

  getAppointmentById(appointmentId) {
    return this.http.get<DbAppointment>(environment.baseUrl + 'api/Appointment/' + appointmentId);
  }

  getAppointmentsByVisitId(visitId) {
    return this.http.get<DbAppointment[]>(environment.baseUrl + 'api/Appointments/' + visitId);
  }

  getAppointments() {
    return this.http.get<DbAppointment[]>(environment.baseUrl + 'api/Appointments');
  }

  getAppointmentsByDate(startDate: Date, endDate: Date) {
    return this.http.get<DbAppointment[]>(environment.baseUrl + 'api/Appointments?startDate=' + startDate.toISOString() + '&endDate=' + endDate.toISOString());
  }
}
