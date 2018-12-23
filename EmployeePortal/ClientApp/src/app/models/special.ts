import { Product, SpecialProduct } from './product';
import { Service } from './service';
import { Tax } from './tax';

export interface Special {
  specialId: number;
  name: string;
  code: number;
  totalOfIndividualPrices: string;
  retailPrice: number;
  products: SpecialProduct[];
  services: Service[];
  specialTaxes: SpecialTax[];
}

export interface SpecialTax {
  specialId: number;
  special: Special;
  taxId: number;
  tax: Tax;
}
