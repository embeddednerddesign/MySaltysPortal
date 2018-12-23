import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Service, ServiceTax, UserCategoryService } from '../../../../models/service';
import { ServiceCategory, ServiceTemplateIcon } from '../../../../models/service-category';
import { CatalogueUpdatesService } from '../../../../services/catalogueupdates.service';
import { Subject } from 'rxjs/Subject';
import { Product, RequiredProduct, RecommendedProduct } from '../../../../models/product';
import { ProductsService } from '../../../../services/products.service';
import { startWith, map } from 'rxjs/operators';
import { ServicesService } from '../../../../services/services.service';
import { FormatterService } from '../../../../services/formatter.service';
import { UserCategory } from '../../../../models/user-category';
import { UsersService } from '../../../../services/users.service';
import { Tax } from '../../../../models/tax';
import { isNull } from 'util';
import { MatAutocompleteTrigger } from '@angular/material';
import { ClinicsService } from '../../../../services/clinics.service';
import { TaxService } from '../../../../services/tax.service';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.less']
})
export class EditServiceComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('userCatSelect')
  userCatSelect;
  @ViewChild('recommendedProducts')
  recommendedProductsAutoComplete: MatAutocompleteTrigger;

  view: Observable<Service>;
  editServicePanelVisible = false;
  addOrEdit = 'Add';

  // boolean choices
  boolChoices: string[] = ['Yes', 'No'];

  // service status
  serviceStatus: string[] = ['Active', 'Inactive'];

  unsub: Subject<void> = new Subject<void>();
  serviceID: FormControl;
  serviceIDColour: FormControl;
  serviceIcon: FormControl;
  serviceName: FormControl;
  serviceAltName: FormControl;
  subType: FormControl;
  status: FormControl;
  diagnosticCode: FormControl;
  serviceDuration: FormControl;
  serviceCategory: FormControl;
  retailPrice: FormControl;
  billingCode: FormControl;
  govtBilling: FormControl;
  categories: ServiceCategory[] = [];
  userCategories: UserCategory[] = [];
  taxes: Tax[];
  selectedTaxes: Tax[] = [];
  requiredProducts: FormControl;
  recommendedProducts: FormControl;
  userCatsSelectedStatus: Number[];
  selectedRequiredProducts: RequiredProduct[] = [];
  selectedRecommendedProducts: RecommendedProduct[] = [];

  isNew = true;
  public templateIconsDropDown: Array<ServiceTemplateIcon> = [
    { serviceTemplateIconId: 0, icon: 'fal fa-syringe' },
    { serviceTemplateIconId: 0, icon: 'fas fa-neuter' },
    { serviceTemplateIconId: 0, icon: 'fas fa-child' },
    { serviceTemplateIconId: 0, icon: 'fas fa-user-md' }
  ];

  requiredproductsunsub: any;
  recentRequiredProducts: Product[];
  selectedRequiredProduct: FormControl = new FormControl();
  allAvailableProducts: Product[] = [];
  filteredRequiredProducts: Observable<Product[]>;
  requiredProductToAdd: Product = {
    productId: null,
    name: '',
    productCode: '',
    quantityInStock: 0,
    retailPrice: 0,
    wholesalePrice: 0,
    quantity: 0,
    usageDuration: 0,
    productCategoryId: 0,
    category: { productCategoryId: 0, name: '' },
    productTaxes: []
  };
  recommendedproductsunsub: any;
  recentRecommendedProducts: Product[];
  selectedRecommendedProduct: FormControl = new FormControl();
  filteredRecommendedProducts: Observable<Product[]>;
  recommendedProductToAdd: Product = {
    productId: null,
    name: '',
    productCode: '',
    quantityInStock: 0,
    retailPrice: 0,
    wholesalePrice: 0,
    productCategoryId: 0,
    category: { productCategoryId: 0, name: '' },
    productTaxes: [],
    quantity: 0,
    usageDuration: 0
  };

  service: Service = {
    serviceId: 0,
    quantity: 0,
    serviceIDColour: '#2F3B50',
    serviceName: '',
    diagnosticCode: null,
    defaultPrice: null,
    billingCode: null,
    governmentBilling: false,
    serviceAltName: '',
    defaultDurationMinutes: null,
    subType: null,
    templateIcon: this.templateIconsDropDown[0].icon,
    serviceCategoryId: 0,
    category: {
      serviceCategoryId: 0,
      name: ''
    },
    status: true,
    attachedForms: null,
    serviceTaxes: null,
    requiredProducts: [],
    recommendedProducts: [],
    room: null,
    equipment: null,
    serviceReqProductsString: '',
    serviceRecProductsString: ''
  };

  constructor(
    private servicesService: ServicesService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private productService: ProductsService,
    private clinicService: ClinicsService,
    private taxService: TaxService,
    private usersService: UsersService,
    public formatterService: FormatterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.serviceID = new FormControl();
    this.serviceIDColour = new FormControl();
    this.serviceIcon = new FormControl();
    this.serviceName = new FormControl();
    this.serviceAltName = new FormControl();
    this.subType = new FormControl();
    this.status = new FormControl();
    this.diagnosticCode = new FormControl();
    this.serviceDuration = new FormControl();
    this.serviceCategory = new FormControl('', [Validators.required]);
    this.retailPrice = new FormControl();
    this.billingCode = new FormControl();
    this.govtBilling = new FormControl();
    this.requiredProducts = new FormControl();
    this.recommendedProducts = new FormControl();
  }

  ngOnInit() {
    this.usersService.getUserCategories().subscribe(res => {
      res.forEach(doc => {
        this.userCategories.push(doc as UserCategory);
      });
    });

    this.route.params.takeUntil(this.unsub).subscribe(params => {
      const id = params['servid'];

      if (id && id !== '_') {
        // TODO: add this to the condition: && isNumber(id) && id > 0
        this.servicesService.getServiceForEdit(id).subscribe(
          dto => {
            if (dto.service) {
              this.service = dto.service;
              this.categories = dto.serviceCategories;
              this.allAvailableProducts = dto.products;
              // this.taxes = dto.taxes;
              this.taxes = this.getClinicTaxes(0);

              dto.service.requiredProducts.forEach(rp => {
                this.selectedRequiredProducts.push(rp);
              });
              dto.service.recommendedProducts.forEach(rp => {
                this.selectedRecommendedProducts.push(rp);
              });
              dto.service.serviceTaxes.forEach(pt => {
                this.selectedTaxes.push(pt.tax);
              });

              this.userCatsSelectedStatus = [];
              this.service.userCategories.forEach(element => {
                const localIndex = this.userCategories.find(uc => uc.userCategoryId === element.userCategoryId).userCategoryId;
                this.userCatsSelectedStatus.push(localIndex);
              });
              this.isNew = false;
              this.addOrEdit = 'Edit';
            } else {
              // TODO: decide what to do if there is no more the package in the database
            }
          },
          err => {
            // TODO: decide what to do with err
          }
        );
      } else {
        this.servicesService.getListsForNewService().subscribe(
          dto => {
            this.categories = dto.serviceCategories;
            this.allAvailableProducts = dto.products;
            // this.taxes = dto.taxes;
            this.taxes = this.getClinicTaxes(0);
          },
          err => {
            // TODO: decide what to do with err
          }
        );
      }
    });

    this.filteredRequiredProducts = this.selectedRequiredProduct.valueChanges.pipe(
      startWith(''),
      map(val => this.requiredprodfilter(val))
    );

    this.filteredRecommendedProducts = this.selectedRecommendedProduct.valueChanges.pipe(
      startWith(''),
      map(val => this.recommendedprodfilter(val))
    );
  }

  requiredprodfilter(val: any): Product[] {
    if (val.name) {
      return this.allAvailableProducts.filter(option => option.name.toLowerCase().includes(val.name.toLowerCase()));
    } else {
      return this.allAvailableProducts.filter(option => option.name.toLowerCase().includes(val.toLowerCase()));
    }
  }

  requiredProductDisplayFn(user?: Product): string | undefined {
    return user ? user.name : undefined;
  }

  recommendedprodfilter(val: any): Product[] {
    if (val.name) {
      return this.allAvailableProducts.filter(option => option.name.toLowerCase().includes(val.name.toLowerCase()));
    } else {
      return this.allAvailableProducts.filter(option => option.name.toLowerCase().includes(val.toLowerCase()));
    }
  }

  recommendedProductDisplayFn(user?: Product): string | undefined {
    return user ? user.name : undefined;
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  updateServiceUserCategories(event) {
    const userCats = [];
    const selectedUserCatsIds = event.value as Array<Number>;
    this.userCatsSelectedStatus = event.value as Array<Number>;
    selectedUserCatsIds.forEach(element => {
      const fullUserCat = this.userCategories.find(uc => uc.userCategoryId === Number(element));
      const userCat = {
        userCategoryId: fullUserCat.userCategoryId,
        userCategory: fullUserCat,
        serviceId: this.service.serviceId,
        service: null
      };
      userCats.push(userCat);
    });
    this.service.userCategories = userCats as UserCategoryService[];
  }

  addRequiredProductToService() {
    let matchFound = false;
    let requiredProductToAdd: Product = null;
    if (typeof this.selectedRequiredProduct.value === 'object') {
      requiredProductToAdd = this.selectedRequiredProduct.value;
    }
    if (!isNull(this.requiredProductToAdd)) {
      this.service.requiredProducts.forEach(requiredProduct => {
        if (requiredProduct.productId === this.requiredProductToAdd.productId) {
          requiredProduct.productQuantity += 1;
          this.updateServiceRequiredProductQuantity(requiredProduct);
          matchFound = true;
        }
      });
      if (!matchFound) {
        const serviceProduct: RequiredProduct = {
          productId: requiredProductToAdd.productId,
          product: requiredProductToAdd,
          productQuantity: 1,
          serviceId: Number(this.service.serviceId),
          service: null
        };
        const serviceProductDB: RequiredProduct = {
          productId: requiredProductToAdd.productId,
          product: null,
          productQuantity: 1,
          serviceId: Number(this.service.serviceId),
          service: null
        };
        this.selectedRequiredProducts.push(serviceProduct);
        this.service.requiredProducts.push(serviceProductDB);
      }
    }
  }

  addRecommendedProductToService() {
    let matchFound = false;
    let recommendedProductToAdd: Product = null;
    if (typeof this.selectedRecommendedProduct.value === 'object') {
      recommendedProductToAdd = this.selectedRecommendedProduct.value;
    }
    if (!isNull(this.recommendedProductToAdd)) {
      this.service.recommendedProducts.forEach(recommendedProduct => {
        if (recommendedProduct.productId === this.recommendedProductToAdd.productId) {
          recommendedProduct.productQuantity += 1;
          this.updateServiceRecommendedProductQuantity(recommendedProduct);
          matchFound = true;
        }
      });
      if (!matchFound) {
        const serviceProduct: RecommendedProduct = {
          productId: recommendedProductToAdd.productId,
          product: recommendedProductToAdd,
          productQuantity: 1,
          serviceId: Number(this.service.serviceId),
          service: null
        };
        const serviceProductDB: RecommendedProduct = {
          productId: recommendedProductToAdd.productId,
          product: null,
          productQuantity: 1,
          serviceId: Number(this.service.serviceId),
          service: null
        };
        this.selectedRecommendedProducts.push(serviceProduct);
        this.service.recommendedProducts.push(serviceProductDB);
      }
    }
  }

  updateServiceRequiredProductQuantity(product: RequiredProduct) {
    this.service.requiredProducts.forEach(rp => {
      if (rp.serviceId === product.serviceId) {
        rp.productQuantity = product.productQuantity;
      }
    });
    this.selectedRequiredProducts.forEach(rp => {
      if (rp.serviceId === product.serviceId) {
        rp.productQuantity = product.productQuantity;
      }
    });
  }

  updateServiceRecommendedProductQuantity(product: RecommendedProduct) {
    this.service.recommendedProducts.forEach(rp => {
      if (rp.serviceId === product.serviceId) {
        rp.productQuantity = product.productQuantity;
      }
    });
    this.selectedRecommendedProducts.forEach(rp => {
      if (rp.serviceId === product.serviceId) {
        rp.productQuantity = product.productQuantity;
      }
    });
  }

  removeRequiredProductFromService(productToRemove: Product) {
    this.service.requiredProducts.splice(
      this.service.requiredProducts.indexOf(
        this.service.requiredProducts.find(rp => rp.productId === productToRemove.productId)), 1);
    this.selectedRequiredProducts.splice(
      this.selectedRequiredProducts.indexOf(
        this.selectedRequiredProducts.find(rp => rp.productId === productToRemove.productId)), 1);
  }

  removeRecommendedProductFromService(productToRemove: Product) {
    this.service.recommendedProducts.splice(
      this.service.recommendedProducts.indexOf(
        this.service.recommendedProducts.find(rp => rp.productId === productToRemove.productId)), 1);
    this.selectedRecommendedProducts.splice(
      this.selectedRecommendedProducts.indexOf(
        this.selectedRecommendedProducts.find(rp => rp.productId === productToRemove.productId)), 1);
  }

  getClinicTaxes(clinicId: number): Tax[] {
    const clinicTaxes: Tax[] = [];
    this.clinicService.getClinics().subscribe(c => {
      if (!isNull(c[0].clinicTaxes)) {
        if (c[0].clinicTaxes.length > 0) {
          c[0].clinicTaxes.forEach(ct => {
            this.taxService.getTaxes().subscribe(taxes => {
              taxes.forEach(t => {
                if (t.taxId === ct.taxId) {
                  clinicTaxes.push(t);
                }
              });
              return clinicTaxes;
            });
          });
        }
        else {
          return clinicTaxes;
        }
      }
      else {
        return clinicTaxes;
      }
    });
    return clinicTaxes;
  }

  updateService() {
    const id = this.service.serviceId;
    const selectedTaxes = this.selectedTaxes;
    const serviceTaxes: ServiceTax[] = [];

    selectedTaxes.forEach(t => {
      serviceTaxes.push({
        serviceId: id,
        service: null,
        taxId: t.taxId,
        tax: null
      });
    });

    this.service.serviceTaxes = serviceTaxes;

    this.service.serviceReqProductsString = '';
    this.service.serviceRecProductsString = '';
    this.selectedRequiredProducts.forEach(rp => {
      this.service.serviceReqProductsString = this.service.serviceReqProductsString +
                                          rp.product.name + '(' + rp.productQuantity + ')-$' + rp.product.retailPrice;
      this.service.serviceReqProductsString = this.service.serviceReqProductsString + ',';
    });
    this.selectedRecommendedProducts.forEach(rp => {
      this.service.serviceRecProductsString = this.service.serviceRecProductsString +
                                          rp.product.name + '(' + rp.productQuantity + ')-$' + rp.product.retailPrice;
      this.service.serviceRecProductsString = this.service.serviceRecProductsString + ',';
    });
    // remove the trailing comma
    this.service.serviceReqProductsString = this.service.serviceReqProductsString.slice(0, -1);
    this.service.serviceRecProductsString = this.service.serviceRecProductsString.slice(0, -1);

    if (this.isNew) {
      this.servicesService.addService(this.service).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/catalogue/services', { outlets: { 'action-panel': null } }]);
      });
    } else {
      this.servicesService.updateService(this.service).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/catalogue/services', { outlets: { 'action-panel': null } }]);
      });
    }
  }

  cancelUpdate() {
    this.catalogueUpdatesService.refreshRequired = false;
    this.catalogueUpdatesService.catalogueUpdateComplete();
    this.router.navigate(['/management/catalogue/services', { outlets: { 'action-panel': null } }]);
  }
}
