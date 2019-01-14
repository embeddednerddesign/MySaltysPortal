import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Address } from '../models/address';
import { environment } from '../../environments/environment';

@Injectable()
export class AddressService {

    constructor(private http: HttpClient) { }

    addAddress(address: Address) {
        return this.http.post<Address>(environment.baseUrl + 'api/Addresses', address);
    }

    updateAddress(address: Address) {
      const aId = (address as any).addressId;
      return this.http.put(environment.baseUrl + 'api/Addresses/' + aId, address);
    }

    removeAddress(address: Address) {
        return this.http.delete(environment.baseUrl + 'api/Addresses/' + address.id);
    }

    getAddresses() {
        return this.http.get<Address[]>(environment.baseUrl + 'api/Addresses');
    }

    getAddressById (addressId: number) {
        return this.http.get<Address>(environment.baseUrl + 'api/Addresses/' + addressId);
    }
}
