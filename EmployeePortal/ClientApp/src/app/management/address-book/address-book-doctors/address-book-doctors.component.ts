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
import { Doctor } from '../../../models/doctor';
import { DoctorsService } from '../../../services/doctors.service';

@Component({
  selector: 'app-address-book-doctors',
  templateUrl: './address-book-doctors.component.html',
  styleUrls: ['./address-book-doctors.component.less']
})
export class AddressBookDoctorsComponent implements OnInit, OnDestroy {

  searchValue = '';
  loading = false;
  disableGrid = false;
  unsub: Subject<void> = new Subject<void>();
  doctors: Doctor[] = [];
  searchCtrl: FormControl;
  filteredDoctors: Observable<Doctor[]>;

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
  editedDataItem: Doctor;

  constructor(private doctorsService: DoctorsService,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private deleteDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) {
    this.searchCtrl = new FormControl();
    this.filteredDoctors = this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        map(pack => this.filterDoctors(pack))
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

  filterDoctors(name: string) {
    let filterResults: Doctor[] = [];
    var searchArgs: string[] =[];
    searchArgs = name.split(" ", 2);

    if (searchArgs[0] !== '') {
      this.gridView = {
        data: this.doctors.filter(doctor =>
          (((doctor.firstName.toLowerCase().includes(searchArgs[0].toLowerCase())) || (doctor.lastName.toLowerCase().includes(searchArgs[0].toLowerCase()))) &&
          (searchArgs[1] == undefined || searchArgs[1] == '' || ((doctor.firstName.toLowerCase().includes(searchArgs[1].toLowerCase())) || (doctor.lastName.toLowerCase().includes(searchArgs[1].toLowerCase())))))).slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.doctors.filter(doctor =>
          (((doctor.firstName.toLowerCase().includes(searchArgs[0].toLowerCase())) || (doctor.lastName.toLowerCase().includes(searchArgs[0].toLowerCase()))) &&
          (searchArgs[1] == undefined || searchArgs[1] == '' || ((doctor.firstName.toLowerCase().includes(searchArgs[1].toLowerCase())) || (doctor.lastName.toLowerCase().includes(searchArgs[1].toLowerCase())))))).length
      };
      filterResults = this.doctors.filter(doctor =>
        (((doctor.firstName.toLowerCase().includes(searchArgs[0].toLowerCase())) || (doctor.lastName.toLowerCase().includes(searchArgs[0].toLowerCase()))) &&
          (searchArgs[1] == undefined || searchArgs[1] == '' || ((doctor.firstName.toLowerCase().includes(searchArgs[1].toLowerCase())) || (doctor.lastName.toLowerCase().includes(searchArgs[1].toLowerCase()))))));
    } else {
      this.gridView = {
        data: this.doctors.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.doctors.length
      };
      filterResults = [];
    }
    return filterResults;
  }

  refreshData() {
    this.loading = true;
    this.doctors = [];
    this.doctorsService.getDoctors().subscribe(res => {
      res.forEach(doc => {
        const docData = doc;
        const pushItem: Doctor = {
          doctorId: docData.doctorId,
          proTitle: docData.proTitle,
          firstName: docData.firstName,
          lastName: docData.lastName,
          address: docData.address,
          phoneNumber: docData.phoneNumber,
          faxNumber: docData.faxNumber,
          email: docData.email,
          website: docData.website,
          hoursOfOperation: docData.hoursOfOperation,
          specialty: docData.specialty
        };
        this.doctors.push(pushItem);
      });
      this.loadItems();
      this.loading = false;
    });
  }

  onAddClick({sender}) {
    this.disableGrid = true;
    this.router.navigate(['/management/address-book/doctors', { outlets: {'action-panel': ['edit-doctor', '_']}}]);
  }

  public editHandler({sender, rowIndex, dataItem}) {
    this.disableGrid = true;
    this.router.navigate(['/management/address-book/doctors', { outlets: {'action-panel': ['edit-doctor', dataItem.doctorId]}}]);
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    const doctor: Doctor = formGroup.value;
    if (isNew) {
      this.doctorsService.addDoctor(doctor).subscribe(() => {
        this.refreshData();
      });
    }
    else {
      this.doctorsService.updateDoctor(doctor).subscribe(() => {
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
          doctorId: dataItem.doctorId,
          proTitle: dataItem.proTitle,
          firstName: dataItem.firstName,
          lastName: dataItem.lastName,
          address: dataItem.address,
          phoneNumber: dataItem.phoneNumber,
          faxNumber: dataItem.faxNumber,
          email: dataItem.email,
          website: dataItem.website,
          hoursOfOperation: dataItem.hoursOfOperation,
          specialty: dataItem.specialty
        };
        this.doctorsService.removeDoctor(dataItemToRemove).subscribe(() => {
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
      data: this.doctors.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
      total: this.doctors.length
    };
  }
}
