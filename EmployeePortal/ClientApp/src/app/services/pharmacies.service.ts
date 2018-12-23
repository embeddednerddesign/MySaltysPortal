import { Injectable } from '@angular/core';
import { Pharmacy } from '../models/pharmacy';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class PharmaciesService {

  constructor(private http: HttpClient) { }

  addPharmacy(pharmacy: Pharmacy) {
    return this.http.post<Pharmacy>(environment.baseUrl + 'api/Pharmacies', pharmacy);
  }

  updatePharmacy(pharmacy: Pharmacy) {
    return this.http.put<void>(environment.baseUrl + 'api/Pharmacies' + pharmacy.pharmacyId, pharmacy);
  }

  removePharmacy(pharmacy: Pharmacy) {
    return this.http.delete(environment.baseUrl + 'api/Pharmacies/' + pharmacy.pharmacyId);
  }

  getPharmacies() {
    return this.http.get<Pharmacy[]>(environment.baseUrl + 'api/Pharmacies');
  }

  getPharmacyById(pharmacyId) {
    return this.http.get<Pharmacy>(environment.baseUrl + 'api/Pharmacies/' + pharmacyId);
  }
}
