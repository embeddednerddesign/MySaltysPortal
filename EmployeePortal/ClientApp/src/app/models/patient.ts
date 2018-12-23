import { Address } from './address';
import { Doctor } from './doctor';
import { Pharmacy } from './pharmacy';

export class Patient {
    patientId: number;
    clientId: number;
    firstName: string;
    lastName: string;
    nickName?: string;
    birthDate: string;
    gender?: string;
    address?: Address;
    addressId?: number;
    email?: string;
    homeNumber: string;
    mobileNumber: string;
    familyPhysician?: Doctor;
    doctorId?: number;
    preferredPharmacy?: Pharmacy;
    pharmacyId?: number;
    communicationPreference: string;
    sendAppointmentNotifications: boolean;
    sendRetentionEmails: boolean;
    isPreferred?: boolean;
    socialHistory?: PatientSocialHistoryEntry[];
    notesAndAlerts: string;
}

export class PatientSocialHistoryEntry {
  patientSocialHistoryEntryId: number;
  entryDate: Date;
  enteredBy: string;
  entryText: string;
}
