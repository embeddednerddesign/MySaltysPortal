import { Address } from './address';

export interface Company {
  companyId: number;
  name: string;
  address?: Address;
  contactName?: string;
  contactPhone?: string;
  timezone: string;
}
