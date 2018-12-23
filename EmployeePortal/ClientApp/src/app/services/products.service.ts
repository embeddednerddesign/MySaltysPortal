import { Injectable } from '@angular/core';
import { ProductCategory } from '../models/product-category';
import { Product, ProductDotNet } from '../models/product';
import { Service, ServiceDotNet } from '../models/service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Tax } from '../models/tax';

@Injectable()
export class ProductsService {
  constructor(private http: HttpClient) {}

  dotNetProduct: ProductDotNet;

  addProduct(product: Product) {
    this.productToDotNetProduct(product);
    return this.http.post<Product>(environment.baseUrl + 'api/Products', this.dotNetProduct);
  }

  updateProduct(product: Product) {
    this.productToDotNetProduct(product);
    return this.http.put<void>(environment.baseUrl + 'api/Products/' + product.productId, product);
  }

  removeProduct(product: Product) {
    this.productToDotNetProduct(product);
    return this.http.delete(environment.baseUrl + 'api/Products/' + product.productId);
  }

  getProducts() {
    return this.http.get<Product[]>(environment.baseUrl + 'api/Products');
  }

  getProductById(productId) {
    return this.http.get<Product>(environment.baseUrl + 'api/Products/' + productId);
  }

  getProductByCategory(categoryId) {
    return this.http.get<Product[]>(environment.baseUrl + 'api/Products/Category/' + categoryId);
  }

  getProductsByCompany(companyId) {
    return this.http.get<Product[]>(environment.baseUrl + 'api/Products/Company/' + companyId);
  }

  getProductsByClinic(clinicId) {
    return this.http.get<Product[]>(environment.baseUrl + 'api/Products/Clinic/' + clinicId);
  }

  addProductCategory(productCategory: ProductCategory) {
    return this.http.post<ProductCategory>(environment.baseUrl + 'api/ProductCategories', productCategory);
  }

  updateProductCategory(productCategory: ProductCategory) {
    return this.http.put<void>(environment.baseUrl + 'api/ProductCategories/' + productCategory.productCategoryId, productCategory);
  }

  removeProductCategory(productCategory: ProductCategory) {
    return this.deleteProductCategory(productCategory.productCategoryId);
  }

  deleteProductCategory(id: number) {
    return this.http.delete(`${environment.baseUrl}api/ProductCategories/${id}`);
  }

  getProductCategories() {
    return this.http.get<ProductCategory[]>(environment.baseUrl + 'api/ProductCategories');
  }

  getProductCategoryById(productCategoryId) {
    return this.http.get<ProductCategory>(environment.baseUrl + 'api/ProductCategories/' + productCategoryId);
  }

  getProductsByVisit(visitId: number) {
    return this.http.get<any>(environment.baseUrl + 'api/VisitProducts/GetByVisitId/' + visitId);
  }

  addProductToVisit(visitId, productId, quantity) {
    const visitProduct = {visitId: visitId, productId: productId, quantity: quantity};
    return this.http.post<any>(environment.baseUrl + 'api/VisitProducts/', visitProduct);
  }

  updateVisitProduct(visitId, productId, quantity) {
    const visitProduct = {visitId: visitId, productId: productId, quantity: quantity};
    return this.http.put<Product>(environment.baseUrl + 'api/VisitProducts/', visitProduct);
  }

  removeProductFromVisit(visitId, productId) {
    return this.http.delete<any>(`${environment.baseUrl}api/VisitProducts/${visitId}/${productId}`);
  }

  addRequiredProductToService(service: Service, product: Product, quantity: number) {
    service.recommendedProducts.push({
      productId: 0,
      product: product,
      productQuantity: quantity,
      serviceId: 0,
      service: service
    });
    return this.http.put<void>(environment.baseUrl + 'api/Services' + service.serviceId, service);
  }

  productToDotNetProduct(product: Product) {
    this.dotNetProduct = {
      productId: product.productId,
      name: product.name,
      productCode: product.productCode,
      quantityInStock: product.quantityInStock,
      retailPrice: product.retailPrice,
      wholesalePrice: product.wholesalePrice,
      productCategoryId: product.productCategoryId,
      productTaxes: product.productTaxes,
      quantity: product.quantity
    };
  }

  getListsForNewProduct() {
    return this.http.get<GetListsForNewProductDTO>(`${environment.baseUrl}api/Products/new`);
  }

  getProductForEdit(id) {
    return this.http.get<GetProductForEditDTO>(`${environment.baseUrl}api/Products/${id}/edit`);
  }
}

export interface GetListsForNewProductDTO {
  productCategories: ProductCategory[];
  taxes: Tax[];
}

export interface GetProductForEditDTO {
  product: Product;
  productCategories: ProductCategory[];
  taxes: Tax[];
}
