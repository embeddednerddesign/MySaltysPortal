import { Address } from './address';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    role: string;
    phoneNumber: string;
    email: string;
    address: Address;
}
