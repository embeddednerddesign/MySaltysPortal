import { Injectable } from '@angular/core';
import { Company } from '../models/company';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class CompanyService {

  constructor(private http: HttpClient) { }

  addCompany(company: Company) {
    return this.http.post<Company>(environment.baseUrl + 'api/Companies', company);
  }
  updateCompany(company: Company) {
    return this.http.put<void>(environment.baseUrl + 'api/Companies/' + company.companyId, company);
  }
  removeCompany(company: Company) {
    return this.http.delete(environment.baseUrl + 'api/Companies/' + company.companyId);
  }
  saveCompany(company: Company, isNew: boolean) {
    if (isNew) {
      return this.addCompany(company);
    } else {
      return this.updateCompany(company);
    }
  }

  getCompanies() {
    return this.http.get<Company[]>(environment.baseUrl + 'api/Companies');
  }

  getCompanyById(companyId) {
    return this.http.get<Company>(environment.baseUrl + 'api/Companies/' + companyId);
  }

}
