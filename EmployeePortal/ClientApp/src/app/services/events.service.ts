import { Injectable, EventEmitter } from '@angular/core';
import { Event, PEvent, BEvent, Appointment, DbAppointment } from '../models/scheduler/event';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import { AppointmentViewModel } from '../models/appintment-viewmodel';
import { Visit } from '../models/visit';
import { Subject } from 'rxjs/Subject';
import { VisitService } from './visit.service';
import { AppointmentService } from './appointments.service';
import { CurrentDataService } from './currentData.service';

@Injectable()
export class EventsService {
      planningMode: boolean;
      selectedPref: string;
      selectedIcon;
      preferredAppoints: any[] = [];

      // Observable string sources
    private componentMethodCallSource = new Subject<any>();
    private closePanelCallSource = new Subject<any>();
    private updateCreateVisitTimeSource = new Subject<any>();
    private updateCreateVisitResourceIdSource = new Subject<any>();
    private removeAppointmentCallSource = new Subject<any>();

    appointmentUpdated = new Subject<any>();
    appointmentAdded = new Subject<any>();
    closeCreateVisitPanel = new Subject<any>();
    public actionPanelOpened = new Subject<any>();

    appointmentUpdatedListener = this.appointmentUpdated.asObservable();
    appointmentAddedListener = this.appointmentAdded.asObservable();
    closeCreateVisitPanelListener = this.closeCreateVisitPanel.asObservable();
    actionPanelOpenedListener = this.actionPanelOpened.asObservable();

    private patientListUpdatedSource = new Subject<any>();

    // Observable string streams
    appointmentsListenerCalled$ = this.componentMethodCallSource.asObservable();
    closeSidePanel$ = this.closePanelCallSource.asObservable();
    updateCreateVisitTime$ = this.updateCreateVisitTimeSource.asObservable();
    removeAppointment$ = this.removeAppointmentCallSource.asObservable();
    updateCreateVisitResourceId$ = this.updateCreateVisitResourceIdSource.asObservable();
    staffSchedulesListenerCalled$ = this.componentMethodCallSource.asObservable();
    patientListChanged$ = this.patientListUpdatedSource.asObservable();

    now = new Date(Date.now());
    selectedDate = new BehaviorSubject(new Date(Date.now()));
    currentDate = this.selectedDate.asObservable();
    tempEvent: AppointmentViewModel = {
        start: this.now,
        end: this.now,
        resourceId: '1',
        isSelection: false
    };

    constructor(private visitService: VisitService,
        private appointmentService: AppointmentService,
        public currentDataService: CurrentDataService) { }

    addEvent(app: Appointment) {
      const appointment: DbAppointment = {
        appointmentId: 0,
        title: app.title,
        allDay: app.allDay,
        start: moment(app.start).toDate(),
        end: moment(app.end).toDate(),
        url: app.url,
        className: ' ',
        editable: app.editable,
        startEditable: app.startEditable,
        durationEditable: app.durationEditable,
        resourceEditable: app.resourceEditable,
        rendering: app.rendering,
        overlap: app.overlap,
        constraint: app.constraint,
        source: null,
        backgroundColor: app.backgroundColor,
        borderColor: app.borderColor,
        textColor: app.textColor,
        resourceId: app.resourceId,
        visitIdString: app.visitIdString,
        visitId: app.visitId,
        serviceId: app.serviceId,
        cancellationReason: app.cancellationReason,
        isCancellationAlert: app.isCancellationAlert,
        cancellationDate: moment(app.cancellationDate).toDate(),
        cancelled: app.cancelled,
        editing: app.editing
      };

      // app.visitId = this.currentDataService.visits.find(v => v.visitIdString === app.visitIdString).visitId;
      return this.appointmentService.addAppointment(appointment as DbAppointment);
    }

    createVisit(visit: Visit) {
      return this.visitService.addVisit(visit);
    }

