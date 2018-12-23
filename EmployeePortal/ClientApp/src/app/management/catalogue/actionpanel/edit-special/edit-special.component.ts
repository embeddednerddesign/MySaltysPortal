import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Special, SpecialTax } from '../../../../models/special';
import { Subject } from 'rxjs';
import { CatalogueUpdatesService } from '../../../../services/catalogueupdates.service';
import { Product, SpecialProduct } from '../../../../models/product';
import { ProductsService } from '../../../../services/products.service';
import { startWith } from 'rxjs/operators';
import { SpecialsService } from '../../../../services/specials.service';
import { FormatterService } from '../../../../services/formatter.service';
import { Tax } from '../../../../models/tax';
import { ClinicsService } from '../../../../services/clinics.service';
import { TaxService } from '../../../../services/tax.service';
import { isNull } from 'util';

@Component({
  selector: 'app-edit-special',
  templateUrl: './edit-special.component.html',
  styleUrls: ['./edit-special.component.less']
})
export class EditSpecialComponent implements OnInit, AfterViewInit, OnDestroy {
  specialIdParam = '0';

  editSpecialPanelVisible = false;
  addOrEdit = 'Add';

  name: FormControl;
  code: FormControl;
  totalOfIndividualPrices: FormControl;
  retailPrice: FormControl;
  products: FormControl;
  services: FormControl;
  taxes: Tax[];
  selectedTaxes: Tax[] = [];
  isNew = true;

  special: Special = {
    specialId: 0,
    name: '',
    code: null,
    totalOfIndividualPrices: '$0.00',
    retailPrice: 0.0,
    products: [],
    services: [],
    specialTaxes: []
  };

  productsunsub: any;
  unsub: Subject<void> = new Subject<void>();
  recentProducts: Product[];
  selectedProduct: FormControl = new FormControl();
  allAvailableProducts: Product[] = [];
  filteredProducts: Observable<Product[]>;
  selectedProducts: SpecialProduct[] = [];
  productToAdd: Product = {
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

  constructor(
    private specialsService: SpecialsService,
    private productService: ProductsService,
    private clinicService: ClinicsService,
    private taxService: TaxService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    public formatterService: FormatterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.name = new FormControl();
    this.code = new FormControl();
    this.totalOfIndividualPrices = new FormControl();
    this.retailPrice = new FormControl();
    this.products = new FormControl();
    this.services = new FormControl();
  }

  ngOnInit() {
    this.route.params.takeUntil(this.unsub).subscribe(params => {
      const id = params['specid'];

      if (id && id !== '_') {
        // TODO: add this to the condition: && isNumber(id) && id > 0
        this.specialIdParam = id;
        this.specialsService.getSpecialForEdit(id).subscribe(
          dto => {
            if (dto.special) {
              this.special = dto.special;
              this.allAvailableProducts = dto.products;
              // this.categories = dto.services;
              // this.taxes = dto.taxes;
              this.taxes = this.getClinicTaxes(0);

              dto.special.products.forEach(sp => {
                this.selectedProducts.push(sp);
              });
              dto.special.specialTaxes.forEach(pt => {
                this.selectedTaxes.push(pt.tax);
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
        this.specialsService.getListsForNewSpecial().subscribe(
          dto => {
            this.allAvailableProducts = dto.products;
            // this.categories = dto.services;
            // this.taxes = dto.taxes;
            this.taxes = this.getClinicTaxes(0);
          },
          err => {
            // TODO: decide what to do with err
          }
        );
      }
    });
    // this.getAllAvailableProducts();
    this.filteredProducts = this.selectedProduct.valueChanges.pipe(
      startWith(''),
      map(val => this.filter(val))
    );
  }

  filter(val: any): Product[] {
    if (val.name) {
      return this.allAvailableProducts.filter(option => option.name.toLowerCase().includes(val.name.toLowerCase()));
    } else {
      return this.allAvailableProducts.filter(option => option.name.toLowerCase().includes(val.toLowerCase()));
    }
  }
  productDisplayFn(user?: Product): string | undefined {
    return user ? user.name : undefined;
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  addProductToSpecial() {
    let matchFound = false;
    let productToAdd: Product = null;
    if (typeof this.selectedProduct.value === 'object') {
      productToAdd = this.selectedProduct.value;
    }
    if (!isNull(productToAdd)) {
      this.selectedProducts.forEach(selectedProduct => {
        if (selectedProduct.productId === productToAdd.productId) {
          selectedProduct.productQuantity += 1;
          this.updateSpecialProductQuantity(selectedProduct);
          matchFound = true;
        }
      });
      if (!matchFound) {
        const packageProduct: SpecialProduct = {
          productId: productToAdd.productId,
          product: productToAdd,
          productQuantity: 1,
          specialId: Number(this.specialIdParam),
          special: null
        };
        const packageProductDB: SpecialProduct = {
          productId: productToAdd.productId,
          product: null,
          productQuantity: 1,
          specialId: Number(this.specialIdParam),
          special: null
        };
        this.selectedProducts.push(packageProduct);
        this.special.products.push(packageProductDB);
        this.updateTotalOfPrices();
      }
    }
  }

  updateSpecialProductQuantity(product: SpecialProduct) {
    this.special.products.forEach(pp => {
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


  removeProductFromSpecial(productToRemove: SpecialProduct) {
    let productIndex = this.special.products.indexOf(
      this.special.products.find(pp => pp.productId === productToRemove.productId));
    this.special.products.splice(productIndex, 1);

    productIndex = this.selectedProducts.indexOf(
      this.selectedProducts.find(sp => sp.productId === productToRemove.productId));
    this.selectedProducts.splice(productIndex, 1);

    this.updateTotalOfPrices();
  }

  getAllAvailableProducts() {
    this.productService.getProductCategories().subscribe(categoriesSnapshot => {
      categoriesSnapshot.forEach(doc => {
        const category = doc;
        this.productService.getProductByCategory(category.productCategoryId).subscribe(productSnapshot => {
          productSnapshot.forEach(productDoc => {
            const product = productDoc as Product;
            this.allAvailableProducts.push(product);
          });
        });
      });
    });
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

  updateTotalOfPrices() {
    let totalPrices = 0;
    this.selectedProducts.forEach(sp => {
      totalPrices = Number(totalPrices) +
        (Number(sp.product.retailPrice) * Number(sp.product.quantity));
    });
    // apply the taxes
    var thetaxtotal = 0;
    this.selectedTaxes.forEach(tax => {
      thetaxtotal = thetaxtotal + (totalPrices * tax.value);
    });
    totalPrices = totalPrices + thetaxtotal;
    this.special.totalOfIndividualPrices = (totalPrices).toFixed(2);
  }

  updateSpecial() {
    const id = this.special.specialId;
    const selectedTaxes = this.selectedTaxes;
    const specialTaxes: SpecialTax[] = [];

    selectedTaxes.forEach(t => {
      specialTaxes.push({
        specialId: id,
        special: null,
        taxId: t.taxId,
        tax: null
      });
    });

    this.special.specialTaxes = specialTaxes;

    if (this.isNew) {
      this.specialsService.addSpecial(this.special).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/catalogue/specials', { outlets: { 'action-panel': null } }]);
      });
    } else {
      this.specialsService.updateSpecial(this.special).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/catalogue/specials', { outlets: { 'action-panel': null } }]);
      });
    }
  }

  cancelUpdate() {
    this.catalogueUpdatesService.refreshRequired = false;
    this.catalogueUpdatesService.catalogueUpdateComplete();
    this.router.navigate(['/management/catalogue/specials', { outlets: { 'action-panel': null } }]);
  }
}
