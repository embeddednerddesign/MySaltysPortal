import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Service } from '../../../../models/service';
import { ServiceCategory, ServiceIDColour, ServiceTemplateIcon } from '../../../../models/service-category';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

import { CatalogueUpdatesService } from '../../../../services/catalogueupdates.service';
import { ConfirmDeleteDialogComponent } from '../../../dialogs/confirm-delete/confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs/Subject';
import { ServicesService } from '../../../../services/services.service';
import { ManageCategoriesDialogComponent } from '../../../dialogs/manage-categories/manage-categories.component';
import { CategoryType } from '../../../../models/category-type';

@Component({
  selector: 'app-service-category-details',
  templateUrl: './service-category-details.component.html',
  styleUrls: ['./service-category-details.component.less']
})
export class ServiceCategoryDetailsComponent implements OnInit, OnDestroy {
  @Input()
  public category: ServiceCategory;
  searchValue = '';
  testColor = 'red';
  loading = false;
  disableGrid = false;
  unsub: Subject<void> = new Subject<void>();
  categories: ServiceCategory[] = [];
  services: Service[] = [];
  searchCtrl: FormControl;
  colorCtrl: FormControl;
  filteredServices: Observable<Service[]>;
  public categoriesDropDown: ServiceCategory[] = [];
  public serviceIDColoursDropDown: Array<ServiceIDColour> = [];
  public templateIconsDropDown: Array<ServiceTemplateIcon> = [];

  public currentTemplateIcon = 'fa fa-cog';

  public checkedtest = true;

  // service categories
  serviceCategory: ServiceCategory[] = [{ serviceCategoryId: 0, name: 'Consultations' }, { serviceCategoryId: 0, name: 'Applications' }];

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
  editedDataItem: Service;

