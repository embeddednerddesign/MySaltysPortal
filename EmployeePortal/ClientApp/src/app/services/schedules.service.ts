import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HomeContent } from '../models/home-content';
import { Company } from '../models/company';

@Injectable()
export class SchedulesService {

  contentSelected = false;

  constructor(private http: HttpClient) { }

  uploadSchedule(formData: FormData) {
    return this.http.post<void>(environment.baseUrl + 'api/Companies/Schedule', formData);
  }

}
