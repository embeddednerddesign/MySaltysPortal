import { Injectable } from '@angular/core';
import { Event } from '../models/scheduler/event';
import { Visit } from '../models/visit';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

@Injectable()
export class VisitService {

  private visitCreated = new Subject<any>();

  constructor(private http: HttpClient) { }

  addVisit(visit: Visit) {
    visit.totalVisitCost = 0;
    visit.appointments.forEach(a => {
      visit.totalVisitCost += a.service.defaultPrice;
    });
    return this.http.post<Visit>(environment.baseUrl + 'api/Visits', visit);
  }

  updateVisit(visit: Visit) {
    return this.http.put<void>(environment.baseUrl + 'api/Visits/' + visit.visitId, visit);
  }

  removeVisit(visit) {
    return this.http.delete(environment.baseUrl + 'api/Visits/' + visit.visitId);
  }

  getVisitById(visitId) {
    return this.http.get<Visit>(environment.baseUrl + 'api/Visits/' + visitId);
  }

  getVisits() {
    return this.http.get<Visit[]>(environment.baseUrl + 'api/Visits');
  }

  getVisitsByDate(date: string) {
    return this.http.get<Visit[]>(environment.baseUrl + 'api/Visits/GetByDate/' + date);
  }

  getVisitByEvent(eventId) {
    return this.http.get<Visit>(environment.baseUrl + 'api/Visits/VisitByName/' + eventId);
  }

  getAllVisitsByPatientId(patientId) {
    return this.http.get<Visit[]>(environment.baseUrl + 'api/Visits/Patient/' + Number(patientId));
  }

  visitCreatedEmitter() {
    this.visitCreated.next();
  }
  visitCreatedObservable() {
    return this.visitCreated.asObservable();
  }
}
