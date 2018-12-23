import * as moment from 'moment';
import { Component, OnInit, ViewChild, HostListener, AfterViewInit, Input } from '@angular/core';
import { EventsService } from '../services/events.service';
import { Subject } from 'rxjs/Subject';
import { StaffsService } from '../services/staffs.service';
import { Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { Company } from '../models/company';
import { CurrentDataService } from '../services/currentData.service';

@Component({
  selector: 'app-calnav',
  templateUrl: './calnav.component.html',
  styleUrls: ['./calnav.component.less']
})
export class CalnavComponent implements OnInit, AfterViewInit {
  @Input() company: Company;

  monthInFirstCal: number = null;
  nextButtons: any;
  prevButtons: any;
  staffCount: number;
  adminOpen = false;
  unsub: Subject<void> = new Subject<void>();

  scheduleOpen = false;
  currentDate: Date;
  firstDate: Date;
  lastDate: Date;

  monthsAway = 0;

  constructor(private _eventsService: EventsService,
    public currentDataService: CurrentDataService,
    private router: Router) {
  }

  ngOnInit() {
    this.nextButtons = document.querySelectorAll('.mat-calendar-next-button');
    this.prevButtons = document.querySelectorAll('.mat-calendar-previous-button');
    this.nextButtons[0].addEventListener('click', this.nextClicked);
    this.prevButtons[0].addEventListener('click', this.prevClicked);
    this._eventsService.setSelectedDate(new Date(Date.now()));
    const month = moment(new Date(Date.now())).format('M');
    const year = moment(new Date(Date.now())).format('Y');
    this.firstDate = this.getFirstDate(year, month);
    this.lastDate = this.getLastDate(year, month);
    this._eventsService.currentDate.takeUntil(this.unsub).subscribe(value => {
      this.currentDate = value;
    });
    const _resources = [];
    this.currentDataService.staff.forEach(staff => {
        const staffData = staff;
        _resources.push({ id: staffData.staffId, title: staffData.name });
    });
    this.staffCount = _resources.length;
  }

  ngAfterViewInit() {
  }

  dateFilter = (date: moment.Moment) =>  {
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

  getLastDate(year, month) {
    if (+month === 12) {
      month = 1;
      year = +year + 1;
    }
    else {
      month = +month + 1;
    }
    return moment([+year, +month]).endOf('month').toDate();
  }

  getFirstDate(year, month) {
    if (+month === 1) {
      month = 12;
      year = +year - 1;
    }
    else {
      month = +month - 1;
    }
    return moment([+year, +month]).toDate();
  }

  nextClicked = () => {
    this.nextButtons[1].click();
    this.nextButtons[2].click();
  }

  prevClicked = () => {
    this.prevButtons[1].click();
    this.prevButtons[2].click();
  }

  selectedChange = (event) => {
    this.clearSelections();
    this._eventsService.setSelectedDate(event.toDate());
  }

  goBackOneMonth(updateSelectedDate) {
    this.lastDate = moment(this.lastDate).subtract(1, 'months').toDate();
    this.firstDate = moment(this.firstDate).subtract(1, 'month').toDate();
    this.clearSelections();
    this.prevButtons[0].click();
    this.monthsAway -= 1;
    let oneMonthBack = moment(this.currentDate).subtract(1, 'months').toDate();
    oneMonthBack = this.checkOpenClosedStatus(oneMonthBack);
    if (updateSelectedDate) {
      this._eventsService.setSelectedDate(oneMonthBack);
    }
  }

  goBackOneDay() {
    this.clearSelections();
    let oneDayBack = moment(this.currentDate).subtract(1, 'days').toDate();
    oneDayBack = this.checkOpenClosedStatus(oneDayBack);
    if (moment(oneDayBack).isBefore(this.firstDate)) {
      this.goBackOneMonth(false);
      this.goBackOneMonth(false);
      this.goBackOneMonth(false);
    }
    this._eventsService.setSelectedDate(oneDayBack);
  }

  gotoToday() {
    let todayDate = new Date(Date.now());
    todayDate.setHours(0, 0, 0, 0);
    todayDate = this.checkOpenClosedStatus(todayDate);
    const today = moment(todayDate);
    const current = this.currentDate;
    current.setHours(0, 0, 0, 0);
    if (todayDate.getTime() === current.getTime()) {
      return;
    }
    if (this.monthsAway < 0) {
      const monthsBehind = this.monthsAway * -1;
      for (let i = 0; i < monthsBehind; i++) {
        this.nextButtons[0].click();
        this.lastDate = moment(this.lastDate).add(1, 'months').toDate();
        this.firstDate = moment(this.firstDate).add(1, 'month').toDate();
      }
    } else if (this.monthsAway > 0) {
      const monthsAhead = this.monthsAway;
      for (let i = 0; i < monthsAhead; i++) {
        this.prevButtons[0].click();
        this.lastDate = moment(this.lastDate).subtract(1, 'months').toDate();
        this.firstDate = moment(this.firstDate).subtract(1, 'month').toDate();
      }
    }
    this.monthsAway = 0;
    this._eventsService.setSelectedDate(today.toDate());
  }

  goForwardOneDay() {
    this.clearSelections();
    let oneDayForward = moment(this.currentDate).add(1, 'days').toDate();
    oneDayForward = this.checkOpenClosedStatus(oneDayForward);
    if (moment(oneDayForward).isAfter(this.lastDate)) {
      this.goForwardOneMonth(false);
      this.goForwardOneMonth(false);
      this.goForwardOneMonth(false);
    }
    this._eventsService.setSelectedDate(oneDayForward);
  }

  goForwardOneMonth(updateSelectedDate) {
    this.lastDate = moment(this.lastDate).add(1, 'months').toDate();
    this.firstDate = moment(this.firstDate).add(1, 'month').toDate();
    this.clearSelections();
    this.monthsAway += 1;
    this.nextButtons[0].click();
    let oneMonthForward = moment(this.currentDate).add(1, 'months').toDate();
    oneMonthForward = this.checkOpenClosedStatus(oneMonthForward);
    if (updateSelectedDate) {
      this._eventsService.setSelectedDate(oneMonthForward);
    }
  }

  goForwardOneWeek() {
    this.clearSelections();
    let oneWeekForward = moment(this.currentDate).add(1, 'weeks').toDate();
    oneWeekForward = this.checkOpenClosedStatus(oneWeekForward);
    if (moment(oneWeekForward).isAfter(this.lastDate)) {
      this.goForwardOneMonth(false);
      this.goForwardOneMonth(false);
      this.goForwardOneMonth(false);
    }
    this._eventsService.setSelectedDate(oneWeekForward);
  }

  goBackOneWeek() {
    this.clearSelections();
    let oneWeekBack = moment(this.currentDate).subtract(1, 'weeks').toDate();
    oneWeekBack = this.checkOpenClosedStatus(oneWeekBack);
    if (moment(oneWeekBack).isBefore(this.firstDate)) {
      this.goBackOneMonth(false);
      this.goBackOneMonth(false);
      this.goBackOneMonth(false);
    }
    this._eventsService.setSelectedDate(oneWeekBack);
  }

  checkOpenClosedStatus(newDate) {
    let maxNumberOfDays = 365;
    while (maxNumberOfDays) {
      if (this.currentDataService.company.hoursOfOperation.hoursOfOperationDays[newDate.getDay()].closed) {
        maxNumberOfDays--;
        if (newDate > this.currentDate) {
          newDate = moment(newDate).add(1, 'days').toDate();
        }
        else {
          newDate = moment(newDate).subtract(1, 'days').toDate();
        }
      }
      else {
        maxNumberOfDays = 0;
      }
    }
    return newDate;
  }

  planningMode() {
    this._eventsService.planningMode = !this._eventsService.planningMode;
    if (this._eventsService.planningMode === true ) {
    } else {
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        this.goBackOneDay();
        break;
      case 'ArrowRight':
        this.goForwardOneDay();
        break;
      case 'ArrowUp':
        this.goBackOneWeek();
        break;
      case 'ArrowDown':
        this.goForwardOneWeek();
        break;
    }
  }
  scheduleViews() {
    if (this.router.url.includes('employee')) {
      this.router.navigate(['/schedule']);
    } else {
      this.router.navigate(['/schedule/employee-schedule']);
    }
  }

  displayCalendar() {
    if (this.company) {
      return true;
    } else {
      return false;
    }
  }

  clearSelections() {
    const calendarNodes = document.querySelectorAll('.mat-calendar-body-selected');
    const calendarList = Array.from(calendarNodes);
    calendarList.forEach(e => {
      e.classList.remove('mat-calendar-body-selected');
    });
  }
}
