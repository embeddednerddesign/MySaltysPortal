import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Pharmacy } from '../../../models/pharmacy';
import { PharmaciesService } from '../../../services/pharmacies.service';

@Component({
  selector: 'app-address-book-pharmacies',
  templateUrl: './address-book-pharmacies.component.html',
  styleUrls: ['./address-book-pharmacies.component.less']
})
export class AddressBookPharmaciesComponent implements OnInit, OnDestroy {

  searchValue = '';
  loading = false;
  disableGrid = false;
  unsub: Subject<void> = new Subject<void>();
  pharmacies: Pharmacy[] = [];
  searchCtrl: FormControl;
  filteredPharmacies: Observable<Pharmacy[]>;

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
  editedDataItem: Pharmacy;

  constructor(private pharmaciesService: PharmaciesService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private deleteDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) {
    this.searchCtrl = new FormControl();
    this.filteredPharmacies = this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        map(pack => this.filterPharmacies(pack))
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
    this.refreshData();
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  filterPharmacies(name: string) {
    let filterResults: Pharmacy[] = [];
    if (name !== '') {
      this.gridView = {
        data: this.pharmacies.filter(pharmacy =>
          // tslint:disable-next-line:max-line-length
          ((pharmacy.name.toLowerCase().includes(name.toLowerCase())))).slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.pharmacies.filter(pharmacy =>
          ((pharmacy.name.toLowerCase().includes(name.toLowerCase())))).length
      };
      filterResults = this.pharmacies.filter(pharmacy =>
        (pharmacy.name.toLowerCase().includes(name.toLowerCase())));
    } else {
      this.gridView = {
        data: this.pharmacies.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.pharmacies.length
      };
      filterResults = [];
    }
    return filterResults;
  }

  refreshData() {
    this.loading = true;
    this.pharmacies = [];
    this.pharmaciesService.getPharmacies().subscribe(res => {
      res.forEach(doc => {
        const docData = doc;
        const pushItem: Pharmacy = {
          pharmacyId: docData.pharmacyId,
          name: docData.name,
          address: docData.address,
          phoneNumber1: docData.phoneNumber1,
          phoneNumber2: docData.phoneNumber2,
          phoneNumber3: docData.phoneNumber3,
          faxNumber: docData.faxNumber,
          email: docData.email,
          website: docData.website,
          hoursOfOperation: docData.hoursOfOperation
        };
        this.pharmacies.push(pushItem);
      });
      this.loadItems();
      this.loading = false;
    });
  }

  onAddClick({sender}) {
    this.disableGrid = true;
    this.router.navigate(['/management/address-book/pharmacies', { outlets: {'action-panel': ['edit-pharmacy', '_']}}]);
  }

  public editHandler({sender, rowIndex, dataItem}) {
    this.disableGrid = true;
    this.router.navigate(['/management/address-book/pharmacies', { outlets: {'action-panel': ['edit-pharmacy', dataItem.pharmacyId]}}]);
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    const pharmacy: Pharmacy = formGroup.value;
    if (isNew) {
      this.pharmaciesService.addPharmacy(pharmacy).subscribe(() => {
        this.refreshData();
      });
    } else {
      this.pharmaciesService.updatePharmacy(pharmacy).subscribe(() => {
        this.refreshData();
      });
    }
    sender.closeRow(rowIndex);
  }


  public removeHandler({dataItem}) {
    const dialogRef = this.deleteDialog.open(ConfirmDeleteDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().takeUntil(this.unsub).subscribe(result => {
      if (result === 'delete') {
        const dataItemToRemove = {
          pharmacyId: dataItem.pharmacyId,
          name: dataItem.name,
          address: dataItem.address,
          phoneNumber1: dataItem.phoneNumber1,
          phoneNumber2: dataItem.phoneNumber2,
          phoneNumber3: dataItem.phoneNumber3,
          faxNumber: dataItem.faxNumber,
          email: dataItem.email,
          website: dataItem.website,
          hoursOfOperation: dataItem.hoursOfOperation
        };
        this.pharmaciesService.removePharmacy(dataItemToRemove).subscribe(() => {
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
      data: this.pharmacies.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
      total: this.pharmacies.length
    };
  }
}
