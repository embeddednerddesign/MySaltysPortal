import { Tax } from './tax';

export interface ClinicProduct {
    id: number;
    clinicId: string;
    productId: string;
    quantityInStock: number;
    retailPrice: number;
    wholesalePrice: number;
    taxIds: string[];
}