    updateAppointment(appointment) {
        const appToPush = {
            title: appointment.title,
            start: moment(appointment.start).toDate(),
            visitIdString: appointment.visitIdString,
            end: moment(appointment.end).toDate(),
            resourceId: appointment.resourceId,
            serviceId: appointment.serviceId,
            appointmentId: appointment.appointmentId,
            cancellationReason: appointment.cancellationReason,
            isCancellationAlert: appointment.isCancellationAlert,
            cancellationDate: moment(appointment.cancellationDate).toDate(),
            cancelled: appointment.cancelled,
            className: '',
            visitId: appointment.visitId,
            editing: appointment.editing
        };
        // serialize the className array for the DbAppointment
        appointment.className.forEach(c => {
          appToPush.className = appToPush.className + c + ' ';
        });
        appToPush.className = appToPush.className.trim();

        return this.appointmentService.updateAppointment(appToPush);
    }

    getCurrentAppointment(visitIdString) {
        const companyName = 'DermMedica';
        const clinicName = 'DermMedica';
        return this.appointmentService.getAppointmentsByVisitId(visitIdString);
    }

    updateEvent(app: Appointment) {
        const appointment: DbAppointment = {
            appointmentId: app.appointmentId,
            title: app.title,
            allDay: app.allDay,
            start: moment(app.start).toDate(),
            end: moment(app.end).toDate(),
            url: app.url,
            className: '',
            editable: app.editable,
            startEditable: app.startEditable,
            durationEditable: app.durationEditable,
            resourceEditable: app.resourceEditable,
            // background or inverse-background or empty
            rendering: app.rendering,
            overlap: app.overlap,
            constraint: app.constraint,
            // automatically populated
            source: null,
            backgroundColor: app.backgroundColor,
            borderColor: app.borderColor,
            textColor: app.textColor,
            resourceId: app.resourceId,
            visitIdString: app.visitIdString,
            visitId: app.visitId,
            serviceId: app.serviceId,
            cancellationReason: app.cancellationReason,
            isCancellationAlert: app.isCancellationAlert,
            cancellationDate: moment(app.cancellationDate).toDate(),
            cancelled: app.cancelled,
            editing: app.editing
          };
          // serialize the className array for the DbAppointment
          app.className.forEach(c => {
            appointment.className = appointment.className + c + ' ';
          });
          appointment.className = appointment.className.trim();

          return this.appointmentService.updateAppointment(appointment);
    }

    getEvents(visitId: number) {
        const companyName = 'DermMedica';
        const clinicName = 'DermMedica';
        return this.appointmentService.getAppointmentsByVisitId(visitId);
    }

    castFirestoreObjectToEvent(event: any) {
        const keys = Object.keys(event);
        const start = moment(event.start);
        const end = moment(event.end);
        const exportEvent: Event = {
            title: event.title,
            start: start.toJSON(),
            visitIdString: event.visitIdString,
            end: end.toJSON(),
            resourceId: event.resourceId,
            appointmentId: event.appointmentId,
            cancellationReason: event.cancellationReason,
            isCancellationAlert: event.isCancellationAlert,
            cancellationDate: event.cancellationDate,
            cancelled: event.cancelled,
            service: event.Service,
            visit: null
        };
        keys.forEach(key => {
            if (Object.keys(exportEvent).indexOf(key) !== -1) {
                exportEvent[key] = event[key];
            }
            if (key === 'start') {
                exportEvent[key] = new Date(event[key]).toJSON();
            }
            if (key === 'end') {
                exportEvent[key] = new Date(event[key]).toJSON();
            }
        });
        return exportEvent;
    }

    setTempEvent(event: AppointmentViewModel) {
        this.tempEvent = event;
        this.updateCreateVisitStartTime(event.start, event.end, event.resourceId);
    }

    getTempEvent(): AppointmentViewModel {
        return this.tempEvent;
    }

    setSelectedDate(date: Date) {
        this.selectedDate.next(date);
    }

    // Service message commands
    callAppointmentListenerMethod() {
        this.componentMethodCallSource.next();
    }
    closePanel(event?: any) {
        this.closePanelCallSource.next(event);
    }
    updateCreateVisitStartTime(start, end, resourceId) {
        this.updateCreateVisitTimeSource.next({start, end});
        this.updateCreateVisitResourceIdSource.next(resourceId);
    }

    callRemoveAppointmentMethod(currentAppointmentId) {
        this.removeAppointmentCallSource.next(currentAppointmentId);
    }
}
