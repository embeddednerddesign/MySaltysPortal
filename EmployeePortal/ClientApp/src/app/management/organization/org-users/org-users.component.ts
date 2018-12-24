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
import { User } from '../../../models/user';
import { UsersService } from '../../../services/users.service';
import { UserCategory } from '../../../models/user-category';

@Component({
  selector: 'app-org-users',
  templateUrl: './org-users.component.html',
  styleUrls: ['./org-users.component.less']
})
export class OrgUsersComponent implements OnInit {
  searchValue = '';
  disableGrid = false;
  loading = false;
  unsub: Subject<void> = new Subject<void>();
  users: User[] = [];
  searchCtrl: FormControl;
  filteredUsers: Observable<User[]>;

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
  editedDataItem: User;

  constructor(private usersService: UsersService,
    private router: Router,
    private catalogueUpdatesService: CatalogueUpdatesService,
    private deleteDialog: MatDialog) {
    this.searchCtrl = new FormControl();
    this.filteredUsers = this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        map(pack => this.filterUsers(pack))
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

  filterUsers(name: string) {
    let filterResults: User[] = [];
    let searchArgs: string[] = [];
    searchArgs = name.split(' ', 2);

    if (searchArgs[0] !== '') {
      this.gridView = {
        data: this.users.filter(user =>
          ((user.firstName.toLowerCase().includes(searchArgs[0].toLowerCase())) &&
          (searchArgs[1] === undefined || searchArgs[1] === '' || user.lastName.toLowerCase().includes(searchArgs[1].toLowerCase())))).slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.users.filter(user =>
          ((user.firstName.toLowerCase().includes(searchArgs[0].toLowerCase())) &&
          (searchArgs[1] === undefined || searchArgs[1] === '' || user.lastName.toLowerCase().includes(searchArgs[1].toLowerCase())))).length
      };
      filterResults = this.users.filter(user =>
        ((user.firstName.toLowerCase().includes(searchArgs[0].toLowerCase())) &&
        (searchArgs[1] === undefined || searchArgs[1] === '' || user.lastName.toLowerCase().includes(searchArgs[1].toLowerCase()))));
    } else {
      this.gridView = {
        data: this.users.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
        total: this.users.length
      };
      filterResults = [];
    }
    return filterResults;
  }

  refreshData() {
    this.loading = true;
    this.users = [];
    this.usersService.getUsers().subscribe(res => {
      res.forEach(doc => {
        const docData = doc;
        const pushItem: User = {
          id: docData.id,
          firstName: docData.firstName,
          lastName: docData.lastName,
          avatar: docData.avatar,
          role: docData.role,
          // password: docData.password,
          phoneNumber: docData.phoneNumber,
          email: docData.email,

          // addressId: docData.addressId,
          address: docData.address,
        };
        this.users.push(pushItem);
      });
      this.loadItems();
      this.loading = false;
    });
  }

  // addResource(user: User) {
  //   this.usersService.addUser(user);
  // }

  onAddClick({sender}) {
    this.disableGrid = true;
    this.router.navigate(['/management/organization/users', { outlets: {'action-panel': ['edit-user', '_']}}]);
  }

  public editHandler({sender, rowIndex, dataItem}) {
    this.disableGrid = true;
    this.router.navigate(['/management/organization/users', { outlets: {'action-panel': ['edit-user', dataItem.id]}}]);
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    const user: User = formGroup.value;
    // if (isNew) {
    //   this.usersService.addUser(user).subscribe(() => {
    //     this.refreshData();
    //   });
    // } else {
      this.usersService.updateUser(user).subscribe(() => {
        this.refreshData();
      });
    // }
    sender.closeRow(rowIndex);
  }

  public removeHandler({dataItem}) {
    const dialogRef = this.deleteDialog.open(ConfirmDeleteDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        const dataItemToRemove = {
          id: dataItem.id,
          firstName: dataItem.firstName,
          lastName: dataItem.lastName,
          avatar: dataItem.avatar,
          role: dataItem.role,
          password: dataItem.password,
          phoneNumber: dataItem.phoneNumber,
          email: dataItem.email,
          // addressId: dataItem.addressId,
          address: dataItem.address,
        };
        this.usersService.removeUser(dataItemToRemove).subscribe(() => {
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
      data: this.users.slice(this.gridState.skip, this.gridState.skip + this.gridState.take),
      total: this.users.length
    };
  }

  openDeleteDialog(): void {
    const dialogRef = this.deleteDialog.open(ConfirmDeleteDialogComponent, {
      width: '250px',
      data: { result: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}



