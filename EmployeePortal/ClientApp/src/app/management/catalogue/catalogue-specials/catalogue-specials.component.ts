import { Component, OnInit, OnDestroy } from '@angular/core';
import { Special } from '../../../models/special';
import { Product } from '../../../models/product';
import { ProductCategory } from '../../../models/product-category';
import { Service } from '../../../models/service';
import { ServiceCategory } from '../../../models/service-category';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { CatalogueUpdatesService } from '../../../services/catalogueupdates.service';
import { ConfirmDeleteDialogComponent } from '../../dialogs/confirm-delete/confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs/Subject';
import { ProductsService } from '../../../services/products.service';
import { ServicesService } from '../../../services/services.service';
import { SpecialsService } from '../../../services/specials.service';

@Component({
  selector: 'app-catalogue-specials',
  templateUrl: './catalogue-specials.component.html',
  styleUrls: ['./catalogue-specials.component.less']
})
export class CatalogueSpecialsComponent implements OnInit, OnDestroy {
  searchValue = '';
  disableGrid = false;
  loading = false;
  unsub: Subject<void> = new Subject<void>();
  specials: Special[] = [];
  products: Product[] = [];
  services: Service[] = [];
  prodCats: ProductCategory[] = [];
  servCats: ServiceCategory[] = [];
  searchCtrl: FormControl;
  filteredSpecials: Observable<Special[]>;
  public productsDropDown: Product[] = [];
  public servicesDropDown: Service[] = [];

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
  editedDataItem: Special;

  constructor(
    private productsService: ProductsService,
    private servicesService: ServicesService,
    private specialsService: SpecialsService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private deleteDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchCtrl = new FormControl();
    this.filteredSpecials = this.searchCtrl.valueChanges.pipe(
      startWith(''),
      map(pack => this.filterSpecials(pack))
    );
  }

  ngOnInit() {
    this.catalogueUpdatesService.catalogueUpdated.takeUntil(this.unsub).subscribe(() => {
      this.disableGrid = false;
      if (this.catalogueUpdatesService.refreshRequired) {
        this.catalogueUpdatesService.refreshRequired = false;
        this.refreshData();
      }
    });
    this.loading = true;
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
        // FIX ME!!!!!!
        // this.productsService.getProductByCategory(pc.name).then(result => {
        //  result.forEach(pcdoc => {
        //    const pcdocData = pcdoc.data();
        //    const pcpushItem: Product = {
        //      productId: pcdocData.productId,
        //      name: pcdocData.name,
        //      productCode: pcdocData.productCode,
        //      quantityInStock: pcdocData.quantityInStock,
        //      retailPrice: pcdocData.retailPrice,
        //      wholesalePrice: pcdocData.wholesalePrice,
        //      category: pcdocData.category,
        //      taxes: pcdocData.taxes,
        //      quantity: pcdocData.quantity
        //    };
        //    this.productsDropDown.push(pcpushItem);
        //  });
        // });
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
        // FIX ME!!!!!!
        // this.servicesService.getServiceByCategory(sc.name).then(result => {
        //  result.forEach(scdoc => {
        //    const scdocData = scdoc.data();
        //    const scpushItem: Service = {
        //      serviceId: scdocData.serviceId,
        //      quantity: scdocData.quantity,
        //      serviceIDColour: scdocData.serviceIDColour,
        //      templateIcon: scdocData.templateIcon,
        //      serviceName: scdocData.serviceName,
        //      diagnosticCode: scdocData.diagnosticCode,
        //      subType: scdocData.subType,
        //      category: scdocData.category,
        //      defaultDurationMinutes: scdocData.defaultDurationMinutes,
        //      defaultPrice: scdocData.defaultPrice,
        //      billingCode: scdocData.billingCode,
        //      governmentBilling: scdocData.governmentBilling
        //    };
        //    this.servicesDropDown.push(scpushItem);
        //  });
        // });
      });
    });
  }

  filterSpecials(name: string) {
    let filterResults: Special[] = [];

    if (name !== '') {
      this.gridView = {
        data: this.specials
          .filter(pack => pack.name.toLowerCase().includes(name.toLowerCase()))
          .slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.specials.filter(pack => pack.name.toLowerCase().includes(name.toLowerCase())).length
      };
      filterResults = this.specials.filter(special => special.name.toLowerCase().includes(name.toLowerCase()));
    } else {
      this.gridView = {
        data: this.specials.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.specials.length
      };
      filterResults = [];
    }
    return filterResults;
  }

  refreshData() {
    this.loading = true;
    this.specials = [];
    this.specialsService.getSpecials().subscribe(res => {
      res.forEach(doc => {
        const docData = doc;
        const pushItem: Special = {
          specialId: docData.specialId,
          code: 0,
          name: docData.name,
          totalOfIndividualPrices: docData.totalOfIndividualPrices,
          retailPrice: docData.retailPrice,
          products: docData.products,
          services: docData.services,
          specialTaxes: docData.specialTaxes
        };
        this.specials.push(pushItem);
      });
      this.loadItems();
      this.loading = false;
    });
  }

  addPackage(special: Special) {
    if (special.code !== 0) {
      this.specialsService.addSpecial(special);
    }
  }

  onAddClick({ sender }) {
    this.disableGrid = true;
    this.router.navigate(['/management/catalogue/specials', { outlets: { 'action-panel': ['edit-special', '_'] } }]);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.disableGrid = true;
    this.router.navigate(['/management/catalogue/specials', { outlets: { 'action-panel': ['edit-special', dataItem.specialId] } }]);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    const special: Special = formGroup.value;
    if (isNew) {
      this.specialsService.addSpecial(special).subscribe(() => {
        this.refreshData();
      });
    } else {
      this.specialsService.updateSpecial(special).subscribe(() => {
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
            specialId: dataItem.specialId,
            name: dataItem.name,
            code: dataItem.code,
            totalOfIndividualPrices: dataItem.totalOfIndividualPrices,
            retailPrice: dataItem.retailPrice,
            products: dataItem.products,
            services: dataItem.services,
            specialTaxes: dataItem.specialTaxes
          };
          this.specialsService.removeSpecial(dataItemToRemove).subscribe(() => {
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
      data: this.specials.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
      total: this.specials.length
    };
  }
}
