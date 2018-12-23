import { Address } from './address';
import { HoursOfOperation } from './hoursofoperation';

export class Pharmacy {
    pharmacyId: number;
    name: string;
    address?: Address;
    phoneNumber1?: string;
    phoneNumber2?: string;
    phoneNumber3?: string;
    faxNumber?: string;
    email?: string;
    website?: string;
    hoursOfOperation?: HoursOfOperation;
}
