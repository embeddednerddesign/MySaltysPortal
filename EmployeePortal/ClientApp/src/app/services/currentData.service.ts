import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Company } from '../models/company';
import { CompanyService } from './company.service';

@Injectable()
export class CurrentDataService {

  private currentDataUpdated = new Subject<any>();
  currentDataUpdated$ = this.currentDataUpdated.asObservable();
  company: Company;

  constructor(private companyService: CompanyService) { }

  currentDataHasBeenUpdated(value) {
    this.currentDataUpdated.next(value);
  }

  fetchCurrentData() {
    this.refreshCurrentData().subscribe(responseList => {
      this.company = responseList[0];
      this.currentDataHasBeenUpdated(null);
    });
  }

  refreshCurrentData(): Observable<any[]> {
    const companyResponse = this.companyService.getCompanyById(1);
    return Observable.forkJoin([companyResponse]);
  }

}
