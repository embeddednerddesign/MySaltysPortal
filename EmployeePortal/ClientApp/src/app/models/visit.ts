import { Event, Appointment } from './scheduler/event';
import { Patient } from './patient';

export interface Visit {
  visitId: number;
  visitIdString: string;
  patientId: number;
  patient?: Patient;
  visitNotes?: string;
  patientNotes?: string;
  cancellationReason: string;
  isCancellationAlert: boolean;
  cancellationDate?: Date;
  cancelled: boolean;
  appointments: Appointment[];
  totalVisitCost: number;
  checkedIn: boolean;
  confirmed: boolean;
  noShow: boolean;
  date: Date;
  createdBy: string;
}
