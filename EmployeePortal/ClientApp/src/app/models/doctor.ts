import { Address } from './address';
import { HoursOfOperation } from './hoursofoperation';

export class Doctor {
    doctorId: number;
    proTitle: string;
    firstName: string;
    lastName: string;
    address?: Address;
    phoneNumber?: string;
    faxNumber?: string;
    email?: string;
    website?: string;
    hoursOfOperation?: HoursOfOperation;
    specialty?: string;
}
