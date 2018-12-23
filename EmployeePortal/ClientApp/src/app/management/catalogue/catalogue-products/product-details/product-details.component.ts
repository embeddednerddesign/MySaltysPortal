import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product, RecommendedProduct } from '../../../../models/product';
import { ProductCategory } from '../../../../models/product-category';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CatalogueUpdatesService } from '../../../../services/catalogueupdates.service';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { ConfirmDeleteDialogComponent } from '../../../dialogs/confirm-delete/confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs/Subject';
import { ProductsService } from '../../../../services/products.service';
import { ManageCategoriesDialogComponent } from '../../../dialogs/manage-categories/manage-categories.component';
import { CategoryType } from '../../../../models/category-type';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.less']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  searchValue = '';
  unsub: Subject<void> = new Subject<void>();
  disableGrid = false;
  loading = false;
  products: Product[] = [];
  categories: ProductCategory[] = [];
  searchCtrl: FormControl;
  filteredProducts: Observable<Product[]>;
  public categoriesDropDown: ProductCategory[] = [];

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
  editedDataItem: Product;

  constructor(
    private productsService: ProductsService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private manageCategoriesDialog: MatDialog,
    private deleteDialog: MatDialog,
    private router: Router
  ) {
    this.searchCtrl = new FormControl();
    this.filteredProducts = this.searchCtrl.valueChanges.pipe(
      startWith(''),
      map(product => this.filterProducts(product))
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
    this.getCategoryList();
    this.refreshData();
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  getCategoryList() {
    this.categoriesDropDown = [];
    this.productsService.getProductCategories().subscribe(res => {
      res.forEach(doc => {
        const docData = doc;
        const pushItem: ProductCategory = {
          productCategoryId: docData.productCategoryId,
          name: docData.name
        };
        this.categoriesDropDown.push(pushItem);
      });
    });
  }

  filterProducts(name: string) {
    let filterResults: Product[] = [];

    if (name !== '') {
      this.gridView = {
        data: this.products
          .filter(product => product.name.toLowerCase().includes(name.toLowerCase()))
          .slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.products.filter(product => product.name.toLowerCase().includes(name.toLowerCase())).length
      };
      filterResults = this.products.filter(product => product.name.toLowerCase().includes(name.toLowerCase()));
    } else {
      this.gridView = {
        data: this.products.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.products.length
      };
      filterResults = [];
    }
    return filterResults;
  }

  refreshData() {
    this.loading = true;
    this.categories = [];
    this.products = [];
    this.productsService.getProductCategories().subscribe(res => {
      if (res.length > 0) {
        res.forEach(doc => {
          const docData = doc;
          const pushItem: ProductCategory = {
            productCategoryId: docData.productCategoryId,
            name: docData.name
          };
          this.categories.push(pushItem);
        });
        this.productsService.getProducts().subscribe(res => {
          res.forEach(pcdoc => {
            const docData = pcdoc;
            const pushItem: Product = {
              productId: docData.productId,
              name: docData.name,
              productCode: docData.productCode,
              quantityInStock: docData.quantityInStock,
              retailPrice: docData.retailPrice,
              wholesalePrice: docData.wholesalePrice,
              productCategoryId: docData.productCategoryId,
              category: docData.category,
              productTaxes: docData.productTaxes,
              quantity: docData.quantity,
              usageDuration: docData.usageDuration
            };
            this.products.push(pushItem);
          });
          this.loadItems();
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    });
  }

  addProduct(product: Product) {
    if (product.productCode !== '') {
      this.productsService.addProduct(product);
    }
  }

  onAddClick({ sender }) {
    this.disableGrid = true;
    this.router.navigate(['/management/catalogue/products', { outlets: { 'action-panel': ['edit-product', '', ''] } }]);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.disableGrid = true;
    this.router.navigate([
      '/management/catalogue/products',
      { outlets: { 'action-panel': ['edit-product', dataItem.category.name, dataItem.productId] } }
    ]);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    const product: Product = formGroup.value;
    if (isNew) {
      this.productsService.addProduct(product).subscribe(() => {
        this.refreshData();
      });
    } else {
      this.productsService.updateProduct(product).subscribe(() => {
        this.refreshData();
      });
    }
    sender.closeRow(rowIndex);
  }

  openManageCategoryDialog(): void {
    const dialogRef = this.manageCategoriesDialog.open(ManageCategoriesDialogComponent, {
      width: '600px',
      height: '300px',
      data: CategoryType.Product
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshData();
    });
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
            productId: dataItem.productId,
            name: dataItem.name,
            productCode: dataItem.productCode,
            quantityInStock: dataItem.quantityInStock,
            retailPrice: dataItem.retailPrice,
            wholesalePrice: dataItem.wholesalePrice,
            productCategoryId: dataItem.productCategoryId,
            category: dataItem.category,
            productTaxes: dataItem.productTaxes,
            quantity: dataItem.quantity,
            usageDuration: dataItem.usageDuration
          };
          this.productsService.removeProduct(dataItemToRemove).subscribe(() => {
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
      data: this.products.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
      total: this.products.length
    };
  }
}
