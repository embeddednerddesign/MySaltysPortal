import * as moment from 'moment';
// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, ComponentFactoryResolver, Injector, ViewChild, AfterViewChecked, Output, EventEmitter, Renderer, HostListener, Renderer2, } from '@angular/core';
import { Event, Appointment, DbAppointment } from '../../models/scheduler/event';
import { EventsService } from '../../services/events.service';
import { AppointmentViewModel } from '../../models/appintment-viewmodel';
import { AppointmentComponent } from './appointment/appointment.component';
import { ContextMenuService } from 'ngx-contextmenu';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { StaffsService } from '../../services/staffs.service';
import { Subject } from 'rxjs/Subject';
import { CompanyService } from '../../services/company.service';
// import { HoursOfOperationService } from '../../services/hoursofoperation.service';
import { VisitService } from '../../services/visit.service';
import { AppointmentService } from '../../services/appointments.service';
import { takeUntil } from 'rxjs/operators';
import { ServicesService } from '../../services/services.service';
import { PatientService } from '../../services/patient.service';
import { Visit } from '../../models/visit';
import { isNull, isNullOrUndefined, isUndefined } from 'util';
import { StaffScheduleService } from '../../services/staffschedule.service';
import { Observable } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { MasterOverlayService } from '../../services/actionpanel.service';
import { CurrentDataService } from '../../services/currentData.service';

@Component({
    selector: 'app-appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.less']
})
export class AppointmentsComponent implements OnInit, OnDestroy, AfterViewChecked {
    public items = [
        { name: 'John', otherProperty: 'Foo' },
        { name: 'Joe', otherProperty: 'Bar' }
    ];
    @ViewChild('visitsSchedule') visitSchedule;
    @ViewChild('hoverPanel') hoverPanel;

    @ViewChild('myContextMenu') contextMenu;
    @ViewChild('visitStatusMenu') statusMenu;

    @Output() cancellationMessage = new EventEmitter();

    mouseIsDown = false;
    doubleClick = false;

    latestClickEvent: any;

    staffUnavailabilityColor = '#003280';

    configLoaded = false;
    viewChecked = false;
    clickEvent: AppointmentViewModel;
    hoveredEvent: any;
    activeVisit: any;
    patientId: number;
    activeAppointments: Event[];
    appointments: Event[] = [];
    allVisits: any[] = [];
    touches: any[] = [];
    optionsConfig: any;
    visible = true;
    actionpanelVisible = false;
    visitPanelOpen = false;
    subs: Array<Subscription> = [];
    datePickerVisible = true;
    calendarDate: Date;
    unsub = new Subject<any>();
    headerConfig: any;
    actionPanelOpened = false;
    timer;
    doubleClickTimer;
    currentDate: Date = new Date();
    public loading = false;
    nextButton: any;
    prevButton: any;
    patientNoShow = 0;
    showCancelAppointment: boolean;
    showCancelVisit: boolean;
    showCreate: boolean;
    currentAppointment: any = {};
    tempAppointments: Event[] = [];

    selectedTimeSlotStartTime: any;
    selectedTimeSlotEndTime: any;
    selectedTimeSlotResourceId: any;
    openAppointmentId: number;

    startOfBusinessToday: moment.Moment;
    endOfBusinessToday: moment.Moment;
    minTimeString = '';
    maxTimeString = '';

    overlayhovered = false;
    contextMenuOpen = false;

    currentlyClickedClassName = '';
    visitChangingStatus: Visit;

    loggedInUserName = '';

    savedStart = '';
    savedEnd = '';

    hoverDebounce = false;
    hoverDebounceTimer;

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(e) {
      const hoverPanelObj = document.getElementById('hoverPanel');
      if (!isNullOrUndefined(hoverPanelObj)) {
        document.getElementById('hoverPanel').style.top = (e.pageY - 45) + 'px';
        document.getElementById('hoverPanel').style.left = (e.pageX - 55) + 'px';
      }
    }
    @HostListener('document:mousedown', ['$event'])
    onMouseDown(e) {
      this.mouseIsDown = true;
      this.savedStart = this.currentDataService.appointments[0].start;
      this.savedEnd = this.currentDataService.appointments[0].end;
    }
    @HostListener('document:mouseup', ['$event'])
    onMouseUp(e) {
      this.mouseIsDown = false;
    }

    constructor(private contextMenuService: ContextMenuService,
        private masterOverlayService: MasterOverlayService,
        private eventsService: EventsService,
        private userService: UsersService,
        private resolver: ComponentFactoryResolver,
        private injector: Injector,
        private router: Router,
        private companyService: CompanyService,
        private visitService: VisitService,
        private appointmentService: AppointmentService,
        private staffsService: StaffsService,
        private servicesService: ServicesService,
        private patientService: PatientService,
        private staffScheduleService: StaffScheduleService,
        public currentDataService: CurrentDataService,
        private renderer: Renderer,
        private renderer2: Renderer2) {

        this.eventsService.appointmentsListenerCalled$.subscribe(() => {
          this.appointmentsListener();
        });
        this.eventsService.closeSidePanel$.subscribe(() => this.closeSidePanel());
        this.eventsService.removeAppointment$.subscribe((currentAppointmentId) => this.removeAppointment(currentAppointmentId));
        this.eventsService.planningMode = false;
        // open the action panel when directly navigating to action-panel routes
        router.events.subscribe(val => {
            if (val instanceof NavigationEnd) {
                const { url } = val;
                if (url.includes('action-panel')) {
                  if (!url.includes('edit-patient') && !url.includes('patient')) {
                    this.actionPanelOpened = true;
                  }
                }
                if (url === '/schedule/employee-schedule') {
                    this.appointmentsListener();
                }
                if (url === '/schedule') {
                  this.openAppointmentId = null;
                }
                if (url.includes('action-panel:patient')) {
                  this.actionPanelOpened = false;
                }
            }
        });
    }

