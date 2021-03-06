// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterViewChecked, HostListener, ViewChild, Pipe } from '@angular/core';
import { SimplePdfViewerComponent } from 'simple-pdf-viewer';
import { isNullOrUndefined } from 'util';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { ViewPdfDialogComponent } from '../../management/dialogs/view-pdf/view-pdf.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.less']
})
export class AppointmentsComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild(SimplePdfViewerComponent) private pdfViewer: SimplePdfViewerComponent;

  pdfPath: string;
  frontOfHouseActive = true;
  thisWeekActive = true;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e) {
  }
  @HostListener('document:mousedown', ['$event'])
  onMouseDown(e) {
  }
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(e) {
  }

  constructor(private userService: UsersService,
              private authService: AuthService,
              private confirmApptDialog: MatDialog,
              ) {}

  // angular lifecycle section
  ngOnInit() {
    if (isNullOrUndefined(this.userService.loggedInUser) || isNullOrEmptyString(this.userService.loggedInUser.firstName)) {
      this.authService.logout();
    }
    this.frontOfHouseActive = true;
    this.thisWeekActive = true;
    this.pdfPath = '../../../../assets/schedules/ThisWeekFrontSchedule.pdf';
  }

  ngAfterViewChecked() {
  }

  ngOnDestroy() {
  }

  onThisWeekClick() {
    this.thisWeekActive = true;
    if (this.frontOfHouseActive === true) {
      this.viewPDF('../../../../assets/schedules/LastWeekBackSchedule.pdf');
    } else {
      this.viewPDF('../../../../assets/schedules/LastWeekBackSchedule.pdf');
    }
  }

  onLastWeekClick() {
    this.thisWeekActive = false;
    if (this.frontOfHouseActive === true) {
      this.viewPDF('../../../../assets/schedules/LastWeekBackSchedule.pdf');
    } else {
      this.viewPDF('../../../../assets/schedules/LastWeekBackSchedule.pdf');
    }
  }

  onFrontClick() {
    this.frontOfHouseActive = true;
    if (this.thisWeekActive === true) {
      this.viewPDF('../../../../assets/schedules/LastWeekBackSchedule.pdf');
    } else {
      this.viewPDF('../../../../assets/schedules/LastWeekBackSchedule.pdf');
    }
  }

  onBackClick() {
    this.frontOfHouseActive = false;
    if (this.thisWeekActive === true) {
      this.viewPDF('../../../../assets/schedules/LastWeekBackSchedule.pdf');
    } else {
      this.viewPDF('../../../../assets/schedules/LastWeekBackSchedule.pdf');
    }
  }

  onThisWeekClickMobile() {
    this.thisWeekActive = true;
    if (this.frontOfHouseActive === true) {
      this.pdfViewer.openDocument('../../../../assets/schedules/ThisWeekFrontSchedule.pdf');
    } else {
      this.pdfViewer.openDocument('../../../../assets/schedules/ThisWeekBackSchedule.pdf');
    }
  }

  onLastWeekClickMobile() {
    this.thisWeekActive = false;
    if (this.frontOfHouseActive === true) {
      this.pdfViewer.openDocument('../../../../assets/schedules/LastWeekFrontSchedule.pdf');
    } else {
      this.pdfViewer.openDocument('../../../../assets/schedules/LastWeekBackSchedule.pdf');
    }
  }

  onFrontClickMobile() {
    this.frontOfHouseActive = true;
    if (this.thisWeekActive === true) {
      this.pdfViewer.openDocument('../../../../assets/schedules/ThisWeekFrontSchedule.pdf');
    } else {
      this.pdfViewer.openDocument('../../../../assets/schedules/LastWeekFrontSchedule.pdf');
    }
  }

  onBackClickMobile() {
    this.frontOfHouseActive = false;
    if (this.thisWeekActive === true) {
      this.pdfViewer.openDocument('../../../../assets/schedules/ThisWeekBackSchedule.pdf');
    } else {
      this.pdfViewer.openDocument('../../../../assets/schedules/LastWeekBackSchedule.pdf');
    }
  }

  public viewPDF(pdfPath: string) {
    const dialogRef = this.confirmApptDialog.open(ViewPdfDialogComponent, {
      width: '95%',
      height: '100%',
      data: pdfPath
    });

    dialogRef.afterClosed().subscribe(result => { });

    return dialogRef;
  }

}
