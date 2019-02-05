import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { SimplePdfViewerComponent, SimplePDFBookmark } from 'simple-pdf-viewer';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { pdf } from '@progress/kendo-drawing';
import { ViewPdfDialogComponent } from '../../management/dialogs/view-pdf/view-pdf.component';

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

  constructor(private userService: UsersService,
              private confirmApptDialog: MatDialog
            ) { }


  onFrontOfHouseClick() {
    this.frontOfHouseActive = true;
  }

  onBackOfHouseClick() {
    this.frontOfHouseActive = false;
  }

  onResourceClick() {
    // this.viewPDF('../../../../assets/resources/test.pdf');
    this.viewPDF('../../../../assets/schedules/testschedule.pdf');
  }


  public viewPDF(pdfPath: string) {
    const dialogRef = this.confirmApptDialog.open(ViewPdfDialogComponent, {
      width: '50%',
      height: '100%',
      data: pdfPath
    });

    dialogRef.afterClosed().subscribe(result => { });

    return dialogRef;
  }

  ngOnInit() {
    this.loggedInUserName = this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName;
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

}
