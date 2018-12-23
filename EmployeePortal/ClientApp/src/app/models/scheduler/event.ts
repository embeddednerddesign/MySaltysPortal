import { Service } from '../service';
import { Visit } from '../visit';
import { Staff } from '../staff';
export interface Event {
    appointmentId?: number;
    title: string;
    allDay?: boolean;
    start: string;
    end?: string;
    url?: string;
    className?: string[];
    editable?: boolean;
    startEditable?: boolean;
    durationEditable?: boolean;
    resourceEditable?: boolean;
    // background or inverse-background or empty
    rendering?: string;
    overlap?: boolean;
    constraint?: any;
    // automatically populated
    source?: any;
    serviceId?: number;
    service?: Service;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    resourceId?: string;
    visitIdString?: string;
    visitId?: number;
    visit?: Visit;
    cancellationReason?: string;
    isCancellationAlert?: boolean;
    cancellationDate?: Date;
    cancelled?: boolean;
    staffScheduleId?: number;
    staffId?: number;
    staff?: Staff;
    recurrence?: scheduleRecurrence;
    notes?: string;
    endDate?: string;
}

export interface Appointment {
    appointmentId?: number;
    title: string;
    allDay?: boolean;
    start: string;
    end?: string;
    url?: string;
    className?: string[];
    editable?: boolean;
    startEditable?: boolean;
    durationEditable?: boolean;
    resourceEditable?: boolean;
    // background or inverse-background or empty
    rendering?: string;
    overlap?: boolean;
    constraint?: any;
    // automatically populated
    source?: any;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    resourceId?: string;
    visitIdString?: string;
    visitId?: number;
    serviceId?: number;
    service?: Service;
    cancellationReason?: string;
    isCancellationAlert?: boolean;
    cancellationDate?: Date;
    cancelled?: boolean;
    editing?: boolean;
    color?: string;
}

export interface DbAppointment {
    appointmentId?: number;
    title: string;
    allDay?: boolean;
    start: Date;
    end?: Date;
    url?: string;
    className?: string;
    editable?: boolean;
    startEditable?: boolean;
    durationEditable?: boolean;
    resourceEditable?: boolean;
    // background or inverse-background or empty
    rendering?: string;
    overlap?: boolean;
    constraint?: any;
    // automatically populated
    source?: any;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    resourceId?: string;
    visitIdString?: string;
    visitId: number;
    serviceId?: number;
    cancellationReason?: string;
    isCancellationAlert?: boolean;
    cancellationDate?: Date;
    cancelled?: boolean;
    editing?: boolean;
}

export enum scheduleRecurrence {
  NoRepeat = 0,
  Weekly = 1,
  Every2Weeks,
  Every3Weeks,
  Every4Weeks
}

export interface StaffSchedule {
    staffScheduleId: number;
    staffId: number;
    parentId: number;
    title: string;
    recurrence?: scheduleRecurrence;
    notes: string;
    start: string;
    end: string;
    endDate: string;
}

export interface PEvent {
    appointmentId?: string;
    title?: string;
    allDay?: boolean;
    start: string;
    end?: string;
    url?: string;
    className?: string[];
    editable?: boolean;
    startEditable?: boolean;
    durationEditable?: boolean;
    resourceEditable?: boolean;
    // background or inverse-background or empty
    rendering?: string;
    overlap?: boolean;
    constraint?: any;
    // automatically populated
    source?: any;
    color?: string;
    startDate?: string;
    endDate?: string;
    resourceId?: string;
    icon?: string;
    repeat?: boolean;
    internalTitle?: string;
    prefAppoint?: string;
    planningId: string;
    visitIdString?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    patientId?: number;
    dow?: any;
    eventConstraint?: any;


}

export interface BEvent {
    id?: string;
    title?: string;
    allDay?: boolean;
    start: string;
    end?: string;
    url?: string;
    className?: string[];
    editable?: boolean;
    startEditable?: boolean;
    durationEditable?: boolean;
    resourceEditable?: boolean;
    // background or inverse-background or empty
    dow?: any;
    rendering?: string;
    overlap?: boolean;
    constraint?: any;
    // automatically populated
    source?: any;
    color?: string;
    startDate?: string;
    endDate?: string;
    resourceId?: string;
    icon?: string;
    repeat?: boolean;
    internalTitle?: string;
    prefAppoint?: string;
    planningId?: string;
    visitIdString?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    patientId?: number;
    businessId: string;
    eventConstraint?: any;
    selectOverlap: boolean;
}
export interface IEvent {
    appointmentId?: string;
    title?: string;
    allDay?: boolean;
    start: string;
    end?: string;
    url?: string;
    className?: string[];
    editable?: boolean;
    startEditable?: boolean;
    durationEditable?: boolean;
    resourceEditable?: boolean;
    // background or inverse-background or empty
    rendering?: string;
    overlap?: boolean;
    constraint?: any;
    // automatically populated
    source?: any;
    color?: string;
    startDate?: string;
    endDate?: string;
    resourceId?: string;
    icon?: string;
    repeat?: boolean;
    internalTitle?: string;
    prefAppoint?: string;
    planningId: string;
    visitIdString?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    patientId?: number;
    dow?: any;
}
