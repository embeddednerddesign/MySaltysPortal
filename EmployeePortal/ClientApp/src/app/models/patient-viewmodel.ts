import { Address } from './address';
import { Doctor } from './doctor';
import { Pharmacy } from './pharmacy';
import { PatientSocialHistoryEntry } from './patient';

export class PatientViewModel {
    patientId: number;
    clientId: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    homeNumber: string;
    mobileNumber: string;
    nickName?: string;
    gender?: string;
    address?: Address;
    addressId?: number;
    email?: string;
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
