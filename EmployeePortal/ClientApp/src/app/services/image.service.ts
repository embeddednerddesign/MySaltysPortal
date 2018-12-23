import { Injectable } from '@angular/core';
import { Patient } from '../models/patient';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable()
export class ImageService {

  constructor(private http: HttpClient) { }

  uploadPatientPhoto(formData: FormData) {
    return this.http.post<string>(environment.baseUrl + 'api/Patients/Photo', formData);
  }

  uploadUserAvatar(formData: FormData) {
    return this.http.post<User>(environment.baseUrl + 'api/Users/Avatar', formData);
  }

  getListOfPatientPhotos() {
    return this.http.get<string[]>(environment.baseUrl + 'api/Patients/ListPhotos');
  }
}
