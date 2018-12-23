import { Injectable } from '@angular/core';
import { Package } from '../models/package';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Product } from '../models/product';
import { Service } from '../models/service';
import { Tax } from '../models/tax';

@Injectable()
export class PackagesService {
  constructor(private http: HttpClient) {}

  addPackage(thepackage: Package) {
    return this.http.post<Package>(environment.baseUrl + 'api/Packages', thepackage);
  }

  updatePackage(thepackage: Package) {
    return this.http.put<void>(environment.baseUrl + 'api/Packages/' + thepackage.packageId, thepackage);
  }

  removePackage(thepackage: Package) {
    return this.http.delete(environment.baseUrl + 'api/Packages/' + thepackage.packageId);
  }

  getPackages() {
    return this.http.get<Package[]>(environment.baseUrl + 'api/Packages');
  }

  getPackageById(packageId) {
    return this.http.get<Package>(environment.baseUrl + 'api/Packages/' + packageId);
  }

  getListsForNew() {
    return this.http.get<GetListsForNewDTO>(`${environment.baseUrl}api/Packages/new`);
  }

  getPackageForEdit(id) {
    return this.http.get<GetPackageForEditDTO>(`${environment.baseUrl}api/Packages/${id}/edit`);
  }
}

export interface GetListsForNewDTO {
  products: Product[];
  services: Service[];
  taxes: Tax[];
}

export interface GetPackageForEditDTO {
  package: Package;
  products: Product[];
  services: Service[];
  taxes: Tax[];
}