    // angular lifecycle section
    ngOnInit() {
      this.currentDataService.currentDataUpdated$.subscribe(() => {
        this.loading = false;
      });

      this.loading = true;

      this.loggedInUserName = this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName;
      this.eventsService.appointmentAddedListener.pipe(takeUntil(this.unsub)).subscribe(() => {
        this.appointmentsListener();
      });

      this.eventsService.closeSidePanel$.pipe(takeUntil(this.unsub)).subscribe(event => {
          const events = this.visitSchedule.getEventSources();
          events[0].eventDefs.forEach(e => {
              e.className = [];
          });
          this.visitSchedule.rerenderEvents();
      });
      this.eventsService.actionPanelOpenedListener.pipe(takeUntil(this.unsub)).subscribe(event => {
          const events = this.visitSchedule.getEventSources();
          events[0].eventDefs.forEach(e => {
              if (e.miscProps.visitId === event.visitId) {
                e.className = [];
              } else {
                if (!e.className.includes('event-selected')) {
                  e.className.push('event-selected');
                }
              }
          });
          this.visitSchedule.rerenderEvents();
      });

      this.loading = true;
      this.configLoaded = false;
      this.viewChecked = false;
      this.headerConfig = {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
      };
      this.currentDataService.refreshCurrentData().subscribe(responseList => {
        this.currentDataService.visits = responseList[0];
        this.currentDataService.dbappointments = responseList[1];
        this.currentDataService.services = responseList[2];
        this.currentDataService.patients = responseList[3];
        this.currentDataService.staff = responseList[4];
        this.currentDataService.staffSchedules = responseList[5];
        this.currentDataService.company = responseList[6];
        this.visitChangingStatus = null;
        this.currentDataService.visits.forEach(v => {
          v.patient = this.currentDataService.patients.find(p => p.patientId === v.patientId);
        });
        this.getStaffUnavailability();
        this.getAppointments(this.currentDataService.visits);
        this.scheduleSetup();
      });
    }

    scheduleSetup() {
        const slotDurationString = '00:' + this.currentDataService.company.minimumDuration.toString() + ':00';
        this.startOfBusinessToday = moment(this.currentDataService.company.hoursOfOperation.hoursOfOperationDays[this.currentDate.getDay()]
        .openTime);
        this.minTimeString = moment(this.currentDataService.company.hoursOfOperation.hoursOfOperationDays[this.currentDate.getDay()]
          .openTime).hours().toString() + ':00:00';
        this.endOfBusinessToday = moment(this.currentDataService.company.hoursOfOperation.hoursOfOperationDays[this.currentDate.getDay()]
        .closeTime);
        this.maxTimeString = moment(this.currentDataService.company.hoursOfOperation.hoursOfOperationDays[this.currentDate.getDay()]
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
            slotEventOverlap: false,
            nowIndicator: true,
            groupByDateAndResource: true,
            minTime: this.minTimeString,
            maxTime: this.maxTimeString,
            selectable: true,
            unselectAuto: false,
            allDaySlot: false,
            header: {
                left: 'prev next',
                center: '',
                right: ''
            },
            views: {
              agendaWeekFive: {
                type: 'agenda',
                dayCount: 7,
                hiddenDays: daysClosed
              }
            },
            navLinks: true,
            navLinkDayClick: (date, jsEvent) => {
                this.visitSchedule.refetchResources();
                this.eventsService.selectedDate.next(moment(date).local().toDate());
                this.visitSchedule.changeView('agendaDay');
            },
            resources: (callback) => {
                const _resources = [];
                this.currentDataService.staff.forEach(staff => {
                    _resources.push({ id: staff.staffId, title: staff.name });
                });
                callback(_resources);
            },
            select: (start, end, ev, view, resourceObj) => {
                if (this.getDuration(start, end) === this.currentDataService.company.minimumDuration) {
                    this.clickEvent = { isSelection: false, start: start, end: end, resourceId: resourceObj.id };
                } else {
                    this.clickEvent = { isSelection: true, start: start, end: end, resourceId: resourceObj.id };
                }
                this.eventsService.setTempEvent(this.clickEvent);
                this.toggleCreateVisitPanel(start, end, resourceObj.id);
                if (this.actionPanelOpened) {
                    if (this.eventsService.planningMode) {
                        this.router.navigate(['schedule', { outlets: { 'action-panel': ['preferred-appointments'] } }]);
                    } else {
                        this.router.navigate(['schedule', { outlets: { 'action-panel': ['create-visit'] } }]);
                    }
                }
            },
            dayClick: (date, jsEvent, view, resourceObj) => {
            },
            eventResize: (event, delta, revertFunc) => {
              this.updateEventInUI(event, true);
            },
            resourceRender: (resourceObj, labelTds, bodyTds, view) => {
                labelTds.on('click', () => {
                    if (view.name !== 'agendaWeekFive') {
                        this.optionsConfig.resources(resources => {
                            resources.forEach(resource => {
                                if (resource.id !== +resourceObj.id) {
                                    this.visitSchedule.removeResource(resource);
                                }
                            });
                            this.visitSchedule.changeView('agendaWeekFive');
                        });
                    } else {
                    }
                });
                if (view.name === 'agendaWeekFive') {
                    const slotRow = document.querySelectorAll('tr[data-time]');
                    if (slotRow) {
                        if (slotRow[0].children.length <= 7) {
                            const timeSlot = document.createElement('td');
                            timeSlot.classList.add('ui-widget-content');
                            for (let i = 0; i < slotRow.length; i++) {
                                // for (let j = 0; j < count; j++) {
                                    slotRow[i].appendChild(timeSlot.cloneNode(true));
                                // }
                            }
                        }
                    }
                } else {
                    this.optionsConfig.resources(resources => {
                        const slotRow = document.querySelectorAll('tr[data-time]');
                        if (slotRow) {
                            if (slotRow[0].children.length <= resources.length) {
                                const timeSlot = document.createElement('td');
                                timeSlot.classList.add('ui-widget-content');
                                for (let i = 0; i < slotRow.length; i++) {
                                    // for (let j = 0; j < count; j++) {
                                        slotRow[i].appendChild(timeSlot.cloneNode(true));
                                    // }
                                }
                            }
                        }
                    });
                }
            }
        };
        this.configLoaded = true;
        this.loading = false;
    }

