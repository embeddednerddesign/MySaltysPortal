import * as moment from 'moment';
import { Component, OnInit, AfterViewChecked, ViewChild, ComponentFactoryResolver, Injector } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Event, StaffSchedule } from '../../models/scheduler/event';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company';
import { StaffsService } from '../../services/staffs.service';
import { AppointmentViewModel } from '../../models/appintment-viewmodel';
import { EventsService } from '../../services/events.service';
import { Subject } from 'rxjs/Subject';
import { ContextMenuService } from 'ngx-contextmenu';
import { StaffScheduleService } from '../../services/staffschedule.service';
import { StaffScheduleComponent } from './staffschedule/staffschedule.component';
import { Staff } from '../../models/staff';
import { CurrentDataService } from '../../services/currentData.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-employee-schedule',
  templateUrl: './employee-schedule.component.html',
  styleUrls: ['./employee-schedule.component.less']
})
export class EmployeeScheduleComponent implements OnInit, AfterViewChecked {
  @ViewChild('staffSchedule')
  staffSchedule;
  @ViewChild('hoverPanel')
  hoverPanel;

  configLoaded = false;
  activeSchedules: StaffSchedule[];
  actionPanelOpened = false;
  optionsConfig: any;
  clickEvent: AppointmentViewModel;
  unsub = new Subject<any>();
  datePickerVisible = true;
  currentDate: Date = new Date();
  visible = true;
  hoveredEvent: any;
  activeStaffSchedule: any;
  staffId: number;
  schedules: Event[] = [];
  touches: any[] = [];
  timer;
  calendarDate: Date;
  viewChecked = false;
  public loading = false;
  company: Company;

  staffUnavailabilityColor = '#003280';

