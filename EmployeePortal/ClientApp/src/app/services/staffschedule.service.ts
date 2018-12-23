import { Injectable } from '@angular/core';
import { StaffSchedule } from '../models/scheduler/event';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class StaffScheduleService {

  constructor(private http: HttpClient) { }

  addStaffSchedule(staffSchedule: StaffSchedule) {
    return this.http.post<StaffSchedule>(environment.baseUrl + 'api/StaffSchedules', staffSchedule);
  }

  getStaffSchedules() {
    return this.http.get<StaffSchedule[]>(environment.baseUrl + 'api/StaffSchedules');

  }

  getStaffScheduleById(staffScheduleId) {
    return this.http.get<StaffSchedule>(environment.baseUrl + 'api/StaffSchedules/' + staffScheduleId);
  }

  updateStaffSchedule(sched: StaffSchedule) {
    return this.http.put<void>(environment.baseUrl + 'api/StaffSchedules/' + sched.staffScheduleId, sched);
  }

}
