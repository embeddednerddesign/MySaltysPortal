import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { SimplePdfViewerComponent, SimplePDFBookmark } from 'simple-pdf-viewer';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { pdf } from '@progress/kendo-drawing';
import { ViewPdfDialogComponent } from '../../management/dialogs/view-pdf/view-pdf.component';
import { ResourceService } from '../../services/resource.service';
import { Resource } from '../../models/resource';

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

  constructor(private userService: UsersService,
              private resourceService: ResourceService,
              private confirmApptDialog: MatDialog
            ) { }


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
    this.loggedInUserName = this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName;
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
    this.resourceService.getResourceById(resourceId).subscribe(resource => {
      this.resourceService.contentSelected = true;
      this.selectedResource = resource;
      this.viewPDF('../../../../assets/' + this.selectedResource.path);
    });
  }
}
