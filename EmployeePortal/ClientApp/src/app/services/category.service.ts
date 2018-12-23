import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CategoryType } from '../models/category-type';
import { Category } from '../models/category';
import { ProductCategory } from '../models/product-category';
import { ServiceCategory } from '../models/service-category';
import { ServicesService } from './services.service';
import { ProductsService } from './products.service';

@Injectable()
export class CategoryService {
  /**
   * Set categoryType prop before calling the service's methods.
   */
  categoryType: CategoryType;

  constructor(private productsService: ProductsService, private servicesService: ServicesService) {}

  private ensureCategoryType() {
    if (!this.categoryType) {
      throw new Error(`Please set the categoryType prop before calling the service's methods.`);
    }
  }

  getAll(): Observable<Category[]> {
    this.ensureCategoryType();

    switch (this.categoryType) {
      case CategoryType.Product:
        return this.productsService.getProductCategories().pipe(map(fromProductCategories));

      case CategoryType.Service:
        return this.servicesService.getServiceCategories().pipe(map(fromServiceCategories));
    }
  }

  createCategory(data: Category) {
    this.ensureCategoryType();

    switch (this.categoryType) {
      case CategoryType.Product:
        return this.productsService.addProductCategory(toProductCategory(data)).pipe(map(fromProductCategory));

      case CategoryType.Service:
        return this.servicesService.addServiceCategory(toServiceCategory(data)).pipe(map(fromServiceCategory));
    }
  }

  updateCategory(data: Category) {
    this.ensureCategoryType();

    switch (this.categoryType) {
      case CategoryType.Product:
        return this.productsService.updateProductCategory(toProductCategory(data));

      case CategoryType.Service:
        return this.servicesService.updateServiceCategory(toServiceCategory(data));
    }
  }

  deleteCategory(id: number) {
    this.ensureCategoryType();

    switch (this.categoryType) {
      case CategoryType.Product:
        return this.productsService.deleteProductCategory(id).pipe(map(fromProductCategory));

      case CategoryType.Service:
        return this.servicesService.deleteServiceCategory(id).pipe(map(fromServiceCategory));
    }
  }
}

function fromProductCategories(source: ProductCategory[]): Category[] {
  return source.map(fromProductCategory);
}

function fromProductCategory(source: ProductCategory): Category {
  return source
    ? {
        id: source.productCategoryId,
        name: source.name
      }
    : undefined;
}

function toProductCategory(source: Category): ProductCategory {
  return source
    ? {
        productCategoryId: source.id,
        name: source.name
      }
    : undefined;
}

function fromServiceCategories(source: ServiceCategory[]): Category[] {
  return source.map(fromServiceCategory);
}

function fromServiceCategory(source: ServiceCategory): Category {
  return source
    ? {
        id: source.serviceCategoryId,
        name: source.name
      }
    : undefined;
}

function toServiceCategory(source: Category): ServiceCategory {
  return source
    ? {
        serviceCategoryId: source.id,
        name: source.name
      }
    : undefined;
}
