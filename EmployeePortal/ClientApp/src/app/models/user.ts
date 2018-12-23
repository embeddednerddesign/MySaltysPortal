import { Address } from './address';
import { Clinic } from './clinic';
import { UserCategory } from './user-category';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    // password: string;
    phoneNumber: string;
    email: string;
    // addressId: number;
    address: Address;
    clinics: Clinic[];
    // roles: Role[];
    // groups: Group[];
    userCategoryId: number;
    userCategory: UserCategory;
    serviceProvider: boolean;
    canSetBreaks: boolean;
}
