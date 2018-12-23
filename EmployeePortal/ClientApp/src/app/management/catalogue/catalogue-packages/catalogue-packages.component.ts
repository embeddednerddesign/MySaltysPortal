import { Component, OnInit, OnDestroy } from '@angular/core';
import { Package } from '../../../models/package';
import { Product } from '../../../models/product';
import { ProductCategory } from '../../../models/product-category';
import { Service } from '../../../models/service';
import { ServiceCategory } from '../../../models/service-category';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogueUpdatesService } from '../../../services/catalogueupdates.service';
import { ConfirmDeleteDialogComponent } from '../../dialogs/confirm-delete/confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { Subject } from 'rxjs/Subject';
import { ProductsService } from '../../../services/products.service';
import { ServicesService } from '../../../services/services.service';
import { PackagesService } from '../../../services/packages.service';

@Component({
  selector: 'app-catalogue-packages',
  templateUrl: './catalogue-packages.component.html',
  styleUrls: ['./catalogue-packages.component.less']
})
export class CataloguePackagesComponent implements OnInit, OnDestroy {
  searchValue = '';
  unsub: Subject<void> = new Subject<void>();
  disableGrid = false;
  loading = false;
  packages: Package[] = [];
  products: Product[] = [];
  services: Service[] = [];
  prodCats: ProductCategory[] = [];
  servCats: ServiceCategory[] = [];
  searchCtrl: FormControl;
  filteredPackages: Observable<Package[]>;
  productsDropDown: Product[] = [];
  servicesDropDown: Service[] = [];
  productsByPackage: { [id: string]: Product[] } = {};
  servicesByPackage: { [id: string]: Service[] } = {};

  gridView: GridDataResult;
  gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  formGroup: FormGroup;
  editedRowIndex: number;
  editedDataItem: Package;

  constructor(
    private productsService: ProductsService,
    private servicesService: ServicesService,
    private packagesService: PackagesService,
    private router: Router,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private deleteDialog: MatDialog
  ) {
    this.searchCtrl = new FormControl();
    this.filteredPackages = this.searchCtrl.valueChanges.pipe(
      startWith(''),
      map(pack => this.filterPackages(pack))
    );
  }

