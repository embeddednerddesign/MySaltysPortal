import { Address } from './address';
import { Room } from './room';
import { Tax } from './tax';
import { ServiceCategory } from './service-category';

export interface Clinic {
  clinicId: number;
  name: string;
  address?: Address;
  addressId?: number;
  clinicTaxes?: ClinicTax[];
  clinicRooms?: ClinicRoom[];
  companyId?: number;
}

export interface ClinicTax {
  clinicId: number;
  clinic: Clinic;
  taxId: number;
  tax: Tax;
}

export interface ClinicRoom {
  clinicId: number;
  clinic: Clinic;
  roomId: number;
  room: Room;
}
