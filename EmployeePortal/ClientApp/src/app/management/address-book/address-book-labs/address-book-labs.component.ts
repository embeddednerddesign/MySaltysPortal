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
import { Lab } from '../../../models/lab';
import { LabsService } from '../../../services/labs.service';

@Component({
  selector: 'app-address-book-labs',
  templateUrl: './address-book-labs.component.html',
  styleUrls: ['./address-book-labs.component.less']
})
export class AddressBookLabsComponent implements OnInit, OnDestroy {

  searchValue = '';
  loading = false;
  disableGrid = false;
  unsub: Subject<void> = new Subject<void>();
  labs: Lab[] = [];
  searchCtrl: FormControl;
  filteredLabs: Observable<Lab[]>;

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
  editedDataItem: Lab;

  constructor(private labsService: LabsService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private deleteDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) {
    this.searchCtrl = new FormControl();
    this.filteredLabs = this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        map(pack => this.filterLabs(pack))
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

  filterLabs(name: string) {
    let filterResults: Lab[] = [];

    if (name !== '') {
      this.gridView = {
        data: this.labs.filter(lab =>
          (lab.name.toLowerCase().includes(name.toLowerCase()))).slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.labs.filter(lab =>
          (lab.name.toLowerCase().includes(name.toLowerCase()))).length
      };
      filterResults = this.labs.filter(lab =>
        (lab.name.toLowerCase().includes(name.toLowerCase())));
    } else {
      this.gridView = {
        data: this.labs.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.labs.length
      };
      filterResults = [];
    }
    return filterResults;
  }

  refreshData() {
    this.loading = true;
    this.labs = [];
    this.labsService.getLabs().subscribe(res => {
      res.forEach(doc => {
        const docData = doc;
        const pushItem: Lab = {
          labId: docData.labId,
          name: docData.name,
          address: docData.address,
          phoneNumber1: docData.phoneNumber1,
          phoneNumber2: docData.phoneNumber2,
          phoneNumber3: docData.phoneNumber3,
          faxNumber: docData.faxNumber,
          email: docData.email,
          website: docData.website,
          hoursOfOperation: docData.hoursOfOperation,
          labType: docData.labType
        };
        this.labs.push(pushItem);
      });
      this.loadItems();
      this.loading = false;
    });
  }

  onAddClick({sender}) {
    this.disableGrid = true;
    this.router.navigate(['/management/address-book/labs', { outlets: {'action-panel': ['edit-lab', '_']}}]);
  }

  public editHandler({sender, rowIndex, dataItem}) {
    this.disableGrid = true;
    this.router.navigate(['/management/address-book/labs', { outlets: {'action-panel': ['edit-lab', dataItem.labId]}}]);
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    const lab: Lab = formGroup.value;
    if (isNew) {
      this.labsService.addLab(lab).subscribe(() => {
        this.refreshData();
      });
    }
    else {
      this.labsService.updateLab(lab).subscribe(() => {
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
          labId: dataItem.labId,
          name: dataItem.name,
          address: dataItem.address,
          phoneNumber1: dataItem.phoneNumber1,
          phoneNumber2: dataItem.phoneNumber2,
          phoneNumber3: dataItem.phoneNumber3,
          faxNumber: dataItem.faxNumber,
          email: dataItem.email,
          website: dataItem.website,
          hoursOfOperation: dataItem.hoursOfOperation,
          labType: dataItem.labType
        };
        this.labsService.removeLab(dataItemToRemove).subscribe(() => {
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
      data: this.labs.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
      total: this.labs.length
    };
  }
}
