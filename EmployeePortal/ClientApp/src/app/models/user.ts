import { Address } from './address';
import { Clinic } from './clinic';
import { UserCategory } from './user-category';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    role: string;
    phoneNumber: string;
    // password: string;
    email: string;
    // addressId: number;
    address: Address;
}
