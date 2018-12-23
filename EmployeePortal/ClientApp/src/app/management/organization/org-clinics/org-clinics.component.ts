import { Component, OnInit } from '@angular/core';
import { Resource } from '../../../models/resource';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CatalogueUpdatesService } from '../../../services/catalogueupdates.service';
import { ConfirmDeleteDialogComponent } from '../../dialogs/confirm-delete/confirm-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs/Subject';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { ResourcesService } from '../../../services/resources.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ClinicsService } from '../../../services/clinics.service';
import { Clinic } from '../../../models/clinic';
import { Address } from '../../../models/address';

@Component({
  selector: 'app-org-clinics',
  templateUrl: './org-clinics.component.html',
  styleUrls: ['./org-clinics.component.less']
})
export class OrgClinicsComponent implements OnInit, OnDestroy {
  searchValue = '';
  disableGrid = false;
  loading = false;
  unsub: Subject<void> = new Subject<void>();
  clinics: Clinic[] = [];
  searchCtrl: FormControl;
  filteredClinics: Observable<Clinic[]>;

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
  editedDataItem: Resource;

  constructor(private clinicsService: ClinicsService,
    private router: Router,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private deleteDialog: MatDialog) {
    this.searchCtrl = new FormControl();
    this.filteredClinics = this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        map(pack => this.filterClinics(pack))
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
    this.refreshData();
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  filterClinics(name: string) {
    let filterResults: Clinic[] = [];

    if (name !== '') {
      this.gridView = {
        data: this.clinics.filter(clinic =>
          (clinic.name.toLowerCase().includes(name.toLowerCase()))).slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.clinics.filter(clinic =>
          (clinic.name.toLowerCase().includes(name.toLowerCase()))).length
      };
      filterResults = this.clinics.filter(clinic =>
        (clinic.name.toLowerCase().includes(name.toLowerCase())));
    }
    else {
      this.gridView = {
        data: this.clinics.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.clinics.length
      };
      filterResults = [];
    }

    return filterResults;
  }

  refreshData() {
    this.loading = true;
    this.clinics = [];
    this.clinicsService.getClinics().subscribe(res => {
      res.forEach(doc => {
        const docData = doc;
        const pushItem: Clinic = {
          clinicId: docData.clinicId,
          name: docData.name,
          address: docData.address,
          clinicRooms: docData.clinicRooms,
          clinicTaxes: docData.clinicTaxes,
          companyId: docData.companyId
        };
        this.clinics.push(pushItem);
      });
      this.loadItems();
      this.loading = false;
    });
  }

  addClinic(clinic: Clinic) {
    this.clinicsService.addClinic(clinic);
  }

  onAddClick({sender}) {
    this.disableGrid = true;
    this.router.navigate(['/management/organization/clinics', { outlets: {'action-panel': ['edit-clinic', '_']}}]);
  }

  public editHandler({sender, rowIndex, dataItem}) {
    this.disableGrid = true;
    this.router.navigate(['/management/organization/clinics', { outlets: {'action-panel': ['edit-clinic', dataItem.clinicId]}}]);
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    const clinic: Clinic = formGroup.value;
    if (isNew) {
      this.clinicsService.addClinic(clinic).subscribe(() => {
        this.refreshData();
      });
    }
    else {
      this.clinicsService.updateClinic(clinic).subscribe(() => {
        this.refreshData();
      });
    }
    sender.closeRow(rowIndex);
  }

  public removeHandler({dataItem}) {
    let dialogRef = this.deleteDialog.open(ConfirmDeleteDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        const dataItemToRemove = {
          clinicId: dataItem.clinicId,
          name: dataItem.name,
          address: dataItem.address,
          clinicRooms: dataItem.clinicRooms,
          clinicTaxes: dataItem.clinicTaxes,
          companyId: dataItem.companyId
        };
        this.clinicsService.removeClinic(dataItemToRemove).subscribe(() => {
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
      data: this.clinics.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
      total: this.clinics.length
    };
  }

  openDeleteDialog(): void {
    let dialogRef = this.deleteDialog.open(ConfirmDeleteDialogComponent, {
      width: '250px',
      data: { result: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}



