import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Tax } from '../models/tax';

@Injectable()
export class TaxService {
  constructor(private http: HttpClient) {}

  getTaxes() {
    return this.http.get<Tax[]>(environment.baseUrl + 'api/taxes');
  }
}
