import { Injectable } from '@angular/core';
import { Lab } from '../models/lab';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class LabsService {

  constructor(private http: HttpClient) { }

  addLab(lab: Lab) {
    return this.http.post<Lab>(environment.baseUrl + 'api/Labs', lab);
  }
  updateLab(lab: Lab) {
    return this.http.put<void>(environment.baseUrl + 'api/Labs/' + lab.labId, lab);
  }
  removeLab(lab: Lab) {
    return this.http.delete(environment.baseUrl + 'api/Labs/' + lab.labId);
  }
  saveLab(lab: Lab, isNew: boolean) {
    if (isNew) {
      return this.addLab(lab);
    } else {
      return this.updateLab(lab);
    }
  }
  getLabs() {
    return this.http.get<Lab[]>(environment.baseUrl + 'api/Labs');
  }
  getLabById(labId) {
    return this.http.get<Lab>(environment.baseUrl + 'api/Labs/' + labId);
  }
}
