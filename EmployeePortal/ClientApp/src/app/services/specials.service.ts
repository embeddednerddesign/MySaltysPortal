import { Injectable } from '@angular/core';
import { Special } from '../models/special';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';
import { Service } from '../models/service';
import { Tax } from '../models/tax';

@Injectable()
export class SpecialsService {
  constructor(private http: HttpClient) {}

  addSpecial(special: Special) {
    return this.http.post<Special>(environment.baseUrl + 'api/Specials', special);
  }

  updateSpecial(special: Special) {
    return this.http.put<void>(environment.baseUrl + 'api/Specials/' + special.specialId, special);
  }

  removeSpecial(special: Special) {
    return this.http.delete(environment.baseUrl + 'api/Specials/' + special.specialId);
  }

  saveSpecial(special: Special, isNew: boolean) {
    if (isNew) {
      return this.addSpecial(special);
    } else {
      return this.updateSpecial(special);
    }
  }

  getSpecials() {
    return this.http.get<Special[]>(environment.baseUrl + 'api/Specials');
  }

  getSpecialById(specialId) {
    return this.http.get<Special>(environment.baseUrl + 'api/Specials/' + specialId);
  }

  getListsForNewSpecial() {
    return this.http.get<GetListsForNewSpecialDTO>(`${environment.baseUrl}api/Specials/new`);
  }

  getSpecialForEdit(id) {
    return this.http.get<GetSpecialForEditDTO>(`${environment.baseUrl}api/Specials/${id}/edit`);
  }
}

export interface GetListsForNewSpecialDTO {
  products: Product[];
  services: Service[];
  taxes: Tax[];
}

export interface GetSpecialForEditDTO {
  special: Special;
  products: Product[];
  services: Service[];
  taxes: Tax[];
}
