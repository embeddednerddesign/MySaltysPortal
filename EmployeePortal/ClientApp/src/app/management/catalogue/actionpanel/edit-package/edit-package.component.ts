import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Package, PackageTax } from '../../../../models/package';
import { Subject } from 'rxjs/Subject';
import { CatalogueUpdatesService } from '../../../../services/catalogueupdates.service';
import { Product, PackageProduct } from '../../../../models/product';
import { Service, PackageService } from '../../../../models/service';
import { ProductsService } from '../../../../services/products.service';
import { ServicesService } from '../../../../services/services.service';
import { startWith } from 'rxjs/operators';
import { PackagesService } from '../../../../services/packages.service';
import { FormatterService } from '../../../../services/formatter.service';
import { TaxService } from '../../../../services/tax.service';
import { Tax } from '../../../../models/tax';
import { isNull } from 'util';
import { ClinicsService } from '../../../../services/clinics.service';

@Component({
  selector: 'app-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.less']
})
export class EditPackageComponent implements OnInit, AfterViewInit, OnDestroy {
  editPackagePanelVisible = false;
  addOrEdit = 'Add';

  packageIdParam = '0';
  packageCategoryParam: string;

  name: FormControl;
  totalOfIndividualPrices: FormControl;
  retailPrice: FormControl;
  products: FormControl;
  services: FormControl;
  taxes: Tax[];
  selectedTaxes: Tax[] = [];
  isNew = true;

  public package: Package = {
    packageId: 0,
    name: '',
    totalOfIndividualPrices: '$0.00',
    retailPrice: null,
    packageProducts: [],
    packageServices: [],
    packageTaxes: [],
    packageProductsString: ''
  };

