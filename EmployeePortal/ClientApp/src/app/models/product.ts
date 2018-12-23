import { ProductCategory } from './product-category';
import { Package } from './package';
import { Service } from './service';
import { Tax } from './tax';
import { Special } from './special';

export interface Product {
  productId: number;
  name: string;
  productCode: string;
  quantityInStock: number;
  retailPrice: number;
  wholesalePrice: number;
  quantity: number;
  usageDuration: number;
  productCategoryId: number;
  category: ProductCategory;
  productTaxes: ProductTax[];
}

export interface ProductDotNet {
  productId: number;
  name: string;
  productCode: string;
  quantityInStock: number;
  retailPrice: number;
  wholesalePrice: number;
  quantity: number;
  productCategoryId: number;
  productTaxes: ProductTax[];
}

export interface RequiredProduct {
  productId: number;
  product: Product;
  productQuantity: number;
  serviceId: number;
  service: Service;
}

export interface RecommendedProduct {
  productId: number;
  product: Product;
  productQuantity: number;
  serviceId: number;
  service: Service;
}

export interface PackageProduct {
  productId: number;
  product: Product;
  productQuantity: number;
  packageId: number;
  package: Package;
}

export interface SpecialProduct {
  productId: number;
  product: Product;
  productQuantity: number;
  specialId: number;
  special: Special;
}

export interface ProductTax {
  productId: number;
  product: Product;
  taxId: number;
  tax: Tax;
}
