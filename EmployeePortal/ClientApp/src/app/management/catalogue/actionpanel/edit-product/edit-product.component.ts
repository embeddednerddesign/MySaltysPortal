import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CatalogueUpdatesService } from '../../../../services/catalogueupdates.service';
import { Product, ProductTax } from '../../../../models/product';
import { ProductCategory } from '../../../../models/product-category';
import { Subject } from 'rxjs/Subject';
import { ProductsService, GetProductForEditDTO } from '../../../../services/products.service';
import { FormatterService } from '../../../../services/formatter.service';
import { TaxService } from '../../../../services/tax.service';
import { Tax } from '../../../../models/tax';
import { ClinicsService } from '../../../../services/clinics.service';
import { isNull } from 'util';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.less']
})
export class EditProductComponent implements OnInit, AfterViewInit, OnDestroy {
  view: Observable<Product>;
  editProductPanelVisible = false;
  addOrEdit = 'Add';

  unsub: Subject<void> = new Subject<void>();
  productId: FormControl;
  name: FormControl;
  productCode: FormControl;
  quantityInStock: FormControl;
  retailPrice: FormControl;
  wholesalePrice: FormControl;
  category: FormControl;
  taxes: Tax[];
  selectedTaxes: Tax[] = [];

  quantity: FormControl;

  usageDurationDay: FormControl;

  categories: ProductCategory[] = [];
  isNew = true;

  usageDurationDays: Number[] = [];

  product: Product = {
    productId: 0,
    name: '',
    productCode: '',
    quantityInStock: null,
    retailPrice: null,
    wholesalePrice: null,
    quantity: null,
    usageDuration: 0,
    productCategoryId: 0,
    category: {
      productCategoryId: 0,
      name: ''
    },
    productTaxes: []
  };

  constructor(
    private productsService: ProductsService,
    private clinicService: ClinicsService,
    private taxService: TaxService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    public formatterService: FormatterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productId = new FormControl();
    this.name = new FormControl();
    this.productCode = new FormControl();
    this.quantityInStock = new FormControl();
    this.retailPrice = new FormControl();
    this.wholesalePrice = new FormControl();
    this.category = new FormControl('', [Validators.required]);
    this.quantity = new FormControl();
    this.usageDurationDay = new FormControl();
  }

  ngOnInit() {
    // load the days options for usageDuration dropdown
    for (let i = 1; i < 121; i++) {
      this.usageDurationDays[i] = i;
    }
    this.route.params.takeUntil(this.unsub).subscribe(params => {
      const id = params['prodid'];

      if (id && id !== '_') {
        // TODO: add this to the condition: && isNumber(id) && id > 0
        this.productsService.getProductForEdit(id).subscribe(
          dto => {
            if (dto.product) {
              this.product = dto.product;
              this.categories = dto.productCategories;
              // this.taxes = dto.taxes;
              this.taxes = this.getClinicTaxes(0);

              dto.product.productTaxes.forEach(pt => {
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
        this.productsService.getListsForNewProduct().subscribe(
          dto => {
            this.categories = dto.productCategories;
            // this.taxes = dto.taxes;
            this.taxes = this.getClinicTaxes(0);
          },
          err => {
            // TODO: decide what to do with err
          }
        );
      }
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  updateProduct() {
    const id = this.product.productId;
    const selectedTaxes = this.selectedTaxes;
    const productTaxes: ProductTax[] = [];

    selectedTaxes.forEach(t => {
      productTaxes.push({
        productId: id,
        product: null,
        taxId: t.taxId,
        tax: null
      });
    });

    this.product.productTaxes = productTaxes;

    if (this.isNew) {
      this.productsService.addProduct(this.product).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/catalogue/products', { outlets: { 'action-panel': null } }]);
      });
    } else {
      this.productsService.updateProduct(this.product).subscribe(() => {
        this.catalogueUpdatesService.refreshRequired = true;
        this.catalogueUpdatesService.catalogueUpdateComplete();
        this.router.navigate(['/management/catalogue/products', { outlets: { 'action-panel': null } }]);
      });
    }
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

  cancelUpdate() {
    this.catalogueUpdatesService.refreshRequired = false;
    this.catalogueUpdatesService.catalogueUpdateComplete();
    this.router.navigate(['/management/catalogue/products', { outlets: { 'action-panel': null } }]);
  }
}
