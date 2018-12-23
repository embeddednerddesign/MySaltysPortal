import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../../models/product-category';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from '../../../models/product';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-catalogue-products',
  templateUrl: './catalogue-products.component.html',
  styleUrls: ['./catalogue-products.component.less']
})
export class CatalogueProductsComponent implements OnInit {

  categories: ProductCategory[] = [];

  loading = false;

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

  editedDataItem: ProductCategory;

  constructor(private productService: ProductsService) { }

  ngOnInit() {
    // this.addService();
    this.loading = true;
    this.refreshData();
  }
  refreshData() {
    this.categories = [];
    this.productService.getProductCategories().subscribe(res => {
      res.forEach(doc => {
        const docData = doc;
        const pushItem: ProductCategory = {
          productCategoryId: docData.productCategoryId,
          name: docData.name,
        };
        this.categories.push(pushItem);
      });
      this.loadItems();
      this.loading = false;
    });
  }


  onAddClick({sender}) {
    this.formGroup = new FormGroup({
      'name': new FormControl()
    });
    sender.addRow(this.formGroup);
  }

  public editHandler({sender, rowIndex, dataItem}) {
    this.editedDataItem = {productCategoryId: dataItem.productCategoryId, name: dataItem.name};
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
        'name': new FormControl(dataItem.name, Validators.required),
    });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    const product: Product = formGroup.value;
    if (isNew) {
      this.productService.addProductCategory(this.editedDataItem).subscribe(() => {
        this.refreshData();
      });
    }
    else {
      this.productService.updateProductCategory(this.editedDataItem).subscribe(() => {
        this.refreshData();
      });
    }
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem }) {
    this.productService.removeProductCategory(dataItem).subscribe(() => {
      this.refreshData();
    });
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  loadItems() {
    this.gridView = {
      data: this.categories.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
      total: this.categories.length
    };
  }
  categoriesDataStateChange(event) {}

}
