import * as moment from 'moment';
import { Injectable } from '@angular/core';
import { Patient } from '../models/patient';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Subject, Observable } from 'rxjs';
import { Visit } from '../models/visit';
import { Company } from '../models/company';
import { Appointment, StaffSchedule } from '../models/scheduler/event';
import { Service } from '../models/service';
import { Clinic } from '../models/clinic';
import { Event, DbAppointment } from '../models/scheduler/event';
import { Staff } from '../models/staff';
import { VisitService } from './visit.service';
import { AppointmentService } from './appointments.service';
import { ServicesService } from './services.service';
import { PatientService } from './patient.service';
import { StaffScheduleService } from './staffschedule.service';
import { CompanyService } from './company.service';
import { StaffsService } from './staffs.service';

@Injectable()
export class CurrentDataService {

  private currentDataUpdated = new Subject<any>();
  currentDataUpdated$ = this.currentDataUpdated.asObservable();

  dbappointments: DbAppointment[] = [];

  visits: Visit[] = [];
  appointments: Event[] = [];
  services: Service[];
  staff: Staff[];
  staffSchedules: StaffSchedule[];
  patients: Patient[];
  company: Company;
  clinics: Clinic[];

  currentDate: Date;
  dataStartDate: Date;
  dataCenterDate: Date;
  dataEndDate: Date;

  dirty = true;

  constructor(private companyService: CompanyService,
              private visitService: VisitService,
              private appointmentService: AppointmentService,
              private servicesService: ServicesService,
              private patientService: PatientService,
              private staffsService: StaffsService,
              private staffScheduleService: StaffScheduleService)
  {
    this.visits = [];
    this.appointments = [];
    this.services = [];
    this.staff = [];
    this.staffSchedules = [];
    this.patients = [];
    this.clinics = [];
    this.currentDate = new Date();
    this.dataStartDate = new Date();
    this.dataStartDate.setDate(this.dataStartDate.getDate() - 28);
    this.dataEndDate = new Date();
    this.dataEndDate.setDate(this.dataEndDate.getDate() + 28);
    this.dirty = false;
  }

  currentDataHasBeenUpdated(value) {
    this.currentDataUpdated.next(value);
  }

  checkIfDataRefreshRequired(): boolean {
    let loadingSpinner = false;
    // the date has changed so we need to check if a data refresh from the database is required
    // the dataStartDate and dataEndDate represent the outer limits of the data we have
    // if the current date is within 7 days of the limits or outside the limits, trigger a data refresh and update the limits
    if (moment(this.currentDate).isBefore(moment(this.dataStartDate)) ||
        moment(this.currentDate).isAfter(moment(this.dataEndDate)) ||
      (Math.abs(moment(this.dataStartDate).diff(moment(this.currentDate), 'days')) <= 7) ||
        (Math.abs(moment(this.dataEndDate).diff(moment(this.currentDate), 'days')) <= 7)) {
      // the current date requires a data refresh
      // now we check if the current date is outside the current limits
      // if it is, we don't have data to show the user while the refresh occurs, so show the loading spinner
      if (moment(this.currentDate).isBefore(moment(this.dataStartDate)) ||
      moment(this.currentDate).isAfter(moment(this.dataEndDate))) {
        loadingSpinner = true;
      }
      this.dataEndDate = moment(this.currentDate).add(28, 'days').toDate();
      this.dataStartDate = moment(this.currentDate).subtract(28, 'days').toDate();
      this.fetchCurrentData();
    }
    return loadingSpinner;
  }

  fetchCurrentData() {
    this.refreshCurrentData().subscribe(responseList => {
      this.visits = responseList[0];
      this.dbappointments = responseList[1];
      this.services = responseList[2];
      this.patients = responseList[3];
      this.staff = responseList[4];
      this.staffSchedules = responseList[5];
      this.company = responseList[6];
      this.visits.forEach(v => {
        v.patient = this.patients.find(p => p.patientId === v.patientId);
      });
      this.currentDataHasBeenUpdated(null);
    });
  }

  refreshCurrentData(): Observable<any[]> {
    const visitResponse = this.visitService.getVisits();
    const appointmentResponse = this.appointmentService.getAppointmentsByDate(this.dataStartDate, this.dataEndDate);
    const serviceResponse = this.servicesService.getServices();
    const patientResponse = this.patientService.getAllPatients();
    const staffResponse = this.staffsService.getAllStaff();
    const staffScheduleResponse = this.staffScheduleService.getStaffSchedules();
    const companyResponse = this.companyService.getCompanyById(1);
    return Observable.forkJoin([visitResponse, appointmentResponse, serviceResponse, patientResponse, staffResponse, staffScheduleResponse, companyResponse]);
  }

}
