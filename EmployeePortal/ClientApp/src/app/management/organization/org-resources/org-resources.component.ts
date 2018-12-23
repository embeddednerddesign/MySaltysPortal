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

@Component({
  selector: 'app-org-resources',
  templateUrl: './org-resources.component.html',
  styleUrls: ['./org-resources.component.less']
})
export class OrgResourcesComponent implements OnInit, OnDestroy {
  searchValue = '';
  disableGrid = false;
  loading = false;
  unsub: Subject<void> = new Subject<void>();
  resources: Resource[] = [];
  searchCtrl: FormControl;
  filteredResources: Observable<Resource[]>;

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

  constructor(private resourcesService: ResourcesService,
    private router: Router,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private deleteDialog: MatDialog) { 
    this.searchCtrl = new FormControl();
    this.filteredResources = this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        map(pack => this.filterResources(pack))
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

  filterResources(name: string) {
    let filterResults: Resource[] = [];

    if (name != '') {
      this.gridView = {
        data: this.resources.filter(rsrc =>
          (rsrc.name.toLowerCase().includes(name.toLowerCase()))).slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.resources.filter(rsrc =>
          (rsrc.name.toLowerCase().includes(name.toLowerCase()))).length
      };
      filterResults = this.resources.filter(rsrc =>
        (rsrc.name.toLowerCase().includes(name.toLowerCase())));
    }
    else{
      this.gridView = {
        data: this.resources.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.resources.length
      };
      filterResults = [];
    }

    return filterResults;
  }

  refreshData() {
    this.loading = true;      
    this.resources = [];
    this.resourcesService.getResources().subscribe(res => {
      res.forEach(doc => {
        const docData = doc;
        const pushItem: Resource = {
          resourceId: docData.resourceId,
          name: docData.name,
          resourceType: docData.resourceType
        };
        this.resources.push(pushItem);
      });
      this.loadItems();
      this.loading = false;      
    });
  }

  addResource(rsrc: Resource) {
    this.resourcesService.addResource(rsrc);
  }

  onAddClick({sender}) {
    this.disableGrid = true;
    this.router.navigate(['/management/organization/resources', { outlets: {'action-panel': ['edit-resource', '_']}}]);
  }

  public editHandler({sender, rowIndex, dataItem}) {
    this.disableGrid = true;
    this.router.navigate(['/management/organization/resources', { outlets: {'action-panel': ['edit-resource', dataItem.resourceId]}}]);
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    const rsrc: Resource = formGroup.value;
    if (isNew) {
      this.resourcesService.addResource(rsrc).subscribe(() => {
        this.refreshData();
      });
    }
    else {
      this.resourcesService.updateResource(rsrc).subscribe(() => {
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
      if (result == 'delete') {
        const dataItemToRemove = {
          resourceId: dataItem.resourceId,
          name: dataItem.name,
          resourceType: dataItem.resourceType
        };
        this.resourcesService.removeResource(dataItemToRemove).subscribe(() => {
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
      data: this.resources.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
      total: this.resources.length
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