  unsub: Subject<void> = new Subject<void>();
  recentProducts: Product[];
  selectedProduct: FormControl = new FormControl();
  allAvailableProducts: Product[] = [];
  selectedService: FormControl = new FormControl();
  allAvailableServices: Service[] = [];
  filteredProducts: Observable<Product[]>;
  selectedProducts: PackageProduct[] = [];
  filteredServices: Observable<Service[]>;
  selectedServices: PackageService[] = [];
  productToAdd: Product = {
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
  serviceToAdd: Service = {
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
    templateIcon: null,
    serviceCategoryId: 0,
    category: null,
    status: true,
    attachedForms: [],
    serviceTaxes: [],
    requiredProducts: [],
    recommendedProducts: [],
    room: [],
    equipment: [],
    userCategories: [],
    serviceReqProductsString: '',
    serviceRecProductsString: ''
};

  constructor(
    private packagesService: PackagesService,
    private productService: ProductsService,
    private serviceService: ServicesService,
    private taxesService: TaxService,
    private clinicService: ClinicsService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    public formatterService: FormatterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.name = new FormControl();
    this.totalOfIndividualPrices = new FormControl();
    this.retailPrice = new FormControl();
    this.products = new FormControl();
    this.services = new FormControl();
  }

  ngOnInit() {
    this.route.params.takeUntil(this.unsub).subscribe(params => {
      const id = params['packid'];
      this.taxes = [];

      if (id && id !== '_') {
        // TODO: add this to the condition: && isNumber(id) && id > 0
        this.packageIdParam = id;

        this.packagesService.getPackageForEdit(id).subscribe(
          dto => {
            if (dto.package) {
              this.package = dto.package;
              this.allAvailableProducts = dto.products;
              this.allAvailableServices = dto.services;
              // this.taxes = dto.taxes;
              dto.package.packageProducts.forEach(pp => {
                this.selectedProducts.push(pp);
              });
              dto.package.packageServices.forEach(ss => {
                this.selectedServices.push(ss);
              });

              dto.package.packageTaxes.forEach(pt => {
                this.selectedTaxes.push(pt.tax);
              });
              this.taxes = this.getClinicTaxes(0);
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
        this.packagesService.getListsForNew().subscribe(
          dto => {
            this.allAvailableProducts = dto.products;
            this.allAvailableServices = dto.services;
            // this.taxes = dto.taxes;
            this.taxes = this.getClinicTaxes(0);
          },
          err => {
            // TODO: decide what to do with err
          }
        );
      }
    });

    this.filteredProducts = this.selectedProduct.valueChanges.pipe(
      startWith(''),
      map(val => this.prodfilter(val))
    );
    this.filteredServices = this.selectedService.valueChanges.pipe(
      startWith(''),
      map(val => this.servfilter(val))
    );
  }

  prodfilter(val: any): Product[] {
    if (val.name) {
      return this.allAvailableProducts.filter(option => option.name.toLowerCase().includes(val.name.toLowerCase()));
    } else {
      return this.allAvailableProducts.filter(option => option.name.toLowerCase().includes(val.toLowerCase()));
    }
  }
  productDisplayFn(user?: Product): string | undefined {
    return user ? user.name : undefined;
  }
  servfilter(val: any): Service[] {
    if (val.serviceName) {
      return this.allAvailableServices.filter(option => option.serviceName.toLowerCase().includes(val.serviceName.toLowerCase()));
    } else {
      return this.allAvailableServices.filter(option => option.serviceName.toLowerCase().includes(val.toLowerCase()));
    }
  }
  serviceDisplayFn(user?: Service): string | undefined {
    return user ? user.serviceName : undefined;
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  addProductToPackage() {
    let matchFound = false;
    let productToAdd: Product = null;
    if (typeof this.selectedProduct.value === 'object') {
      productToAdd = this.selectedProduct.value;
    }
    if (!isNull(productToAdd)) {
      this.selectedProducts.forEach(selectedProduct => {
        if (selectedProduct.productId === productToAdd.productId) {
          selectedProduct.productQuantity += 1;
          this.updatePackageProductQuantity(selectedProduct);
          matchFound = true;
        }
      });
      if (!matchFound) {
        const packageProduct: PackageProduct = {
          productId: productToAdd.productId,
          product: productToAdd,
          productQuantity: 1,
          packageId: Number(this.packageIdParam),
          package: null
        };
        const packageProductDB: PackageProduct = {
          productId: productToAdd.productId,
          product: null,
          productQuantity: 1,
          packageId: Number(this.packageIdParam),
          package: null
        };
        this.selectedProducts.push(packageProduct);
        this.package.packageProducts.push(packageProductDB);
        this.updateTotalOfPrices();
      }
    }
  }

  updatePackageProductQuantity(product: PackageProduct) {
    this.package.packageProducts.forEach(pp => {
      if (pp.productId === product.productId) {
        pp.productQuantity = product.productQuantity;
      }
    });
    this.selectedProducts.forEach(sp => {
      if (sp.productId === product.productId) {
        sp.productQuantity = product.productQuantity;
      }
    });
    this.updateTotalOfPrices();
  }

  removeProductFromPackage(productToRemove: Product) {
    let productIndex = this.package.packageProducts.indexOf(
      this.package.packageProducts.find(pp => pp.productId === productToRemove.productId));
    this.package.packageProducts.splice(productIndex, 1);

    productIndex = this.selectedProducts.indexOf(
      this.selectedProducts.find(sp => sp.productId === productToRemove.productId));
    this.selectedProducts.splice(productIndex, 1);

    this.updateTotalOfPrices();
  }

  addServiceToPackage() {
    let matchFound = false;
    let serviceToAdd: Service = null;
    if (typeof this.selectedService.value === 'object') {
      serviceToAdd = this.selectedService.value;
    }
    if (!isNull(serviceToAdd)) {
      serviceToAdd.quantity = 1;
      this.selectedServices.forEach(selectedService => {
        if (selectedService.serviceId === serviceToAdd.serviceId) {
          selectedService.serviceQuantity += 1;
          this.updatePackageServiceQuantity(selectedService);
          matchFound = true;
        }
      });
      if (!matchFound) {
        const packageService: PackageService = {
          serviceId: serviceToAdd.serviceId,
          service: serviceToAdd,
          serviceQuantity: 1,
          packageId: Number(this.packageIdParam),
          package: null
        };
        const packageServiceDB: PackageService = {
          serviceId: serviceToAdd.serviceId,
          service: null,
          serviceQuantity: 1,
          packageId: Number(this.packageIdParam),
          package: null
        };
        this.selectedServices.push(packageService);
        this.package.packageServices.push(packageServiceDB);
        this.updateTotalOfPrices();
      }
    }
  }

  removeServiceFromPackage(serviceToRemove: Service) {
    let serviceIndex = this.package.packageServices.indexOf(
      this.package.packageServices.find(pp => pp.serviceId === serviceToRemove.serviceId));
    this.package.packageServices.splice(serviceIndex, 1);

    serviceIndex = this.selectedServices.indexOf(
      this.selectedServices.find(sp => sp.serviceId === serviceToRemove.serviceId));
    this.selectedServices.splice(serviceIndex, 1);

    this.updateTotalOfPrices();
  }

  updatePackageServiceQuantity(service: PackageService) {
    this.package.packageServices.forEach(pp => {
      if (pp.serviceId === service.serviceId) {
        pp.serviceQuantity = service.serviceQuantity;
      }
    });
    this.selectedServices.forEach(ss => {
      if (ss.serviceId === service.serviceId) {
        ss.serviceQuantity = service.serviceQuantity;
      }
    });
    this.updateTotalOfPrices();
  }

  getAllAvailableProducts() {
    this.productService.getProducts().subscribe(prods => {
      prods.forEach(doc => {
        this.allAvailableProducts.push(doc as Product);
      });
      this.updateTotalOfPrices();
    });
  }

  getAllAvailableServices() {
    this.serviceService.getServices().subscribe(servs => {
      servs.forEach(doc => {
        this.allAvailableServices.push(doc as Service);
      });
    });
  }

  getClinicTaxes(clinicId: number): Tax[] {
    const clinicTaxes: Tax[] = [];
    this.clinicService.getClinics().subscribe(c => {
      if (!isNull(c[0].clinicTaxes)) {
        if (c[0].clinicTaxes.length > 0) {
          c[0].clinicTaxes.forEach(ct => {
            this.taxesService.getTaxes().subscribe(taxes => {
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

  updateTotalOfPrices() {
    let totalPrices = 0;
    this.selectedProducts.forEach(sp => {
      totalPrices = Number(totalPrices) +
        (Number(sp.product.retailPrice) * Number(sp.productQuantity));
    });
    this.selectedServices.forEach(ss => {
      totalPrices = Number(totalPrices) +
        (ss.service.defaultPrice === null ? 0 : (Number(ss.service.defaultPrice) * Number(ss.serviceQuantity)));
    });
    // apply the taxes
    var thetaxtotal = 0;
    this.selectedTaxes.forEach(tax => {
      thetaxtotal = thetaxtotal + (totalPrices * tax.value);
    });
    totalPrices = totalPrices + thetaxtotal;
    this.package.totalOfIndividualPrices = (totalPrices).toFixed(2);
  }

  updatePackage() {
    const id = this.package.packageId;
    const selectedTaxes = this.selectedTaxes;
    const packageTaxes: PackageTax[] = [];

    selectedTaxes.forEach(t => {
      packageTaxes.push({
        packageId: id,
        package: null,
        taxId: t.taxId,
        tax: null
      });
    });
    this.package.packageTaxes = packageTaxes;

    this.package.packageProductsString = '';
    this.selectedProducts.forEach(sp => {
      this.package.packageProductsString = this.package.packageProductsString +
                                          sp.product.name + '(' + sp.productQuantity + ')-$' + sp.product.retailPrice;
      this.package.packageProductsString = this.package.packageProductsString + ',';
    });
    this.selectedServices.forEach(ss => {
      this.package.packageProductsString = this.package.packageProductsString +
                                          ss.service.serviceName + '(' + ss.serviceQuantity + ')-$' + ss.service.defaultPrice;
      this.package.packageProductsString = this.package.packageProductsString + ',';
    });
    // remove the trailing comma
    this.package.packageProductsString = this.package.packageProductsString.slice(0, -1);

    if (this.isNew) {
      this.packagesService.addPackage(this.package).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/catalogue/packages', { outlets: { 'action-panel': null } }]);
      });
    } else {
      this.packagesService.updatePackage(this.package).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/catalogue/packages', { outlets: { 'action-panel': null } }]);
      });
    }
  }

  cancelUpdate() {
    this.catalogueUpdatesService.refreshRequired = false;
    this.catalogueUpdatesService.catalogueUpdateComplete();
    this.router.navigate(['/management/catalogue/packages', { outlets: { 'action-panel': null } }]);
  }
}
