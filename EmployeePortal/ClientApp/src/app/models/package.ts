import { PackageProduct } from './product';
import { PackageService } from './service';
import { Tax } from './tax';

export interface Package {
  packageId: number;
  name: string;
  totalOfIndividualPrices: string;
  retailPrice: number;
  packageProducts: PackageProduct[];
  packageServices: PackageService[];
  packageTaxes: PackageTax[];
  packageProductsString: string;
}

export interface PackageTax {
  packageId: number;
  package: Package;
  taxId: number;
  tax: Tax;
}
