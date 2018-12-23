import {
    Component,
    OnInit,
    Input,
    ViewChild,
    EventEmitter,
    Output,
    OnDestroy,
    AfterViewInit
  } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';
import { CompanyService } from '../services/company.service';
import { Company } from '../models/company';

@Component({
  selector: 'app-calnav-noheader',
  templateUrl: './calnavnoheader.component.html',
  styleUrls: ['./calnavnoheader.component.less']
})
export class CalnavnoheaderComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() calendarNumber: Number;
  @Input() company: Company;
  @ViewChild('myCalendar') myCalendar: any;
  @Output() changeDate = new EventEmitter<string>();
  adminOpen = false;
  scheduleOpen = false;
  selectedDate: Date;
  unsub = new Subject<void>();

  constructor(private _eventService: EventsService) { }

  ngOnInit() {
    this._eventService.currentDate.takeUntil(this.unsub).subscribe(date => {
      this.selectedDate = date;
    });
    let today = new Date();
    if ( this.calendarNumber === 2) {
      const month = moment(today).month();
      today = moment(today).month(month + 1).toDate();
    } else if (this.calendarNumber === 3) {
      const month = moment(today).month();
      today = moment(today).month(month + 2).toDate();
    // } else if (this.calendarNumber === 4) {
    //   today.setMonth(today.getMonth() + 3);
    }
    this.myCalendar.startAt = today;
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  selectedChange = (event) => {
    this.selectedDate = event.toDate();
    this.changeDate.emit(event);
  }

  dateFilter = (date: moment.Moment) => {
    let dayOk = false;
    if (this.company) {
      const day = date.day();
      if (!this.company.hoursOfOperation.hoursOfOperationDays[day].closed) {
        dayOk = true;
      }
      return dayOk;
    } else {
      return dayOk;
    }
  }

  displayCalendar() {
    if (this.company) {
        return true;
    } else {
        return false;
    }
  }
}