  constructor(
    private servicesService: ServicesService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private manageCategoriesDialog: MatDialog,
    private deleteDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchCtrl = new FormControl();
    this.colorCtrl = new FormControl();
    this.filteredServices = this.searchCtrl.valueChanges.pipe(
      startWith(''),
      map(service => this.filterServices(service))
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
    this.getServiceIDColoursList();
    this.getTemplateIconsList();
    this.getCategoryList();
    this.refreshData();
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  getTemplateIconsList() {
    this.templateIconsDropDown = [
      { serviceTemplateIconId: 0, icon: 'fas fa-syringe' },
      { serviceTemplateIconId: 0, icon: 'fas fa-neuter' },
      { serviceTemplateIconId: 0, icon: 'fas fa-child' },
      { serviceTemplateIconId: 0, icon: 'fas fa-user-md' }
    ];
  }

  getServiceIDColoursList() {
    this.serviceIDColoursDropDown = [
      { serviceIDColourId: 0, colour: 'Red' },
      { serviceIDColourId: 0, colour: 'Orange' },
      { serviceIDColourId: 0, colour: 'Yellow' },
      { serviceIDColourId: 0, colour: 'Green' },
      { serviceIDColourId: 0, colour: 'Blue' },
      { serviceIDColourId: 0, colour: 'Indigo' },
      { serviceIDColourId: 0, colour: 'Violet' }
    ];
  }

  getCategoryList() {
    this.categoriesDropDown = [];
    this.servicesService.getServiceCategories().subscribe(res => {
      res.forEach(doc => {
        const docData = doc;
        const pushItem: ServiceCategory = {
          serviceCategoryId: docData.serviceCategoryId,
          name: docData.name
        };
        this.categoriesDropDown.push(pushItem);
      });
    });
  }

  filterServices(name: string) {
    let filterResults: Service[] = [];

    if (name !== '') {
      this.gridView = {
        data: this.services
          .filter(service => service.serviceName.toLowerCase().includes(name.toLowerCase()))
          .slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.services.filter(service => service.serviceName.toLowerCase().indexOf(name.toLowerCase())).length
      };
      filterResults = this.services.filter(service => service.serviceName.toLowerCase().includes(name.toLowerCase()));
    } else {
      this.gridView = {
        data: this.services.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.services.length
      };
      filterResults = [];
    }
    return filterResults;
  }

  refreshData() {
    // show loading indicator
    this.loading = true;
    this.categories = [];
    this.services = [];
    this.servicesService.getServiceCategories().subscribe(res => {
      if (res.length > 0) {
        res.forEach(doc => {
          const docData = doc;
          const pushItem: ServiceCategory = {
            serviceCategoryId: docData.serviceCategoryId,
            name: docData.name
          };
          this.categories.push(pushItem);
        });
        this.servicesService.getServices().subscribe(result => {
          result.forEach(scdoc => {
            const scdocData = scdoc;
            const scpushItem: Service = {
              serviceId: scdocData.serviceId,
              quantity: scdocData.quantity,
              serviceIDColour: scdocData.serviceIDColour,
              templateIcon: scdocData.templateIcon,
              serviceName: scdocData.serviceName,
              serviceAltName: scdocData.serviceAltName,
              diagnosticCode: scdocData.diagnosticCode,
              subType: scdocData.subType,
              status: scdocData.status,
              serviceCategoryId: scdocData.serviceCategoryId,
              category: scdocData.category,
              defaultDurationMinutes: scdocData.defaultDurationMinutes,
              defaultPrice: scdocData.defaultPrice,
              billingCode: scdocData.billingCode,
              governmentBilling: scdocData.governmentBilling,
              serviceReqProductsString: scdocData.serviceReqProductsString,
              serviceRecProductsString: scdocData.serviceRecProductsString
                };
            this.services.push(scpushItem);
          });
          this.loadItems();
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    });
  }

  addService(service: Service) {
    if (service.diagnosticCode !== 0) {
      this.servicesService.addService(service);
    }
  }

  onAddClick({ sender }) {
    this.disableGrid = true;
    this.router.navigate(['/management/catalogue/services', { outlets: { 'action-panel': ['edit-service', '', ''] } }]);
  }

  public onStatusValueChange(sender, dataItem) {
    const service: Service = dataItem;
    this.servicesService.updateService(service).subscribe(() => {});
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.disableGrid = true;
    this.router.navigate([
      '/management/catalogue/services',
      {
        outlets: {
          'action-panel': ['edit-service', dataItem.category.name, dataItem.serviceId]
        }
      }
    ]);
  }

  openManageCategoryDialog(): void {
    const dialogRef = this.manageCategoriesDialog.open(ManageCategoriesDialogComponent, {
      width: '600px',
      height: '300px',
      data: CategoryType.Service
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshData();
    });
  }

  openManageUserServicesDialog(): void {
    const dialogRef = this.manageCategoriesDialog.open(ManageCategoriesDialogComponent, {
      width: '600px',
      height: '300px',
      data: CategoryType.Service
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
            serviceId: dataItem.serviceId,
            quantity: dataItem.quantity,
            serviceIDColour: dataItem.serviceIDColour,
            templateIcon: dataItem.templateIcon,
            serviceName: dataItem.serviceName,
            serviceAltName: dataItem.serviceAltName,
            diagnosticCode: dataItem.code,
            serviceCategoryId: dataItem.serviceCategoryId,
            category: dataItem.category,
            subType: dataItem.subType,
            status: dataItem.status,
            defaultDurationMinutes: dataItem.defaultDurationMinutes,
            defaultPrice: dataItem.defaultPrice,
            billingCode: dataItem.billingCode,
            governmentBilling: dataItem.governmentBilling,
            taxes: dataItem.taxes,
            serviceReqProductsString: dataItem.serviceReqProductsString,
            serviceRecProductsString: dataItem.serviceRecProductsString
            };
          this.servicesService.removeService(dataItemToRemove).subscribe(() => {
            this.refreshData();
          });
        }
      });
  }

  loadItems() {
    this.gridView = {
      data: this.services.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
      total: this.services.length
    };
  }
}
