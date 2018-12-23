import { Injectable } from '@angular/core';
import { Service, ServiceDotNet } from '../models/service';
import { ServiceCategory } from '../models/service-category';
import { Product, ProductDotNet, RequiredProduct } from '../models/product';
import { StaffsService } from './staffs.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Clinic } from '../models/clinic';
import { Tax } from '../models/tax';

@Injectable()
export class ServicesService {
  constructor(private http: HttpClient, private staffsService: StaffsService) {}

  dotNetService: ServiceDotNet;

  addService(service: Service) {
    this.serviceToDotNetService(service);
    return this.http.post<Service>(environment.baseUrl + 'api/Services', this.dotNetService);
  }

  updateService(service: Service) {
    this.serviceToDotNetService(service);
    return this.http.put<void>(environment.baseUrl + 'api/Services/' + service.serviceId, service);
  }

  removeService(service: Service) {
    return this.http.delete(environment.baseUrl + 'api/Services/' + service.serviceId);
  }

  getServices() {
    return this.http.get<Service[]>(environment.baseUrl + 'api/Services');
  }

  getServiceById(serviceId) {
    return this.http.get<Service>(environment.baseUrl + 'api/Services/' + serviceId);
  }

  getServiceByCategory(serviceCategory: ServiceCategory) {
    return this.http.get<Service[]>(environment.baseUrl + 'api/Services/Category/' + serviceCategory.serviceCategoryId);
  }

  getServiceCategoriesByClinic(clinic: Clinic) {
    return this.http.get<ServiceCategory[]>(environment.baseUrl + 'api/Clinics/' + clinic.clinicId + '/ServiceCategory');
  }

  getServicesByCategoryAndClinic(clinic: Clinic, serviceCategory: ServiceCategory) {
    return this.http.get<Service[]>(
      environment.baseUrl + 'api/Clinics/' + clinic.clinicId + 'ServiceCategory/' + serviceCategory.serviceCategoryId
    );
  }

  addServiceCategory(serviceCategory: ServiceCategory) {
    return this.http.post<ServiceCategory>(environment.baseUrl + 'api/ServiceCategories', serviceCategory);
  }

  updateServiceCategory(serviceCategory: ServiceCategory) {
    return this.http.put<void>(`${environment.baseUrl}api/ServiceCategories/${serviceCategory.serviceCategoryId}`, serviceCategory);
  }

  removeServiceCategory(serviceCategory: ServiceCategory) {
    return this.deleteServiceCategory(serviceCategory.serviceCategoryId);
  }

  deleteServiceCategory(id: number) {
    return this.http.delete(`${environment.baseUrl}api/ServiceCategories/${id}`);
  }

  getServiceCategories() {
    return this.http.get<ServiceCategory[]>(environment.baseUrl + 'api/ServiceCategories');
  }

  serviceToDotNetService(service: Service) {
    this.dotNetService = {
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      quantity: service.quantity,
      billingCode: service.billingCode,
      serviceAltName: service.serviceAltName,
      defaultDurationMinutes: service.defaultDurationMinutes,
      subType: service.subType,
      diagnosticCode: service.diagnosticCode,
      serviceIDColour: service.serviceIDColour,
      templateIcon: service.templateIcon,
      serviceCategoryId: service.serviceCategoryId,
      defaultPrice: service.defaultPrice,
      status: service.status,
      attachedForms: service.attachedForms,
      serviceTaxes: service.serviceTaxes,
      governmentBilling: service.governmentBilling,
      requiredProducts: service.requiredProducts,
      recommendedProducts: service.recommendedProducts,
      room: service.room,
      equipment: service.equipment,
      userCategories: service.userCategories
    };

    if (this.dotNetService.requiredProducts) {
      this.dotNetService.requiredProducts.forEach(rp => {
        rp.product = null;
        rp.service = null;
      });
    }

    if (this.dotNetService.recommendedProducts) {
      this.dotNetService.recommendedProducts.forEach(rp => {
        rp.product = null;
        rp.service = null;
      });
    }

    if (this.dotNetService.userCategories) {
      this.dotNetService.userCategories.forEach(uc => {
        uc.userCategory = null;
        uc.service = null;
      });
    }
  }

  getListsForNewService() {
    return this.http.get<GetListsForNewServiceDTO>(`${environment.baseUrl}api/Services/new`);
  }

  getServiceForEdit(id) {
    return this.http.get<GetServiceForEditDTO>(`${environment.baseUrl}api/Services/${id}/edit`);
  }
}

export interface GetListsForNewServiceDTO {
  serviceCategories: ServiceCategory[];
  products: Product[];
  taxes: Tax[];
}

export interface GetServiceForEditDTO {
  service: Service;
  serviceCategories: ServiceCategory[];
  products: Product[];
  taxes: Tax[];
}