    ngAfterViewChecked() {
        if (this.configLoaded && !this.viewChecked) {
          this.viewChecked = true;
          // Every time the date gets updated, update the schedule with the new date
          this.eventsService.currentDate.takeUntil(this.unsub).subscribe(value => {
            if (this.calendarDate !== value) {
              if (this.visitSchedule && this.visitSchedule.schedule) {
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

                  const view = this.visitSchedule.getView();
                  view.options.minTime = minTime;
                  view.options.maxTime = maxTime;
                  this.visitSchedule.gotoDate(value);
                // }
              }
            }
          });
          this.slotLabel();
        }
    }

    ngOnDestroy() {
        this.subs.forEach(sub => {
            sub.unsubscribe();
        });
        this.unsub.next();
        this.unsub.complete();
    }

    scheduleRender(e) {
    }

    processContextMenuCloseEvent() {
      this.contextMenuOpen = false;
      if (this.overlayhovered) {
        document.getElementById('hoverPanel').style.opacity = '1';
      }
    }

    processContextMenuMouseEnterEvent() {
      this.contextMenuOpen = true;
    }

    processContextMenuMouseOutEvent() {
      this.contextMenuOpen = false;
      this.timer = setTimeout(() => {
        if (!this.contextMenuOpen) {
          this.contextMenuService.closeAllContextMenus({
            eventType: 'cancel'
          });
          if (this.overlayhovered) {
            document.getElementById('hoverPanel').style.opacity = '1';
          }
        }
      }, 200);
    }

