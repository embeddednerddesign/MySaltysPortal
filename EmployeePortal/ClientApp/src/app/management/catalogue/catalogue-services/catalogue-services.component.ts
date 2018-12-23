import { Component, OnInit } from '@angular/core';
import { Service } from '../../../models/service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ServiceCategory } from '../../../models/service-category';
import { ServicesService } from '../../../services/services.service';

@Component({
  selector: 'app-catalogue-services',
  templateUrl: './catalogue-services.component.html',
  styleUrls: ['./catalogue-services.component.less']
})
export class CatalogueServicesComponent implements OnInit {

  categories: ServiceCategory[] = [];
  services: Service[] = [];

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

  editedDataItem: ServiceCategory;

  constructor(private servicesService: ServicesService) { }

  ngOnInit() {
    // this.addService();
    this.loading = true;
    this.refreshData();
  }

  refreshData() {
    this.categories = [];
    this.services = [];
    this.servicesService.getServiceCategories().subscribe(res => {
      res.forEach(doc => {
        const docData = doc;
        const pushItem: ServiceCategory = {
          serviceCategoryId: docData.serviceCategoryId,
          name: docData.name,
        };
        this.categories.push(pushItem);
      });
    });
    this.servicesService.getServices().subscribe(res => {
      res.forEach(scdoc => {
        const scdocData = scdoc;
        const scpushItem: Service = {
          serviceId: scdocData.serviceId,
          quantity: scdocData.quantity,
          serviceName: scdocData.serviceName,
          serviceCategoryId: scdocData.serviceCategoryId,
          category: scdocData.category,
          serviceReqProductsString: scdocData.serviceReqProductsString,
          serviceRecProductsString: scdocData.serviceRecProductsString
    };
        this.services.push(scpushItem);
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

  public editHandler({ sender, rowIndex, dataItem }) {
    this.editedDataItem = { serviceCategoryId: dataItem.serviceCategoryId, name: dataItem.name };
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
    const serviceCat: ServiceCategory = formGroup.value;
    if (isNew) {
      this.servicesService.addServiceCategory(serviceCat).subscribe(() => {
        this.refreshData();
      });
    }
    else {
      this.servicesService.updateServiceCategory(serviceCat).subscribe(() => {
        this.refreshData();
      });
    }
    sender.closeRow(rowIndex);
  }

  public removeHandler({dataItem}) {
    this.servicesService.removeServiceCategory(dataItem).subscribe(() => {
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
      data: this.services.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
      total: this.services.length
    };
  }
  categoriesDataStateChange(event) {}
}