  ngOnInit() {
    this.loading = true;
    this.catalogueUpdatesService.catalogueUpdated.takeUntil(this.unsub).subscribe(() => {
      this.disableGrid = false;
      if (this.catalogueUpdatesService.refreshRequired) {
        this.catalogueUpdatesService.refreshRequired = false;
        this.refreshData();
      }
    });
    this.getProductList();
    this.getServiceList();
    this.refreshData();
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  getProductList() {
    this.prodCats = [];
    this.productsService.getProductCategories().subscribe(res => {
      res.forEach(doc => {
        const docData = doc;
        const pushItem: ProductCategory = {
          productCategoryId: docData.productCategoryId,
          name: docData.name
        };
        this.prodCats.push(pushItem);
      });
      this.prodCats.forEach(pc => {
        this.productsService.getProductByCategory(pc.productCategoryId).subscribe(result => {
          result.forEach(pcdoc => {
            const pcdocData = pcdoc;
            const pcpushItem: Product = {
              productId: pcdocData.productId,
              name: pcdocData.name,
              productCode: pcdocData.productCode,
              quantityInStock: pcdocData.quantityInStock,
              retailPrice: pcdocData.retailPrice,
              wholesalePrice: pcdocData.wholesalePrice,
              productCategoryId: pcdocData.productCategoryId,
              category: pcdocData.category,
              productTaxes: pcdocData.productTaxes,
              quantity: pcdocData.quantity,
              usageDuration: pcdocData.usageDuration
            };
            this.productsDropDown.push(pcpushItem);
          });
        });
      });
    });
  }

  getServiceList() {
    this.servCats = [];
    this.servicesService.getServiceCategories().subscribe(res => {
      res.forEach(doc => {
        const docData = doc;
        const pushItem: ServiceCategory = {
          serviceCategoryId: docData.serviceCategoryId,
          name: docData.name
        };
        this.servCats.push(pushItem);
      });
      this.servCats.forEach(sc => {
        this.servicesService.getServiceByCategory(sc).subscribe(result => {
          result.forEach(scdoc => {
            const scdocData = scdoc as Service;
            const scpushItem: Service = {
              serviceId: scdocData.serviceId,
              quantity: scdocData.quantity,
              serviceIDColour: scdocData.serviceIDColour,
              templateIcon: scdocData.templateIcon,
              serviceName: scdocData.serviceName,
              serviceAltName: scdocData.serviceAltName,
              diagnosticCode: scdocData.diagnosticCode,
              subType: scdocData.subType,
              serviceCategoryId: scdocData.serviceCategoryId,
              category: scdocData.category,
              defaultDurationMinutes: scdocData.defaultDurationMinutes,
              status: scdocData.status,
              attachedForms: scdocData.attachedForms,
              serviceTaxes: scdocData.serviceTaxes,
              requiredProducts: scdocData.requiredProducts,
              recommendedProducts: scdocData.recommendedProducts,
              room: scdocData.room,
              equipment: scdocData.equipment,
              defaultPrice: scdocData.defaultPrice,
              billingCode: scdocData.billingCode,
              governmentBilling: scdocData.governmentBilling,
              serviceReqProductsString: scdocData.serviceReqProductsString,
              serviceRecProductsString: scdocData.serviceRecProductsString
            };
            this.servicesDropDown.push(scpushItem);
          });
        });
      });
    });
  }

  filterPackages(name: string) {
    let filterResults: Package[] = [];

    if (name !== '') {
      this.gridView = {
        data: this.packages
          .filter(pack => pack.name.toLowerCase().includes(name.toLowerCase()))
          .slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.packages.filter(pack => pack.name.toLowerCase().includes(name.toLowerCase())).length
      };
      filterResults = this.packages.filter(pack => pack.name.toLowerCase().includes(name.toLowerCase()));
    } else {
      this.gridView = {
        data: this.packages.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.packages.length
      };
      filterResults = [];
    }
    return filterResults;
  }

  refreshData() {
    this.loading = true;
    this.packages = [];
    this.packagesService.getPackages().subscribe(res => {
      res.forEach(doc => {
        const docData = doc;
        const pushItem: Package = {
          packageId: docData.packageId,
          name: docData.name,
          totalOfIndividualPrices: docData.totalOfIndividualPrices,
          retailPrice: docData.retailPrice,
          packageProducts: docData.packageProducts,
          packageServices: docData.packageServices,
          packageTaxes: docData.packageTaxes,
          packageProductsString: docData.packageProductsString
        };
        this.packages.push(pushItem);
      });
      this.loadItems();
      this.loading = false;
    });
  }

  addPackage(pack: Package) {
    this.packagesService.addPackage(pack);
  }

  onAddClick({ sender }) {
    this.disableGrid = true;
    this.router.navigate(['/management/catalogue/packages', { outlets: { 'action-panel': ['edit-package', '_'] } }]);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.disableGrid = true;
    this.router.navigate(['/management/catalogue/packages', { outlets: { 'action-panel': ['edit-package', dataItem.packageId] } }]);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    const pack: Package = formGroup.value;
    if (isNew) {
      this.packagesService.addPackage(pack).subscribe(() => {
        this.refreshData();
      });
    } else {
      this.packagesService.updatePackage(pack).subscribe(() => {
        this.refreshData();
      });
    }
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem }) {
    const dialogRef = this.deleteDialog.open(ConfirmDeleteDialogComponent, {
      width: '250px'
    });

    dialogRef
      .afterClosed()
      .takeUntil(this.unsub)
      .subscribe(result => {
        if (result === 'delete') {
          const dataItemToRemove = {
            packageId: dataItem.packageId,
            name: dataItem.name,
            totalOfIndividualPrices: dataItem.totalOfIndividualPrices,
            retailPrice: dataItem.retailPrice,
            packageProducts: dataItem.packageProducts,
            packageProductQuantities: dataItem.packageProductQuantities,
            packageServices: dataItem.packageServices,
            packageServiceQuantities: dataItem.packageServiceQuantities,
            packageTaxes: dataItem.packageTaxes,
            packageProductsString: dataItem.packageProductsString
          };
          this.packagesService.removePackage(dataItemToRemove).subscribe(() => {
            this.refreshData();
          });
        }
      });
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  loadItems() {
    this.gridView = {
      data: this.packages.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
      total: this.packages.length
    };
    // filter the products and services dropdowns based on their associated package
    this.gridView.data.forEach(function(element) {});
  }

  openDeleteDialog(): void {
    const dialogRef = this.deleteDialog.open(ConfirmDeleteDialogComponent, {
      width: '250px',
      data: { result: '' }
    });
  }

  normalizeArray<T>(array: Array<T>, indexKey: keyof T) {
    const normalizedObject: any = {};
    for (let i = 0; i < array.length; i++) {
      const key = array[i][indexKey];
      normalizedObject[key] = array[i];
    }
    return normalizedObject as { [key: string]: T };
  }
}
