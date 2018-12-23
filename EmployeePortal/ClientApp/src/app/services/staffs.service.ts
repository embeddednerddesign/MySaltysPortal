import { Injectable } from '@angular/core';
import { Staff } from '../models/staff';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class StaffsService {

  constructor(private http: HttpClient) { }

  getAllStaff() {
    return this.http.get<Staff[]>(environment.baseUrl + 'api/Staff');
  }

  getStaffById(staffId) {
    return this.http.get<Staff>(environment.baseUrl + 'api/Staff/' + staffId);
  }

  addStaff(staff: Staff) {
    return this.http.post<Staff>(environment.baseUrl + 'api/Staff', staff);
  }

  updateStaff(staff: Staff) {
    return this.http.put<void>(environment.baseUrl + 'api/Staff/' + staff.staffId, staff);
  }
}
