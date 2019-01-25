import * as moment from 'moment';
// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterViewChecked, HostListener } from '@angular/core';

@Component({
    selector: 'app-appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.less']
})
export class AppointmentsComponent implements OnInit, OnDestroy, AfterViewChecked {
    @HostListener('document:mousemove', ['$event'])
    onMouseMove(e) {
    }
    @HostListener('document:mousedown', ['$event'])
    onMouseDown(e) {
    }
    @HostListener('document:mouseup', ['$event'])
    onMouseUp(e) {
    }

    constructor() {
    }

    // angular lifecycle section
    ngOnInit() {
    }


    ngAfterViewChecked() {
    }

    ngOnDestroy() {
    }
}
