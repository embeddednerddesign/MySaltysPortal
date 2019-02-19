import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { SimplePdfViewerComponent, SimplePDFBookmark } from 'simple-pdf-viewer';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { pdf } from '@progress/kendo-drawing';
import { ViewPdfDialogComponent } from '../../management/dialogs/view-pdf/view-pdf.component';
import { ResourceService } from '../../services/resource.service';
import { Resource } from '../../models/resource';
import { isNullOrUndefined } from 'util';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { AuthService } from '../../services/auth.service';
import { EditResourceDialogComponent } from '../../management/dialogs/edit-resource/edit-resource.component';
import { ConfirmDeleteDialogComponent } from '../../management/dialogs/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.less']
})
export class ResourcesComponent implements OnInit, OnDestroy {
  @ViewChild(SimplePdfViewerComponent) private pdfViewer: SimplePdfViewerComponent;

  loggedInUserName = '';
  frontOfHouseActive = true;
  bookmarks: SimplePDFBookmark[] = [];
  unsub: Subject<void> = new Subject<void>();
  resources: Resource[] = [];
  frontResources: Resource[] = [];
  backResources: Resource[] = [];
  activeResources: Resource[] = [];
  selectedResource: Resource;
  editing = false;
  loggedInUserRole = '';

  constructor(private userService: UsersService,
              private authService: AuthService,
              private resourceService: ResourceService,
              private confirmApptDialog: MatDialog,
              private deleteDialog: MatDialog) { }


  onFrontOfHouseClick() {
    this.frontOfHouseActive = true;
    this.activeResources = this.frontResources;
  }

  onBackOfHouseClick() {
    this.frontOfHouseActive = false;
    this.activeResources = this.backResources;
  }

  public viewPDF(pdfPath: string) {
    const dialogRef = this.confirmApptDialog.open(ViewPdfDialogComponent, {
      width: '75%',
      height: '100%',
      data: pdfPath
    });

    dialogRef.afterClosed().subscribe(result => { });

    return dialogRef;
  }

  ngOnInit() {
    if (isNullOrUndefined(this.userService.loggedInUser) || isNullOrEmptyString(this.userService.loggedInUser.firstName)) {
      this.authService.logout();
    }
    this.loggedInUserName = this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName;
    this.loggedInUserRole = this.userService.loggedInUser.role;
    this.resourceService.contentSelected = false;
    this.resourceService.getResources().subscribe(resources => {
      this.resources = resources;
      this.frontResources = this.resources.filter(r => r.type === 'front');
      this.backResources = this.resources.filter(r => r.type === 'back');
      this.activeResources = this.frontResources;
    });
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  onBackClick() {
    this.resourceService.contentSelected = false;
  }

  onResourceClick(resourceId) {
    if (!this.editing) {
      this.resourceService.getResourceById(resourceId).subscribe(resource => {
        this.resourceService.contentSelected = true;
        this.selectedResource = resource;
        this.viewPDF('../../../../assets/' + this.selectedResource.path);
      });
    }
  }

  addFrontResource() {
    this.addResource('front');
  }
  addBackResource() {
    this.addResource('back');
  }
  addResource(frontOrBack: string) {
    const dialogRef = this.confirmApptDialog.open(EditResourceDialogComponent, {
      width: '50%',
      height: '100%',
      data: frontOrBack
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resourceService.getResources().subscribe(rsrc => {
        this.resources = rsrc;
        this.frontResources = this.resources.filter(r => r.type === 'front');
        this.backResources = this.resources.filter(r => r.type === 'back');
        this.activeResources = this.frontResources;
      });
    });

    return dialogRef;
  }

  editResource(resource: Resource) {
    const dialogRef = this.confirmApptDialog.open(EditResourceDialogComponent, {
      width: '50%',
      height: '100%',
      data: resource
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resourceService.getResources().subscribe(rsrc => {
        this.resources = rsrc;
        this.frontResources = this.resources.filter(r => r.type === 'front');
        this.backResources = this.resources.filter(r => r.type === 'back');
        this.activeResources = this.frontResources;
      });
    });

    return dialogRef;
  }


  removeResource(dataItem) {
    const dialogRef = this.deleteDialog.open(ConfirmDeleteDialogComponent, {
      width: '50%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        const dataItemToRemove: Resource = {
          resourceId: dataItem.resourceId,
          title: dataItem.title,
          type: dataItem.type,
          description: dataItem.description,
          backgroundImage: '',
          path: dataItem.path,
          createdBy: dataItem.createdBy,
          createdOn: dataItem.createdOn
        };
        this.resourceService.removeResource(dataItemToRemove).subscribe(() => {
          this.resourceService.getResources().subscribe(rsrc => {
            this.resources = rsrc;
            this.frontResources = this.resources.filter(r => r.type === 'front');
            this.backResources = this.resources.filter(r => r.type === 'back');
            this.activeResources = this.frontResources;
          });
        });
      }
    });
  }

}