    // event/appointment section
    eventClick(e) {
      this.latestClickEvent = e;
      this.contextMenuOpen = false;
      this.contextMenuService.closeAllContextMenus({
        eventType: 'cancel'
      });
      if (this.overlayhovered) {
        this.overlayhovered = false;
        document.getElementById('hoverPanel').style.opacity = '0';
      }

      if (e.jsEvent.target.parentElement.parentElement.id === 'checkin') {
        e.jsEvent.stopPropagation();
        this.visitService.getVisitById(e.calEvent.visit.visitId).pipe(takeUntil(this.unsub)).subscribe(visit => {
          this.visitChangingStatus = visit;
          this.visitStatusClicked();
        });
      } else {
        this.visitChangingStatus = null;
        if (e.jsEvent.target.parentElement.parentElement.id === 'appointment') {
          // now go to the patient panel, passing in the patient id
          this.patientService.getPatientById(e.calEvent.visit.patientId).subscribe(pat => {
            if (!isNullOrUndefined(pat)) {
              this.masterOverlayService.masterOverlayState(true);
              this.router.navigate(['/schedule', { outlets: {'action-panel': ['patient', pat.patientId]}}]);
            }
          });
        }
        else {
          this.doubleClickTimer = setTimeout(() => {
            const tempEvent: Event = this.currentDataService.appointments[this.currentDataService.appointments.findIndex(appt => appt.appointmentId === e.calEvent.appointmentId)];
            this.currentDataService.appointments.forEach(a => {
              if (a.appointmentId === e.calEvent.appointmentId) {
                if (a.className.length === 0) {
                  a.className.push('event-selected');
                }
                else if (a.className.includes('event-selected')) {
                  const index = a.className.indexOf('event-selected');
                  a.className.splice(index, 1);
                }
                else {
                  a.className.push('event-selected');
                }
              }
              else {
                const index = a.className.indexOf('event-selected');
                a.className.splice(index, 1);
              }
            });
            setTimeout(() => {
              const tempEvent2: Event = this.currentDataService.appointments[this.currentDataService.appointments.findIndex(appt => appt.appointmentId === e.calEvent.appointmentId)];
              this.currentDataService.appointments.splice(this.currentDataService.appointments.findIndex(appt => appt.appointmentId === e.calEvent.appointmentId), 1);
              this.currentDataService.appointments.push(tempEvent2);
              setTimeout(() => {
                const tempEvent2: Event = this.currentDataService.appointments[this.currentDataService.appointments.findIndex(appt => appt.appointmentId === e.calEvent.appointmentId)];
                this.currentDataService.appointments.splice(this.currentDataService.appointments.findIndex(appt => appt.appointmentId === e.calEvent.appointmentId), 1);
                this.currentDataService.appointments.push(tempEvent2);
              }, 25);
            }, 25);
            this.currentDataService.appointments.splice(this.currentDataService.appointments.findIndex(appt => appt.appointmentId === tempEvent.appointmentId), 1);
            this.currentDataService.appointments.splice(this.currentDataService.appointments.findIndex(appt => appt.appointmentId === tempEvent.appointmentId), 0, tempEvent);
          }, 200);
          //   const theEventId = e.calEvent.appointmentId;
          //   let theEventIndex = this.currentDataService.appointments.findIndex(appt => appt.appointmentId === theEventId);
          //   let theTempEvent: Event = this.currentDataService.appointments[theEventIndex];
          //   setTimeout(() => {
          //     theEventIndex = this.currentDataService.appointments.findIndex(appt => appt.appointmentId === theEventId);
          //     theTempEvent = this.currentDataService.appointments[theEventIndex];
          //     this.currentDataService.appointments.splice(theEventIndex, 1);
          //     this.currentDataService.appointments.splice(theEventIndex, 0, theTempEvent);
          //     setTimeout(() => {
          //       theEventIndex = this.currentDataService.appointments.findIndex(appt => appt.appointmentId === theEventId);
          //       theTempEvent = this.currentDataService.appointments[theEventIndex];
          //       this.currentDataService.appointments.splice(theEventIndex, 1);
          //       this.currentDataService.appointments.splice(theEventIndex, 0, theTempEvent);
          //     }, 25);
          //   }, 25);
          //   this.currentDataService.appointments.splice(theEventIndex, 1);
          //   this.currentDataService.appointments.splice(theEventIndex, 0, theTempEvent);
          // }, 200);
        }
      }
    }

    openVisitPanel(e) {
        this.eventsService.actionPanelOpened.next(e.calEvent);
        this.openAppointmentId = e.calEvent.appointmentId;
        this.clickEvent = { isSelection: false, start: e.calEvent.start, end: e.calEvent.end, resourceId: e.calEvent.resourceId };
        this.eventsService.setTempEvent(this.clickEvent);
        this.actionpanelVisible = false;
        this.router.navigate(['/schedule', { outlets: { 'action-panel': null } }]);

        const clicked = e.jsEvent.target.parentElement.id;
        const jsEvent = e.jsEvent;
        if (clicked === 'history') {
            this.patientHistoryClicked();
        } else if (clicked === 'checkin') {
            this.patientCheckInClick();
        } else {
            const event = e.calEvent;
            this.toggleVisitPanel(event.visitId);
        }
    }

    eventRender = (event, element, view) => {
      element.bind('dblclick', function() {
          if (this.openAppointmentId) {
              if (this.openAppointmentId === event.appointmentId) {
                  this.openAppointmentId = null;
                  this.router.navigate(['/schedule', { outlets: { 'action-panel': null } }]);

                  this.eventsService.closePanel(this.latestClickEvent.calEvent);
              } else {
                this.openVisitPanel(this.latestClickEvent);
              }
          } else {
            this.openVisitPanel(this.latestClickEvent);
          }
        }.bind(this));
        this.loadingListener();
        const factory = this.resolver.resolveComponentFactory(AppointmentComponent);
        const component = factory.create(this.injector);
        component.instance.classList = element[0].classList.value;
        component.instance.start = moment(event.start).format('h:mm a');
        component.instance.end = moment(event.end).format('h:mm a');
        component.instance.className = event.className;
        component.instance.color = event.service.serviceIDColour;
        component.instance.serviceName = event.service.serviceName;
        component.instance.id = event.appointmentId;
        component.instance.resourceId = event.resourceId;
        component.instance.source = event.source;
        component.instance.title = event.title;
        component.instance.visitIdString = event.visitIdString;
        component.instance.icon = event.icon;
        component.instance.rendering = event.rendering;

        if (!isNullOrUndefined(event.visit) && !isNullOrUndefined(event.visit.patient)) {
            component.instance.patientName = event.visit.patient.firstName + ' ' + event.visit.patient.lastName;
            if (event.visit.confirmed && event.visit.checkedIn) {
                component.instance.visitStatus = 'checkedIn';
            } else if (!event.visit.confirmed && event.visit.noShow) {
                component.instance.visitStatus = 'noShow';
            } else if (!event.visit.confirmed && !event.visit.noShow) {
                component.instance.visitStatus = 'uncomfirmed';
            } else if (event.visit.confirmed && !event.visit.checkedIn) {
                component.instance.visitStatus = 'confirmed';
            }
        } else {
            component.instance.patientName = '';
            component.instance.visitStatus = 'uncomfirmed';
        }
        // component.instance.dow = event.dow;
        component.changeDetectorRef.detectChanges();
        element[0].innerHTML = component.location.nativeElement.innerHTML;
        element[0].ontouchstart = ((evt) => {
            this.touches.push(evt);
        });
        element[0].ontouchend = ((evt) => {
          if (this.touches.length === 2) {
              this.hoveredEvent = event;
          } else if (this.touches.length === 3) {
              this.hoverPanel.show(evt);
          }
          this.touches = [];
        });

        return element;
    }

