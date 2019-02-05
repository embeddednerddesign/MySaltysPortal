// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterViewChecked, HostListener, ViewChild, Pipe } from '@angular/core';
import { SimplePdfViewerComponent } from 'simple-pdf-viewer';

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

  constructor() {}

  // angular lifecycle section
  ngOnInit() {
    this.frontOfHouseActive = true;
    this.thisWeekActive = true;
    this.pdfPath = '../../../../assets/schedules/thisweekfront.pdf';
  }

  ngAfterViewChecked() {
  }

  ngOnDestroy() {
  }

  onThisWeekClick() {
    this.thisWeekActive = true;
    if (this.frontOfHouseActive === true) {
      this.pdfViewer.openDocument('../../../../assets/schedules/thisweekfront.pdf');
    } else {
      this.pdfViewer.openDocument('../../../../assets/schedules/thisweekback.pdf');
    }
  }

  onLastWeekClick() {
    this.thisWeekActive = false;
    if (this.frontOfHouseActive === true) {
      this.pdfViewer.openDocument('../../../../assets/schedules/lastweekfront.pdf');
    } else {
      this.pdfViewer.openDocument('../../../../assets/schedules/lastweekback.pdf');
    }
  }

  onFrontClick() {
    this.frontOfHouseActive = true;
    if (this.thisWeekActive === true) {
      this.pdfViewer.openDocument('../../../../assets/schedules/thisweekfront.pdf');
    } else {
      this.pdfViewer.openDocument('../../../../assets/schedules/lastweekfront.pdf');
    }
  }

  onBackClick() {
    this.frontOfHouseActive = false;
    if (this.thisWeekActive === true) {
      this.pdfViewer.openDocument('../../../../assets/schedules/thisweekback.pdf');
    } else {
      this.pdfViewer.openDocument('../../../../assets/schedules/lastweekback.pdf');
    }
  }

}
