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
    this.pdfPath = '../../../../assets/schedules/testschedule4.pdf';
  }

  ngAfterViewChecked() {
  }

  ngOnDestroy() {
  }

  onThisWeekFrontClick() {
    this.thisWeekActive = true;
    this.frontOfHouseActive = true;
    this.pdfViewer.openDocument('../../../../assets/schedules/testschedule3.pdf');
  }

  onThisWeekBackClick() {
    this.thisWeekActive = true;
    this.frontOfHouseActive = false;
    this.pdfViewer.openDocument('../../../../assets/schedules/testschedule4.pdf');
  }

  onLastWeekFrontClick() {
    this.thisWeekActive = false;
    this.frontOfHouseActive = true;
    this.pdfViewer.openDocument('../../../../assets/schedules/testschedule3.pdf');
  }

  onLastWeekBackClick() {
    this.thisWeekActive = false;
    this.frontOfHouseActive = false;
    this.pdfViewer.openDocument('../../../../assets/schedules/testschedule3.pdf');
  }

}