    loadingListener() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.loading = false;
        }, 250);
    }

    onEventDrop(e) {
      this.currentDataService.appointments[0].start = this.savedStart;
      this.currentDataService.appointments[0].end = this.savedEnd;
      this.updateEventInUI(e.event, true);
    }

    fixEventDateToLocal(eventDate: moment.Moment) {
      try {
        return moment(new Date())
        .year(eventDate.year())
        .month(eventDate.month())
        .date(eventDate.date())
        .hours(eventDate.hours())
        .minutes(eventDate.minutes())
        .seconds(eventDate.seconds());
      }
      catch (e) {
        return moment(new Date());
      }
    }
    getLocalTimeFromTimeString(timeString: string): Date {
      let tempTime: string = timeString.replace('T', '-').replace(':', '-').replace(':', '-');
      tempTime = tempTime.split('.')[0];
      const tempTimeArray = tempTime.split('-');
      const theStartTimeForcedToStayLocalTime = new Date(Number(tempTimeArray[0]),
                                                          Number(tempTimeArray[1]) - 1,
                                                            Number(tempTimeArray[2]),
                                                              Number(tempTimeArray[3]),
                                                                Number(tempTimeArray[4]),
                                                                  Number(tempTimeArray[5]));
      return theStartTimeForcedToStayLocalTime;
    }
    getTimeStringFromLocalTime(localTime: Date): string {
      let tempTime = '';
      tempTime += localTime.getFullYear().toString() + '-';
      tempTime += this.ensureTwoDigits((localTime.getMonth() + 1).toString()) + '-';
      tempTime += this.ensureTwoDigits(localTime.getDate().toString()) + 'T';
      tempTime += this.ensureTwoDigits(localTime.getHours().toString()) + ':';
      tempTime += this.ensureTwoDigits(localTime.getMinutes().toString()) + ':';
      tempTime += this.ensureTwoDigits(localTime.getSeconds().toString()) + '.000Z';

      return tempTime;
    }
    ensureTwoDigits(timeDateString) {
      if (timeDateString.length === 1) {
        timeDateString = '0' + timeDateString;
      }
      return timeDateString;
    }

    updateEventInUI(event, updateInDb?) {
      const newAllAppointments = this.currentDataService.appointments.slice();
      const theindex = newAllAppointments.findIndex(a => a.appointmentId === event.appointmentId);
      const theappointmentinquestion = newAllAppointments[theindex];
      newAllAppointments.splice(theindex, 1);

      if (moment.isMoment(event.start) || event.start instanceof Date) {
        theappointmentinquestion.start = this.getTimeStringFromLocalTime(this.getLocalTimeFromTimeString(event.start.toISOString()));
      }
      else {
        theappointmentinquestion.start = this.getTimeStringFromLocalTime(this.getLocalTimeFromTimeString(event.start));
      }
      if (moment.isMoment(event.end) || event.end instanceof Date) {
        theappointmentinquestion.end = this.getTimeStringFromLocalTime(this.getLocalTimeFromTimeString(event.end.toISOString()));
      }
      else {
        theappointmentinquestion.end = this.getTimeStringFromLocalTime(this.getLocalTimeFromTimeString(event.end));
      }
      if (event.cancellationDate instanceof Date) {
        theappointmentinquestion.cancellationDate = this.getLocalTimeFromTimeString(this.getTimeStringFromLocalTime(event.cancellationDate));
      }
      else {
        theappointmentinquestion.cancellationDate = this.getLocalTimeFromTimeString(event.cancellationDate);
      }
      theappointmentinquestion.allDay = event.allDay;
      theappointmentinquestion.cancellationReason = event.cancellationReason;
      theappointmentinquestion.cancelled = event.cancelled;
      theappointmentinquestion.className = event.className;
      theappointmentinquestion.isCancellationAlert = event.isCancellationAlert;
      theappointmentinquestion.resourceId = event.resourceId;
      theappointmentinquestion.service = event.service;
      theappointmentinquestion.serviceId = event.serviceId;
      theappointmentinquestion.title = event.title;
      theappointmentinquestion.visit = event.visit;
      theappointmentinquestion.visitId = event.visitId;
      theappointmentinquestion.visitIdString = event.visitIdString;

      newAllAppointments.push(theappointmentinquestion);
      this.currentDataService.appointments = newAllAppointments.slice();

      if (updateInDb) {
        // schedule component provides dates with UTC offset subtracted
        // we need dates to be local before they are sent to the db, so we fix that here
        event.start = this.fixEventDateToLocal(event.start);
        event.end = this.fixEventDateToLocal(event.end);
        event.cancellationDate = this.fixEventDateToLocal(event).toDate();
        this.eventsService.updateEvent(event).subscribe(() => {
        });
        this.eventsService.appointmentUpdated.next(theappointmentinquestion);
      }
    }

    eventHover(event, hoverPanel) {
      if (event.jsEvent.type === 'mouseenter' && !this.overlayhovered && !this.contextMenuOpen) {
        this.hoverDebounce = true;
        this.hoverDebounceTimer = setTimeout(() => {
          if (this.hoverDebounce) {
            this.overlayhovered = true;
            this.hoveredEvent = event.calEvent;
            hoverPanel.style.opacity = 1;
            const tempEvent: Event = this.currentDataService.appointments[this.currentDataService.appointments.findIndex(appt => appt.appointmentId === event.calEvent.appointmentId)];
            if (!tempEvent.className.includes('event-hover')) {
              tempEvent.className.push('event-hover');
            }
            this.updateEventInUI(tempEvent, false);
          }
        }, 250);
      }
    }

    eventMouseout(event) {
      if (event.jsEvent.type === 'mouseleave' && !this.mouseIsDown) {
        this.hoverDebounce = false;
        clearTimeout(this.timer);
        const tempEvent: Event = this.currentDataService.appointments[this.currentDataService.appointments.findIndex(appt => appt.appointmentId === event.calEvent.appointmentId)];
        this.currentDataService.appointments.splice(this.currentDataService.appointments.findIndex(appt => appt.appointmentId === event.calEvent.appointmentId), 1);
        const index = tempEvent.className.indexOf('event-hover');
        tempEvent.className.splice(index, 1);
        this.currentDataService.appointments.push(tempEvent);

        this.timer = setTimeout(() => {
          this.currentDataService.appointments.splice(this.currentDataService.appointments.findIndex(appt => appt.appointmentId === tempEvent.appointmentId), 1);
          this.currentDataService.appointments.splice(this.currentDataService.appointments.findIndex(appt => appt.appointmentId === tempEvent.appointmentId), 0, tempEvent);
        }, 25);

        this.overlayhovered = false;
        this.hoveredEvent = null;
        document.getElementById('hoverPanel').style.opacity = '0';
      }
    }

    appointmentsListener() {
      this.currentDataService.refreshCurrentData().subscribe(responseList => {
        this.currentDataService.visits = responseList[0];
        this.currentDataService.dbappointments = responseList[1];
        this.currentDataService.services = responseList[2];
        this.currentDataService.patients = responseList[3];
        this.currentDataService.staff = responseList[4];
        this.currentDataService.staffSchedules = responseList[5];
        this.currentDataService.company = responseList[6];
        this.visitChangingStatus = null;
        this.currentDataService.visits.forEach(v => {
          v.patient = this.currentDataService.patients.find(p => p.patientId === v.patientId);
        });
        this.getStaffUnavailability();
        this.getAppointments(this.currentDataService.visits);
      });
    }

    forceUpdateEvent(event: Event) {
      let indexOfEvent: number = this.currentDataService.appointments.findIndex(appt => appt.appointmentId === event.appointmentId);
      setTimeout(() => {
        indexOfEvent = this.currentDataService.appointments.findIndex(appt => appt.appointmentId === event.appointmentId);
        this.currentDataService.appointments.splice(indexOfEvent, 1);
        this.currentDataService.appointments.push(event);
        setTimeout(() => {
          indexOfEvent = this.currentDataService.appointments.findIndex(appt => appt.appointmentId === event.appointmentId);
          this.currentDataService.appointments.splice(indexOfEvent, 1);
          this.currentDataService.appointments.push(event);
        }, 25);
      }, 25);
      this.currentDataService.appointments.splice(indexOfEvent, 1);
      this.currentDataService.appointments.push(event);
      // this.currentDataService.appointments.splice(this.currentDataService.appointments.findIndex(appt => appt.appointmentId === event.appointmentId), 0, event);
      // const theEventId = event.appointmentId;
      // let theEventIndex = this.currentDataService.appointments.findIndex(appt => appt.appointmentId === theEventId);
      // let theTempEvent: Event = this.currentDataService.appointments[theEventIndex];
      // setTimeout(() => {
      //   theEventIndex = this.currentDataService.appointments.findIndex(appt => appt.appointmentId === theEventId);
      //   theTempEvent = this.currentDataService.appointments[theEventIndex];
      //   this.currentDataService.appointments.splice(theEventIndex, 1);
      //   this.currentDataService.appointments.splice(theEventIndex, 0, theTempEvent);
      //   setTimeout(() => {
      //     theEventIndex = this.currentDataService.appointments.findIndex(appt => appt.appointmentId === theEventId);
      //     theTempEvent = this.currentDataService.appointments[theEventIndex];
      //     this.currentDataService.appointments.splice(theEventIndex, 1);
      //     this.currentDataService.appointments.splice(theEventIndex, 0, theTempEvent);
      //   }, 25);
      // }, 25);
      // this.currentDataService.appointments.splice(theEventIndex, 1);
      // this.currentDataService.appointments.splice(theEventIndex, 0, theTempEvent);
    }

    getAppointments(allVisits) {
      const allVisitsLength = allVisits.length;
      let allVisitsIndex = 0;
      allVisits.forEach(v => {
        allVisitsIndex = allVisitsIndex + 1;
        this.appointmentService.getAppointmentsByVisitId(v.visitId).pipe(takeUntil(this.unsub)).subscribe(appointments => {
          appointments.forEach(appointment => {
            const docData: any = {
              appointmentId: appointment.appointmentId,
              title: appointment.title,
              allDay: appointment.allDay,
              start: appointment.start,
              end: appointment.end,
              url: appointment.url,
              className: [],
              editable: appointment.editable,
              startEditable: appointment.startEditable,
              durationEditable: appointment.durationEditable,
              resourceEditable: appointment.resourceEditable,
              // background or inverse-background or empty
              rendering: appointment.rendering,
              overlap: appointment.overlap,
              constraint: appointment.constraint,
              // automatically populated
              source: appointment.source,
              backgroundColor: appointment.backgroundColor,
              borderColor: appointment.borderColor,
              textColor: appointment.textColor,
              resourceId: appointment.resourceId,
              visitIdString: appointment.visitIdString,
              visitId: appointment.visitId,
              visit: null,
              serviceId: appointment.serviceId,
              cancellationReason: appointment.cancellationReason,
              isCancellationAlert: appointment.isCancellationAlert,
              cancellationDate: appointment.cancellationDate,
              cancelled: appointment.cancelled,
              editing: appointment.editing,
            };
            docData.className = appointment.className.split(' ');

            const appointmentData = docData;
            if (appointmentData.serviceId) {
                appointmentData.service = this.currentDataService.services.find(service => service.serviceId === appointment.serviceId);
            }
            if (appointmentData.visitId) {
                appointmentData.visit = allVisits.find(visit => visit.visitId === appointmentData.visitId);
            }
            appointmentData.start = moment.utc(appointmentData.start).toISOString();
            appointmentData.end = moment.utc(appointmentData.end).toISOString();
            appointmentData.className = [];
            // tslint:disable-next-line:max-line-length
            const appointmentIndex = this.currentDataService.appointments.findIndex(appointment => appointment.appointmentId === appointmentData.appointmentId);
            if (appointmentIndex === -1 && !appointmentData.cancelled) {
                this.currentDataService.appointments.push(appointmentData);
            } else if (appointmentIndex !== -1 && !appointmentData.cancelled) {
                this.currentDataService.appointments.splice(appointmentIndex, 1, appointmentData);
            }
          });
          if (allVisitsIndex === allVisitsLength) {
            allVisitsIndex = 0;
          }
        });
      });
    }

    getStaffUnavailability() {
      let activeDay = this.currentDate;
      activeDay.setDate(activeDay.getDate() - 14);
      const startOfBusinessDay = moment(new Date).hour(0).minute(0).second(0);
      const endOfBusinessDay = moment(new Date).hour(23).minute(59).second(59);
      const allStaffSchedules: Event[] = [];
      this.tempAppointments = [];
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
                  this.tempAppointments.push(staffUnavailSched);
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
              this.tempAppointments.push(staffUnavailSched);
          }
        });
        // increment the day
        activeDay.setDate(activeDay.getDate() + 1);
      }
      this.currentDataService.appointments = this.currentDataService.appointments.filter(app => app.rendering !== 'background');
      this.tempAppointments.forEach(ta => {
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

    onRightClick(event, item) {
        if (this.hoveredEvent) {
          document.getElementById('hoverPanel').style.opacity = '0';
          this.contextMenuOpen = true;
          this.contextMenuService.show.next({
            contextMenu: this.contextMenu,
            event: event,
            item: this.hoveredEvent,
          });
          event.stopPropagation();
        }
        event.preventDefault();
    }

    patientHistoryClicked() {
    }

    patientCheckInClick() {
    }

    toggleVisitPanel(id) {
        this.actionPanelOpened = true;
        this.router.navigate(['/schedule', { outlets: { 'action-panel': ['visit-details', id] } }]);
    }

    onTap(event) {
    }
    closeSidePanel() {
      this.actionPanelOpened = false;
      // this.appointmentsListener();
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

    removeAppointment(currentAppointmentId) {
      const appointmentIndex = this.currentDataService.appointments.findIndex(appointment => appointment.appointmentId === currentAppointmentId);
      this.currentDataService.appointments.splice(appointmentIndex, 1);
    }

    cancelAppointment(appointment) {
        this.currentAppointment = appointment;
        this.showCancelAppointment = true;
        this.showCancelVisit = false;
        this.showCreate = false;
    }

    cancelVisit() {
        this.showCancelVisit = true;
        this.showCancelAppointment = false;
        this.showCreate = false;
    }

    noShowAppointment() {
        this.patientNoShow++;
    }

    moveAppointment() {
    }

    appointmentNudge() {
    }

    appointmentNotification() {
    }

    appointmentPrintLable() {
    }

    private areMomentsBetweenSelectedStartEnd(start, end, resourceId) {
        const isStartEqualOrAfter = moment(this.selectedTimeSlotStartTime).isSameOrAfter(start);
        const isEndEqualOrBefore = moment(this.selectedTimeSlotEndTime).isSameOrBefore(end);
        const isResourceEqual = this.selectedTimeSlotResourceId === resourceId ? true : false;

        if (isStartEqualOrAfter && isEndEqualOrBefore && isResourceEqual) {
            return true;
        } else {
            return false;
        }
    }

    private getDuration(start, end) {
        const duration = moment.duration(end.diff(start));
        const minutes = duration.asMinutes();
        return minutes;
    }

    toggleCreateVisitPanel(start, end, resourceId) {
        if (!this.actionPanelOpened) {
            this.actionPanelOpened = true;
            this.selectedTimeSlotStartTime = start;
            this.selectedTimeSlotEndTime = end;
            this.selectedTimeSlotResourceId = resourceId;
        } else {
            if (this.areMomentsBetweenSelectedStartEnd(start, end, resourceId)) {
                this.selectedTimeSlotStartTime = null;
                this.selectedTimeSlotEndTime = null;
                this.selectedTimeSlotResourceId = null;
                this.router.navigate(['/schedule', { outlets: { 'action-panel': null } }]);
                this.eventsService.closeCreateVisitPanel.next();
            } else {
                this.actionPanelOpened = true;
                this.selectedTimeSlotStartTime = start;
                this.selectedTimeSlotEndTime = end;
                this.selectedTimeSlotResourceId = resourceId;
            }
        }
    }

    displayCalendar() {
        if (this.currentDataService.company) {
            return true;
        } else {
            return false;
        }
    }

  notConfirmedClicked() {
    this.visitChangingStatus.noShow = false;
    this.visitChangingStatus.confirmed = false;
    this.visitChangingStatus.checkedIn = false;
    this.updateVisit();
  }
  confirmedClicked() {
    this.visitChangingStatus.noShow = false;
    this.visitChangingStatus.confirmed = true;
    this.visitChangingStatus.checkedIn = false;
    this.updateVisit();
  }
  checkInClicked() {
    this.visitChangingStatus.noShow = false;
    this.visitChangingStatus.confirmed = true;
    this.visitChangingStatus.checkedIn = true;
    this.updateVisit();
  }
  noShowClicked() {
    this.visitChangingStatus.confirmed = false;
    this.visitChangingStatus.checkedIn = false;
    this.visitChangingStatus.noShow = true;
    this.updateVisit();
  }

  visitStatusClicked() {
    if (this.visitChangingStatus.noShow === false && this.visitChangingStatus.confirmed === false && this.visitChangingStatus.checkedIn === false) {
      this.visitChangingStatus.noShow = false;
      this.visitChangingStatus.confirmed = true;
      this.visitChangingStatus.checkedIn = false;
    }
    else if (this.visitChangingStatus.noShow === false && this.visitChangingStatus.confirmed === true && this.visitChangingStatus.checkedIn === false) {
      this.visitChangingStatus.noShow = false;
      this.visitChangingStatus.confirmed = true;
      this.visitChangingStatus.checkedIn = true;
    }
    else if (this.visitChangingStatus.noShow === false && this.visitChangingStatus.confirmed === true && this.visitChangingStatus.checkedIn === true) {
      this.visitChangingStatus.noShow = false;
      this.visitChangingStatus.confirmed = false;
      this.visitChangingStatus.checkedIn = false;
    }

    // update all appointments connected to this Visit
    const apptsToUpdate: Event[] = this.currentDataService.appointments.filter(a => a.visitId === this.visitChangingStatus.visitId);
    apptsToUpdate.forEach(atu => {
      const theIndex = this.currentDataService.appointments.findIndex(appt => appt.appointmentId === atu.appointmentId);
      this.currentDataService.appointments[theIndex].visit.noShow = this.visitChangingStatus.noShow;
      this.currentDataService.appointments[theIndex].visit.confirmed = this.visitChangingStatus.confirmed;
      this.currentDataService.appointments[theIndex].visit.checkedIn = this.visitChangingStatus.checkedIn;
    });
    this.visitSchedule.refetchEvents();
    this.visitService.updateVisit(this.visitChangingStatus).pipe(takeUntil(this.unsub)).subscribe(v => {
      this.visitChangingStatus = null;
    });
  }

  updateVisit() {
    this.visitService.updateVisit(this.visitChangingStatus).pipe(takeUntil(this.unsub)).subscribe(v => {
      this.visitChangingStatus = null;
      // this.appointmentsListener();
    });
  }
}
