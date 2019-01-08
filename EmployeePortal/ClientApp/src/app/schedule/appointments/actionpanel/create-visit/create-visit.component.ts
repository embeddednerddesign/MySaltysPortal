import * as moment from 'moment';
import { Component, OnInit, Input, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { AppointmentViewModel } from '../../../../models/appintment-viewmodel';
import { FormControl, Validators } from '@angular/forms';
import { EventsService } from '../../../../services/events.service';
import { ServicesService } from '../../../../services/services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StaffsService } from '../../../../services/staffs.service';
import { Patient } from '../../../../models/patient';
import { PatientService } from '../../../../services/patient.service';
import { Observable } from 'rxjs/Observable';
import { PatientViewModel } from '../../../../models/patient-viewmodel';
import { Service } from '../../../../models/service';
import { Subject } from 'rxjs/Subject';
import { Event, Appointment, DbAppointment } from '../../../../models/scheduler/event';
import { Visit } from '../../../../models/visit';
import { ValidationService } from '../../../../services/validation.service';
import { FormatterService } from '../../../../services/formatter.service';
import { CompanyService } from '../../../../services/company.service';
import { HoursOfOperationService, getBusinessWeek } from '../../../../services/hoursofoperation.service';
import { BusinessWeek } from '../../../../models/hoursofoperation';
import { Company } from '../../../../models/company';
import { ServiceCategory } from '../../../../models/service-category';
import { Staff, StaffService } from '../../../../models/staff';
import { VisitService } from '../../../../services/visit.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { takeUntil, take } from 'rxjs/operators';
import { AppointmentService } from '../../../../services/appointments.service';
import { StaffScheduleService } from '../../../../services/staffschedule.service';
import { ConfirmAppointmentDialogComponent } from '../../../../management/dialogs/confirm-appointment/confirm-appointment.component';
import { MatDialog } from '@angular/material/dialog';
import { MasterOverlayService } from '../../../../services/actionpanel.service';
import { UsersService } from '../../../../services/users.service';
import { isNullOrUndefined } from 'util';
import { CurrentDataService } from '../../../../services/currentData.service';

export const colorCodes = [
  {
    code: '100',
    color: '#6087EB'
  },
  {
    code: '103',
    color: '#5EEBA2'
  },
  {
    code: '104',
    color: '#F21A52'
  }
];

@Component({
  selector: 'app-create-visit',
  templateUrl: './create-visit.component.html',
  styleUrls: ['./create-visit.component.less']
})
export class CreateVisitComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('patientsAutoComplete')
  patientsAutoComplete;

  submitButtonDisabledState = false;

  unsub = new Subject<void>();
  view: Observable<Patient>;
  createPatientPanelVisible = false;
  patientSelected = false;
  serviceSelected = false;
  allServices: Service[];
  clickEvent: AppointmentViewModel;

  customDuration: FormControl;
  visitIdString: FormControl;
  firstName: FormControl;
  lastName: FormControl;
  bdate: FormControl;
  mspNumber: FormControl;
  emailAddress: FormControl;
  phoneNumber: FormControl;
  date = new Date(Date.now());
  startTime = new Date();
  endTime = new Date();
  minTime = new Date();
  maxTime = new Date();
  startTimeIsReadonly = false;
  endTimeIsReadonly = false;
  services: StaffService[] = [];
  selectedServiceId: number;
  selectedService: Service;
  calculatedDuration = '00:10:00';
  minimumDuration: number;
  selectedStaff: number;
  durationInMinutes = '';
  public patientsSource: Patient[] = [];
  public patients: PatientViewModel[] = [];
  public selectedPatient: Patient;
  appointments: Appointment[] = [];
  private businessWeek = new BusinessWeek();
  visit: Visit;

  durationOptions: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
                         55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
                        105, 110, 115, 120];

  constructor(
    private eventService: EventsService,
    private servicesService: ServicesService,
    private userService: UsersService,
    public currentDataService: CurrentDataService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmApptDialog: MatDialog,
    private staffsService: StaffsService,
    private staffScheduleService: StaffScheduleService,
    private patientService: PatientService,
    private masterOverlayService: MasterOverlayService,
    private companyService: CompanyService,
    private hoursOfOperationService: HoursOfOperationService,
    private _eventsService: EventsService,
    private _appointmentsService: AppointmentService,
    public validationService: ValidationService,
    public formatterService: FormatterService,
    public _visitService: VisitService
  ) {
    this.customDuration = new FormControl();
    this.visitIdString = new FormControl();
    this.firstName = new FormControl();
    this.lastName = new FormControl();
    this.bdate = new FormControl('', this.validationService.validateDate);
    this.mspNumber = new FormControl();
    this.emailAddress = new FormControl('', [Validators.email]);
    this.phoneNumber = new FormControl('', this.validationService.validatePhoneNumber);

    this._eventsService.updateCreateVisitTime$.subscribe(time => {
      const startTime = new Date(moment(time.start).toJSON());
      this.setStartTime(startTime);

      const endTime = new Date(moment(time.end).toJSON());
      this.setEndTime(endTime);
      // if (time.start !== time.end) {
      //   const durationTime = moment.utc(moment(time.end).diff(moment(time.start)));
      //   this.calculatedDuration = durationTime.format('HH:mm:ss');
      //   this.durationInMinutes = (durationTime.hours() * 60 + durationTime.minutes()).toString();
      // }
    });

    // this._eventsService.updateCreateVisitResourceId$.subscribe(resource => {
    //   this.selectedStaff = +resource;
    // });
  }

  private setStartTime(time: Date) {
    const dayOfWeek = time.getDay();
    const businessWeek = this.businessWeek;

    this.minTime = businessWeek.openTime(dayOfWeek);
    this.maxTime = businessWeek.closeTime(dayOfWeek);
    this.startTime = businessWeek.isOpen(dayOfWeek, time) ? time : this.date;
    this.startTimeIsReadonly = businessWeek.isClosed(dayOfWeek);
  }

  private setEndTime(time: Date) {
    const dayOfWeek = time.getDay();
    const businessWeek = this.businessWeek;

    this.minTime = businessWeek.openTime(dayOfWeek);
    this.maxTime = businessWeek.closeTime(dayOfWeek);
    this.endTime = businessWeek.isOpen(dayOfWeek, time) ? time : this.date;
    this.endTimeIsReadonly = businessWeek.isClosed(dayOfWeek);
  }

  ngOnInit() {
    this.customDuration.setValue(0);
    this.clickEvent = this.eventService.getTempEvent();

    this.selectedPatient = {
      patientId: 0,
      clientId: 0,
      firstName: '',
      lastName: '',
      birthDate: '',
      homeNumber: '',
      mobileNumber: '',
      email: '',
      address: {
        address1: '',
        address2: '',
        city: '',
        country: 'Canada',
        postalCode: '',
        province: 'British Columbia'
      },
      familyPhysician: {
        doctorId: 0,
        proTitle: '',
        firstName: '',
        lastName: '',
        address: {
          address1: '',
          address2: '',
          city: '',
          country: 'Canada',
          postalCode: '',
          province: 'British Columbia'
        },
        phoneNumber: '',
        faxNumber: '',
        email: '',
        website: '',
        hoursOfOperation: null,
        specialty: '',
      },
      preferredPharmacy: {
        pharmacyId: 0,
        name: '',
        address: {
          address1: '',
          address2: '',
          city: '',
          country: 'Canada',
          postalCode: '',
          province: 'British Columbia'
        },
        phoneNumber1: '',
        phoneNumber2: '',
        phoneNumber3: '',
        faxNumber: '',
        email: '',
        website: '',
        hoursOfOperation: null
      },
      communicationPreference: '',
      sendAppointmentNotifications: false,
      sendRetentionEmails: false,
      isPreferred: false,
      socialHistory: [],
      notesAndAlerts: '',
      services: []
    };

    this.allServices = [];
    this.servicesService.getServices().subscribe(s => {
      s.forEach(serv => {
        this.allServices.push(serv);
      });
    });

    this.companyService.getCompanyById(1).subscribe(company => {
      const thiscompany = company;
      this.minimumDuration = thiscompany.minimumDuration;
      if (this.customDuration.value === 0) {
        this.customDuration.setValue(this.durationInMinutes);
        this.durationInMinutes = this.minimumDuration.toString();
      }

      const companyId = company ? company.companyId : 0;

      this.hoursOfOperationService.getHoursOfOperation(companyId).subscribe(
        res => {
          if (res) {
            this.businessWeek = getBusinessWeek(res.hoursOfOperationDays);
            const startTime = new Date(moment(this.clickEvent.start).toJSON());
            this.setStartTime(startTime);
            const endTime = new Date(moment(this.clickEvent.end).toJSON());
            this.setEndTime(endTime);
          }
          // // if we got here from the Patient panel, load the selectedPatient
          // if (this.patientService.previousPage !== '') {
          //   this.patientSelect(this.patientService.patientPanelPatient);
          //   const todayAt9am = new Date();
          //   todayAt9am.setHours(9);
          //   todayAt9am.setMinutes(0);
          //   todayAt9am.setSeconds(0);
          //   this.startTime = todayAt9am;
          // }
        },
        err => {
          // TODO: decide what to do with err
        }
      );
    });

    // this.selectedStaff = Number(this.clickEvent.resourceId);
    const endTime = moment(this.clickEvent.end);
    const duration = moment.duration(endTime.diff(moment(this.clickEvent.start))).asMinutes();
    this.customDuration.setValue(duration);
    this.durationInMinutes = duration.toString();

    // this.getServicesByStaff(this.selectedStaff);
    const snapshot = this.currentDataService.patients;
    snapshot.forEach(doc => {
      const patient = doc as Patient;
      const viewModel: PatientViewModel = {
        patientId: patient.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        birthDate: patient.birthDate,
        homeNumber: patient.homeNumber,
        mobileNumber: patient.mobileNumber,
        clientId: patient.clientId,
        email: patient.email,
        nickName: patient.nickName,
        gender: patient.gender,
        address: patient.address,
        addressId: patient.addressId,
        familyPhysician: patient.familyPhysician,
        doctorId: patient.doctorId,
        preferredPharmacy: patient.preferredPharmacy,
        pharmacyId: patient.pharmacyId,
        communicationPreference: patient.communicationPreference,
        sendAppointmentNotifications: patient.sendAppointmentNotifications,
        sendRetentionEmails: patient.sendRetentionEmails,
        isPreferred: patient.isPreferred,
        socialHistory: patient.socialHistory,
        notesAndAlerts: patient.notesAndAlerts,
        services: patient.services
      };
      this.patientsSource.push(viewModel);
      this.patients = this.patientsSource.slice();
    });
    this._eventsService.currentDate.takeUntil(this.unsub).subscribe(date => {
      this.date = date;
    });
    this._eventsService.closeCreateVisitPanelListener.takeUntil(this.unsub).subscribe(() => {
      this.closePanel();
    });
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  // createPatient() {
  //   this.selectedPatient = {
  //     patientId: 0,
  //     clientId: this.mspNumber.value,
  //     firstName: this.firstName.value,
  //     lastName: this.lastName.value,
  //     birthDate: this.bdate.value.toJSON(),
  //     homeNumber: '',
  //     mobileNumber: this.phoneNumber.value,
  //     email: this.emailAddress.value,
  //     address: {
  //       address1: '',
  //       address2: '',
  //       city: '',
  //       country: 'Canada',
  //       postalCode: '',
  //       province: 'British Columbia'
  //     },
  //     familyPhysician: {
  //       doctorId: 0,
  //       proTitle: '',
  //       firstName: '',
  //       lastName: '',
  //       address: {
  //         address1: '',
  //         address2: '',
  //         city: '',
  //         country: 'Canada',
  //         postalCode: '',
  //         province: 'British Columbia'
  //       },
  //       phoneNumber: '',
  //       faxNumber: '',
  //       email: '',
  //       website: '',
  //       hoursOfOperation: null,
  //       specialty: '',
  //     },
  //     preferredPharmacy: {
  //       pharmacyId: 0,
  //       name: '',
  //       address: {
  //         address1: '',
  //         address2: '',
  //         city: '',
  //         country: 'Canada',
  //         postalCode: '',
  //         province: 'British Columbia'
  //       },
  //       phoneNumber1: '',
  //       phoneNumber2: '',
  //       phoneNumber3: '',
  //       faxNumber: '',
  //       email: '',
  //       website: '',
  //       hoursOfOperation: null
  //     },
  //     communicationPreference: '',
  //     sendAppointmentNotifications: false,
  //     sendRetentionEmails: false,
  //     isPreferred: false,
  //     socialHistory: [],
  //     notesAndAlerts: '',
  //     services: []
  //   };
  //   this.patientService.addPatient(this.selectedPatient).subscribe(success => {
  //     this.selectedPatient.birthDate = moment(this.selectedPatient.birthDate).format('MMMM Do YYYY');
  //     this.createPatientPanelVisible = false;
  //     this.patientSelected = true;
  //   });
  // }

  public color(code: string): any {
    const color = colorCodes.find(x => x.code === code);
    return color;
  }

  // newPatientHandler() {
  //   const autoCompleteText = this.patientsAutoComplete.text.split(' ');
  //   this.firstName.setValue(autoCompleteText[0]);
  //   if (autoCompleteText.length > 1) {
  //     this.lastName.setValue(autoCompleteText[1]);
  //   }
  //   this.patientsAutoComplete.toggle(false);
  //   this.patientSelected = false;
  //   this.selectedPatient = null;
  //   this.createPatientPanelVisible = true;
  // }

  patientSelect(patient: any): void {
    this.selectedPatient = patient as Patient;
    this.patientSelected = true;
    this.createPatientPanelVisible = false;

    const visitIdString = this.selectedPatient.patientId.toString() + this.date.toDateString();
    this._visitService.getVisitByEvent(visitIdString).pipe(takeUntil(this.unsub)).subscribe(visit => {
      if (visit && !visit.cancelled) {
        this.visit = visit;
      } else {
        const visitToAdd: Visit = {
          visitId: 0,
          visitIdString: visitIdString,
          patientId: this.selectedPatient.patientId,
          patient: null,
          visitNotes: '',
          patientNotes: '',
          cancellationReason: '',
          isCancellationAlert: false,
          cancellationDate: null,
          cancelled: false,
          appointments: this.appointments,
          totalVisitCost: 0,
          checkedIn: false,
          confirmed: false,
          noShow: false,
          date: this.date,
          createdBy: this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName
        };
        this._visitService.addVisit(visitToAdd).subscribe(newVisit => {
            // this._visitService.visitCreatedEmitter();
            this.visit = newVisit;
        });
      }
    });
  }

  createVisit() {
    this.closePanel();
    this.router.navigate(['/schedule', { outlets: { 'action-panel': ['visit-details', this.visit.visitId] } }]);
  }

  // staffSelectionChanged() {
  //   this.selectedServiceId = 0;
  //   this.getServicesByStaff(this.selectedStaff);
  // }

  serviceSelectionChange() {
    this.serviceSelected = true;
  }

  // getServicesByStaff(selectedStaff) {
  //   this.services = [];
  //   this.staffsService.getStaffById(this.selectedStaff).subscribe(snapshot => {
  //     const staffMember = snapshot as Staff;
  //     this.services = staffMember.services;
  //   });
  // }

  getGender(patient) {
    if (patient.gender === 'Female') {
      return 'F';
    } else if (patient.gender === 'Male') {
      return 'M';
    } else {
      return 'U';
    }
  }

  // getLastAppointment(appointments) {
  //   const lastAppointmentDate = new Date(
  //     Math.max.apply(
  //       null,
  //       appointments.map(function(appointment) {
  //         return new Date(appointment.start);
  //       })
  //     )
  //   );
  //   const xx = appointments.find(appointment => {
  //     return new Date(appointment.start).getUTCDate() === lastAppointmentDate.getUTCDate();
  //   });
  //   return xx;
  // }

  patientValueChange(event) {}

  formatValue(itemText: string, autocomplete) {
    // tslint:disable-next-line:quotemark
    const textMatcher = new RegExp(autocomplete.text, 'ig');
    let t = '';
    if (itemText !== null) {
      t = itemText.replace(textMatcher, function(match) {
        // tslint:disable-next-line:quotemark
        return '<strong>' + match + '</strong>';
      });
    }
    return t;
  }

  handleFilter(event) {
    if (event !== null) {
      try {
        this.patients = this.patientsSource.filter(s => s.firstName.toLowerCase().indexOf(event.toLowerCase()) !== -1);
      } catch {
      }
    }
  }

  onPatientAutoCompleteFocus() {
    this.patientsAutoComplete.toggle(true);
  }

  createOk(): boolean {
    if (this.patientSelected && this.serviceSelected && this.startTime) {
      return true;
    } else {
      return false;
    }
  }

  getBirthday(date) {
    return moment(date).format('MMMM Do YYYY');
  }

  getAge(date) {
    return moment(new Date(Date.now())).diff(moment(date), 'years');
  }

  closePanel() {
    if (this.appointments.length < 1) {
      if (this.visit) {
        this._visitService.removeVisit(this.visit).pipe(takeUntil(this.unsub)).subscribe(() => {
          this.closePanelComplete();
          this.eventService.closePanel();
        });
      } else {
        this.closePanelComplete();
        this.eventService.closePanel();
      }
    } else {
      this.closePanelComplete();
      this.eventService.closePanel();
    }
  }

  closePanelComplete() {
    if (this.patientService.previousPage === '') {
      this.router.navigate(['/schedule', { outlets: { 'action-panel': null } }]);
      this.eventService.closePanel();
    } else {
      this.masterOverlayService.masterOverlayState(true);
      this.router.navigateByUrl(this.patientService.previousPage);
      this.patientService.previousPage = '';
      this.eventService.closePanel();
    }
  }

  addAppointment() {
    const time = moment(this.startTime)
      .hours(this.startTime.getHours())
      .minutes(this.startTime.getMinutes())
      .seconds(0)
      .milliseconds(0);

    // const endTime = moment(time).add(moment.duration({ minutes: this.customDuration.value }));
    const endTime = moment(this.endTime)
      .hours(this.endTime.getHours())
      .minutes(this.endTime.getMinutes())
      .seconds(0)
      .milliseconds(0);
    const colorcode = '#DF4931';

    const event: Appointment = {
      title: this.selectedPatient.firstName + ' ' + this.selectedPatient.firstName,
      start: time.toISOString(true),
      end: endTime.toISOString(true),
      resourceId: '1',
      visitIdString: this.selectedPatient.clientId.toString() + this.date.toDateString(),
      cancellationReason: '',
      isCancellationAlert: false,
      cancellationDate: null,
      cancelled: false,
      editing: false,
      service: this.selectedService,
      serviceId: this.selectedService.serviceId,
      color: colorcode,
      visitId: this.visit.visitId
    };

    // check if the selected Staff Member is available during this time based on their StaffSchedule
    const available: Boolean = false;
    // const staffSched = this.currentDataService.staff.find(s => s.staffId === this.selectedStaff).staffSchedules;
    // staffSched.forEach(ss => {
    //   const schedStartTime = moment(ss.start);
    //   const schedEndTime = moment(ss.end);
    //   if (schedStartTime.isSameOrBefore(time) && schedEndTime.isSameOrAfter(endTime)) {
    //     available = true;
    //   }
    // });

    if (!available) {
      this.confirmAppointment(event);
    } else {
      this.addAppointmentToDbAndUI(event);
    }
  }
  addAppointmentToDbAndUI(appointment: Appointment) {
    const event: DbAppointment = {
      title: appointment.title,
      start: moment(appointment.start).toDate(),
      end: moment(appointment.end).toDate(),
      resourceId: appointment.resourceId,
      visitIdString: appointment.visitIdString,
      cancellationReason: appointment.cancellationReason,
      isCancellationAlert: appointment.isCancellationAlert,
      cancellationDate: appointment.cancellationDate,
      cancelled: appointment.cancelled,
      className: '',
      editing: appointment.editing,
      serviceId: appointment.serviceId,
      visitId: appointment.visitId
    };
    // serialize the className array for the DbAppointment
    if (!isNullOrUndefined(appointment.className)) {
      appointment.className.forEach(c => {
        event.className = event.className + c + ' ';
      });
      event.className = event.className.trim();
    }
    // update total cost of Visit
    // this.visit.totalVisitCost += appointment.service.defaultPrice;
    this._appointmentsService.addAppointment(event).pipe(takeUntil(this.unsub)).subscribe(appt => {
      appointment.appointmentId = appt.appointmentId;
      this.appointments.push(appointment);
      this.sortAppointments();
      this._eventsService.appointmentAdded.next();
      this.closePanel();
    });
  }

  public confirmAppointment(dataItem: Appointment) {
    const dialogRef = this.confirmApptDialog.open(ConfirmAppointmentDialogComponent, {
      width: '300px'
    });

    dialogRef
      .afterClosed()
      .takeUntil(this.unsub)
      .subscribe(result => {
        if (result === 'confirm') {
          this.addAppointmentToDbAndUI(dataItem);
        }
      });

    return dialogRef;
  }

  cancelAppointment(index: number) {
    const appointment = this.appointments.splice(index, 1)[0];
    this._appointmentsService.removeAppointment(appointment).pipe(takeUntil(this.unsub)).subscribe(() => {
      this.eventService.callRemoveAppointmentMethod(appointment.appointmentId);
    });
  }

  hexToTranslucentRgbA(hex): string {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      // tslint:disable-next-line:no-bitwise
      const rgba = 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ', 0.1)';
      return rgba;
    } else if (hex === 'red') {
      return this.hexToTranslucentRgbA('#FF3F3F');
    } else if (hex === 'blue') {
      return this.hexToTranslucentRgbA('#3F3FFF');
    } else if (hex === 'green') {
      return this.hexToTranslucentRgbA('#3F9F3F');
    } else {
      return 'rgba(0,0,0,0)';
    }
  }

  getTime(time) {
    return moment(time).format('h:mm a');
  }

  getTitle(title) {
    const splitTitle = title.split(' ');
    let serviceFullName = '';
    for (let i = 1; i < splitTitle.length; i++) {
      serviceFullName += splitTitle[i];
      if (i < (splitTitle.length - 1)) {
        serviceFullName += ' ';
      }
    }
    if (serviceFullName === '') {
      serviceFullName = title;
    }
    return serviceFullName;
  }

  updateSubmitButtonState() {
    if ((this.emailAddress.value !== '' && this.emailAddress.hasError('email')) || this.phoneNumber.hasError('phoneError')) {
      this.submitButtonDisabledState = true;
    } else {
      this.submitButtonDisabledState = false;
    }
  }

  sortAppointments() {
    this.appointments.sort((a: Appointment, b: Appointment) => {
      if (new Date(a.start) < new Date(b.start)) {
        return -1;
      } else if (new Date(a.start) > new Date(b.start)) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
