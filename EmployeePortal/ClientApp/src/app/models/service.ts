import { ServiceCategory } from './service-category';
import { Package } from './package';
import { Tax } from './tax';
import { RequiredProduct, RecommendedProduct } from './product';
import { Room } from './room';
import { Equipment } from './equipment';
import { UserCategory } from './user-category';
import { Special } from './special';

export interface Service {
  serviceId: number;
  serviceName: string;
  quantity: number;
  billingCode?: number;
  serviceAltName?: string;
  defaultDurationMinutes?: number;
  subType?: string;
  diagnosticCode?: number;
  serviceIDColour?: string;
  templateIcon?: string;
  serviceCategoryId: number;
  category: ServiceCategory;
  defaultPrice?: number;
  status?: boolean;
  attachedForms?: string[];
  serviceTaxes?: ServiceTax[];
  governmentBilling?: boolean;
  requiredProducts?: RequiredProduct[];
  recommendedProducts?: RecommendedProduct[];
  room?: Room[];
  equipment?: Equipment[];
  userCategories?: UserCategoryService[];
  serviceReqProductsString: string;
  serviceRecProductsString: string;
}

export interface ServiceDotNet {
  serviceId: number;
  serviceName: string;
  quantity: number;
  billingCode?: number;
  serviceAltName?: string;
  defaultDurationMinutes?: number;
  subType?: string;
  diagnosticCode?: number;
  serviceIDColour?: string;
  templateIcon?: string;
  serviceCategoryId: number;
  defaultPrice?: number;
  status?: boolean;
  attachedForms?: string[];
  serviceTaxes?: ServiceTax[];
  governmentBilling?: boolean;
  requiredProducts?: RequiredProduct[];
  recommendedProducts?: RecommendedProduct[];
  room?: Room[];
  equipment?: Equipment[];
  userCategories?: UserCategoryService[];
}

export interface PackageService {
  serviceId: number;
  service: Service;
  serviceQuantity: number;
  packageId: number;
  package: Package;
}

export interface UserCategoryService {
  serviceId: number;
  service: Service;
  userCategoryId: number;
  userCategory: UserCategory;
}

export interface ServiceTax {
  serviceId: number;
  service: Service;
  taxId: number;
  tax: Tax;
}