  constructor(
    private router: Router,
    private companyService: CompanyService,
    public currentDataService: CurrentDataService,
    private staffScheduleService: StaffScheduleService,
    private eventsService: EventsService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private contextMenuService: ContextMenuService
  ) {
    this.eventsService.staffSchedulesListenerCalled$.subscribe(() => this.schedulesListener());
    this.eventsService.closeSidePanel$.subscribe(() => {
      this.closeSidePanel();
    });
    this.eventsService.removeAppointment$.subscribe(currentAppointmentId => this.removeAppointment(currentAppointmentId));
    this.eventsService.planningMode = false;
    // open the action panel when directly navigating to action-panel routes
    router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        const { url } = val;
        if (url.includes('action-panel')) {
          if (!url.includes('edit-patient')) {
            this.actionPanelOpened = true;
          }
        }
        if (url.includes('visit-details/')) {
          this.schedulesListener();
        }
      }
    });
  }

  ngOnInit() {
    this.currentDataService.currentDataUpdated$.subscribe(() => {
      this.loading = false;
    });

    this.loading = true;
    this.configLoaded = false;
    this.viewChecked = false;
    if (this.currentDataService.staff.length === 0) {
          this.router.navigate(['/schedule']);
    }
    this.currentDataService.dirty = true;

    this.company = this.currentDataService.company;

    const slotDurationString = '00:' + this.currentDataService.company.minimumDuration.toString() + ':00';
    const minTimeString = moment(this.currentDataService.company.hoursOfOperation.hoursOfOperationDays[this.currentDate.getDay()]
      .openTime).hours().toString() + ':00:00';
    const maxTimeString = moment(this.currentDataService.company.hoursOfOperation.hoursOfOperationDays[this.currentDate.getDay()]
      .closeTime).hours().toString() + ':00:00';
    // make a list of days when the clinic is closed
    const daysClosed = [];
    for (let i = 0; i < 7; i++) {
      if (this.currentDataService.company.hoursOfOperation.hoursOfOperationDays[moment(this.currentDate).add(i, 'days').day()].closed) {
        daysClosed.push(moment(this.currentDate).add(i, 'days').day());
      }
    }
    // primeng schedule is basically just a wrapper for fullCalendar, this is
    // where we can reach in to full calendar and leverage features that aren't implemented in p-schedule
    // resources is one example, as is select
    this.optionsConfig = {
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
      defaultView: 'agendaDay',
      slotDuration: slotDurationString,
      slotLabelFormat: 'h(:mm) A',
      slotLabelInterval: '01:00:00',
      nowIndicator: true,
      groupByDateAndResource: true,
      minTime: minTimeString,
      maxTime: maxTimeString,
      selectable: true,
      unselectAuto: false,
      allDaySlot: false,
      header: {
        left: 'prev next',
        center: '',
        right: ''
      },
      resources: callback => {
        const _resources = [];
        this.currentDataService.staff.forEach(staff => {
          const staffData = staff;
          _resources.push({ id: staffData.staffId, title: staffData.name });
        });
        callback(_resources);

        const getSlotRow = document.querySelectorAll('tr[data-time]');
        const timeSlot = document.createElement('td');

        timeSlot.classList.add('ui-widget-content');
        const count = _resources.length - 1;
        for (let i = 0; i < getSlotRow.length; i++) {
          for (let j = 0; j < count; j++) {
            getSlotRow[i].appendChild(timeSlot.cloneNode(true));
          }
        }
      },
      select: (start, end, ev, view, resourceObj) => {
        this.clickEvent = { isSelection: true, start: start, end: end, resourceId: resourceObj.id };
        this.eventsService.setTempEvent(this.clickEvent);
        this.actionPanelOpened = true;
        this.router.navigate(['schedule/employee-schedule', { outlets: { 'action-panel': ['create-shift'] } }]);
      },
      dayClick: (date, jsEvent, view, resourceObj) => {
        if (view.name !== 'agendaDay') {
        }
      },
      eventResize: (event, delta, revertFunc) => {
        this.eventsService.updateEvent(event);
      },
      resourceRender: (resourceObj, labelTds, bodyTds, view) => {
        labelTds.on('click', () => {
          this.optionsConfig.resources(resources => {
            resources.forEach(resource => {
              if (resource.resourceId !== resourceObj.resourceId) {
                this.staffSchedule.removeResource(resource);
              }
            });
            this.staffSchedule.changeView('agendaWeek');
          });
        });
      }
    };
    this.schedulesListener();
    this.configLoaded = true;
    this.loading = false;
  }

  ngAfterViewChecked() {
    if (this.configLoaded && !this.viewChecked) {
      this.viewChecked = true;
      // Add hidden overlay div on schedule for when panel opens
      const elementToAdd = document.createElement('div');
      elementToAdd.classList.add('overlay', 'hidden');
      const gridBody = document.getElementsByClassName('fc-time-grid fc-unselectable');
      gridBody[0].appendChild(elementToAdd);
      // Every time the date gets updated, update the schedule with the new date
      this.eventsService.currentDate.takeUntil(this.unsub).subscribe(value => {
        if (this.calendarDate !== value) {
          if (this.staffSchedule && this.staffSchedule.schedule)  {
            // if (this.currentDataService.company.hoursOfOperation.hoursOfOperationDays[value.getDay()].closed) {
              // // find the next day, in the right direction, that's not closed and go to it
              // let date = moment(value).toDate();
              // if (date > this.calendarDate) {
              //   date = moment(value).add(1, 'days').toDate();
              // }
              // else {
              //   date = moment(value).subtract(1, 'days').toDate();
              // }
              // this.eventsService.setSelectedDate(date);
            // } else {
              this.calendarDate = value;
              this.currentDate = value;
              this.currentDataService.currentDate = value;
              this.loading = this.currentDataService.checkIfDataRefreshRequired();
              const maxTime = moment(this.currentDataService.company.hoursOfOperation.hoursOfOperationDays[this.currentDate.getDay()]
                  .closeTime).hours().toString() + ':00:00';
              const minTime = moment(this.currentDataService.company.hoursOfOperation.hoursOfOperationDays[this.currentDate.getDay()]
                  .openTime).hours().toString() + ':00:00';

              const view = this.staffSchedule.getView();
              view.options.minTime = minTime;
              view.options.maxTime = maxTime;
              this.staffSchedule.gotoDate(value);
            // }
          }
        }
      });
      this.slotLabel();
    }
    this.actualTime();
  }

  closeSidePanel() {
    this.actionPanelOpened = false;
    const gridBody = document.querySelectorAll('.fc-time-grid');
    for (let i = 0; i < gridBody.length; i++) {
      gridBody[i].classList.remove('overlay-On');
    }
    this.schedulesListener();
  }

  slotLabel() {
    const data: NodeListOf<Element> = document.querySelectorAll('.fc-axis span');
    let dataItem = '';
    let result: string[] = [];
    for (let i = 0; i < data.length; i++) {
      dataItem = data[i].innerHTML;
      result = dataItem.split(' ');
      data[i].innerHTML = `${result[0]} <sub>${result[1]}</sub>`;
    }
  }
  actualTime() {
    setTimeout(() => {
      const input: HTMLElement = <HTMLElement>document.querySelector('.fc-now-indicator-arrow');
      const hours = new Date().getHours();
      const getMins = new Date().getMinutes();
      const mins = getMins > 9 ? getMins : '0' + getMins;
      if (input) {
        input.innerHTML = `<div class="actual-time">${hours}:${mins}</div>`;
      }
    }, 5000);
  }

  removeAppointment(currentAppointmentId) {
    // const appointmentIndex = this.appointments.findIndex(appointment => appointment.appointmentId === currentAppointmentId);
    // this.appointments.splice(appointmentIndex, 1);
  }

  scheduleRender(e) {
    //   this.eventsService.setSelectedDate(e.view.end.toDate());
  }

  onRightClick(event, item) {
    if (this.hoveredEvent) {
      this.contextMenuService.show.next({
        event: event,
        item: this.hoveredEvent
      });
      event.stopPropagation();
    }
    event.preventDefault();
  }

  // event/appointment section
  eventClick(e) {
    const clicked = e.jsEvent.target.parentElement.id;
    if (clicked === 'history') {
      // this.patientHistoryClicked();
    } else if (clicked === 'checkin') {
      // this.patientCheckInClick();
    } else {
      const event = e.calEvent;
      const view = e.view;
      this.activeStaffSchedule = event.staffScheduleIdString;
      this.staffId = event.staffId;
      this.scrubStaffSchedules();
      const insertArray = [];
      for (let i = 0; i < this.schedules.length; i++) {
        let eventToReplaceWith: any;
        if (this.schedules[i].staffScheduleId === event.staffScheduleId) {
          eventToReplaceWith = this.schedules[i];
          eventToReplaceWith.className = ['active'];
          this.schedules.splice(i, 1);
          insertArray.push(eventToReplaceWith);
          i = i - 1;
        }
      }
      if (insertArray.length > 0) {
        insertArray.forEach(evt => {
          this.schedules.push(evt);
        });
      }
      this.activeSchedules = insertArray;
      this.toggleStaffSchedulePanel(event);
    }
  }

  staffScheduleRender = (event, element, view) => {
    // this.loadingListener();
    const factory = this.resolver.resolveComponentFactory(StaffScheduleComponent);
    const component = factory.create(this.injector);
    component.instance.classList = element[0].classList.value;
    component.instance.start = moment(event.start).format('h:mm a');
    component.instance.end = moment(event.end).format('h:mm a');
    component.instance.className = event.className;
    component.instance.color = event.borderColor;
    component.instance.id = event.staffScheduleId;
    component.instance.resourceId = event.resourceId;
    component.instance.source = event.source;
    component.instance.title = event.title;
    component.instance.icon = event.icon;
    component.instance.rendering = event.rendering;
    component.changeDetectorRef.detectChanges();
    element[0].innerHTML = component.location.nativeElement.innerHTML;
    element[0].ontouchstart = evt => {
      this.touches.push(evt);
    };
    element[0].ontouchend = evt => {
      if (this.touches.length === 2) {
        this.hoveredEvent = event;
      } else if (this.touches.length === 3) {
        this.hoverPanel.show(evt);
      }
      this.touches = [];
    };
    return element;
  }

  toggleStaffSchedulePanel(event) {
    this.clickEvent = { isSelection: false, start: event.start, end: event.end, resourceId: event.staffScheduleId };
    this.eventsService.setTempEvent(this.clickEvent);
    this.actionPanelOpened = true;
    this.router.navigate(['schedule/employee-schedule', { outlets: { 'action-panel': ['create-shift'] } }]);
  }

  onEventDrop(e) {
    this.eventsService.updateEvent(e.event).subscribe(function() {});
  }

  eventHover(event, hoverPanel) {
    this.hoveredEvent = event.calEvent;
    hoverPanel.show(event.jsEvent);
  }

  eventMouseout(event) {
    this.hoveredEvent = null;
    this.hoverPanel.hide();
  }

  schedulesListener() {
    // listens for appointment changes within known visits
    // first we'll set up a listener on visits
    // this.loading = true;
    this.schedules = [];
    this.currentDataService.staffSchedules.forEach(sched => {
      const scheduleData: Event = {
        appointmentId: null,
        title: sched.title,
        allDay: null,
        start: sched.start,
        end: sched.end,
        url: null,
        className: [],
        editable: null,
        startEditable: null,
        durationEditable: null,
        resourceEditable: null,
        // background or inverse-background or empty
        rendering: null,
        overlap: null,
        constraint: null,
        // automatically populated
        source: null,
        resourceId: sched.staffId.toString(),
        backgroundColor: null,
        borderColor: null,
        textColor: null,
        staffScheduleId: sched.staffScheduleId,
        staffId: sched.staffId,
        recurrence: sched.recurrence,
        notes: sched.notes,
        endDate: sched.endDate
      };
      this.schedules.push(scheduleData);
    });
    this.loading = false;
  }

  getStaffUnavailability() {
    let activeDay = this.currentDate;
    activeDay.setDate(activeDay.getDate() - 14);
    const startOfBusinessDay = moment(new Date).hour(0).minute(0).second(0);
    const endOfBusinessDay = moment(new Date).hour(23).minute(59).second(59);
    const allStaffSchedules: Event[] = [];
    let tempAppointments = [];
    const ss = this.currentDataService.staffSchedules;
    ss.forEach(sched => {
      const scheduleData: Event = {
        appointmentId: null,
        title: sched.title,
        allDay: null,
        start: sched.start,
        end: sched.end,
        url: null,
        className: [],
        editable: null,
        startEditable: null,
        durationEditable: null,
        resourceEditable: null,
        // background or inverse-background or empty
        rendering: 'background',
        overlap: null,
        constraint: null,
        // automatically populated
        source: null,
        resourceId: sched.staffId.toString(),
        backgroundColor: this.staffUnavailabilityColor,
        borderColor: null,
        textColor: null,
        staffScheduleId: sched.staffScheduleId,
        staffId: sched.staffId,
        recurrence: sched.recurrence,
        notes: sched.notes,
        endDate: sched.endDate
      };
      allStaffSchedules.push(scheduleData);
    });
    // now we have all the staff schedules
    for (let i = 0; i < 84; i++) {
      // do all the things
      let staffMemberSchedules: Event[] = [];
      this.currentDataService.staff.forEach(staffMember => {
          staffMemberSchedules = allStaffSchedules.filter(ss => (ss.staffId === staffMember.staffId) &&
                                                          (moment(ss.start).isSame(activeDay, 'day')));
          // now sort ascending by start time
          staffMemberSchedules.sort((n1, n2) => {
              if (moment(n1.start) > moment(n2.title)) {
              return 1;
              }
              if (moment(n1.start) < moment(n2.title)) {
                  return -1;
              }
              return 0;
          });
          // now create unavailable events for all timeslots not filled by a schedule
          // if (isNullOrUndefined(this.startOfBusinessToday)) {
          //   this.startOfBusinessToday = moment(new Date).hour(9).minute(0).second(0);
          // }
          // if (isNullOrUndefined(this.endOfBusinessToday)) {
          //   this.endOfBusinessToday = moment(new Date).hour(17).minute(0).second(0);
          // }
          let startMarker = startOfBusinessDay;
          const endMarker = endOfBusinessDay;
          let startMarkerTime = startOfBusinessDay.minutes() + startOfBusinessDay.hour() * 60;
          const endMarkerTime = endOfBusinessDay.minutes() + endOfBusinessDay.hour() * 60;
          staffMemberSchedules.forEach(staffSched => {
            const staffSchedStartTime = moment(staffSched.start).minutes() + moment(staffSched.start).hour() * 60;
            if ((startMarkerTime < endMarkerTime) && (staffSchedStartTime > startMarkerTime)) {
                const staffUnavailSched: Event = {
                    appointmentId: null,
                    title: staffSched.title,
                    allDay: null,
                    start: staffSched.start,
                    end: staffSched.start,
                    url: null,
                    className: [],
                    editable: null,
                    startEditable: null,
                    durationEditable: null,
                    resourceEditable: null,
                    // background or inverse-background or empty
                    rendering: 'background',
                    overlap: null,
                    constraint: null,
                    // automatically populated
                    source: null,
                    resourceId: staffSched.staffId.toString(),
                    backgroundColor: this.staffUnavailabilityColor,
                    borderColor: null,
                    textColor: null,
                    staffScheduleId: staffSched.staffScheduleId,
                    staffId: staffSched.staffId,
                    recurrence: staffSched.recurrence,
                    notes: staffSched.notes,
                    endDate: staffSched.endDate,
                    service: {
                        serviceId: 0,
                        serviceName: '',
                        quantity: 0,
                        serviceCategoryId: 0,
                        category: {
                            serviceCategoryId: 0,
                            name: ''
                        },
                        serviceReqProductsString: '',
                        serviceRecProductsString: ''
                    }
                };
                const staffSchedStart = moment(activeDay);
                // staffSchedStart.date(moment(staffUnavailSched.start).date());
                staffSchedStart.hours(startMarker.hours());
                staffSchedStart.minutes(startMarker.minutes());
                staffUnavailSched.start = staffSchedStart.utc(true).toISOString();
                tempAppointments.push(staffUnavailSched);
                startMarker = moment(staffSched.end);
                startMarkerTime = startOfBusinessDay.minutes() + startOfBusinessDay.hour() * 60;
            } else {
              startMarker = moment(staffSched.end);
              startMarkerTime = startOfBusinessDay.minutes() + startOfBusinessDay.hour() * 60;
            }
          });
          if (startMarker !== endMarker) {
            const staffUnavailSched: Event = {
              appointmentId: null,
              title: staffMember.name,
              allDay: null,
              start: '',
              end: '',
              url: null,
              className: [],
              editable: null,
              startEditable: null,
              durationEditable: null,
              resourceEditable: null,
              // background or inverse-background or empty
              rendering: 'background',
              overlap: null,
              constraint: null,
              // automatically populated
              source: null,
              resourceId: staffMember.staffId.toString(),
              backgroundColor: this.staffUnavailabilityColor,
              borderColor: null,
              textColor: null,
              staffScheduleId: 0,
              staffId: staffMember.staffId,
              recurrence: null,
              notes: '',
              endDate: '',
              service: {
                  serviceId: 0,
                  serviceName: '',
                  quantity: 0,
                  serviceCategoryId: 0,
                  category: {
                      serviceCategoryId: 0,
                      name: ''
                  },
                  serviceReqProductsString: '',
                  serviceRecProductsString: ''
                }
            };
            const staffSchedStart = moment(activeDay);
            staffSchedStart.hours(startMarker.hours());
            staffSchedStart.minutes(startMarker.minutes());
            staffUnavailSched.start = staffSchedStart.utc(true).toISOString();
            const staffSchedEnd = moment(activeDay);
            staffSchedEnd.hours(endOfBusinessDay.hours());
            staffSchedEnd.minutes(endOfBusinessDay.minutes());
            staffUnavailSched.end = staffSchedEnd.utc(true).toISOString();
            tempAppointments.push(staffUnavailSched);
        }
      });
      // increment the day
      activeDay.setDate(activeDay.getDate() + 1);
    }
    this.currentDataService.appointments = this.currentDataService.appointments.filter(app => app.rendering !== 'background');
    tempAppointments.forEach(ta => {
      if (isNullOrUndefined(ta.appointmentId)) {
        if (!this.currentDataService.appointments.find(a => (a.title === ta.title && a.start === ta.start))) {
          this.currentDataService.appointments.push(ta);
        }
      }
      else {
        if (!this.currentDataService.appointments.find(a => (a.appointmentId === ta.appointmentId))) {
          this.currentDataService.appointments.push(ta);
        }
      }
    });
  }

  displayCalendar() {
    if (this.currentDataService.company) {
        return true;
    } else {
        return false;
    }
  }

  scrubStaffSchedules() {
    let replacementEvent: any;
    const replacementArray = [];
    for (let i = 0; i < this.schedules.length; i++) {
      replacementEvent = this.schedules[i];
      // replacementEvent.className = [];
      this.schedules.splice(i, 1);
      replacementArray.push(replacementEvent);
      i = i - 1;
    }
    if (replacementArray.length > 0) {
      replacementArray.forEach(e => {
        this.schedules.push(e);
      });
    }
  }
}
