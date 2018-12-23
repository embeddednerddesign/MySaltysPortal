import { Clinic } from './clinic';
import { Address } from './address';
import { HoursOfOperation } from './hoursofoperation';

export interface Company {
  companyId: number;
  name: string;
  address?: Address;
  clinics?: Clinic[];
  contactName?: string;
  contactPhone?: string;
  primaryBrandingColour?: string;
  accentBrandingColour?: string;
  minimumDuration: number;
  hoursOfOperation?: HoursOfOperation;
  timezone: string;
}
