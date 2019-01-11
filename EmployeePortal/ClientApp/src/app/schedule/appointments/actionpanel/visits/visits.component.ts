import * as moment from 'moment';
import { Component, OnInit, AfterViewInit, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventsService } from '../../../../services/events.service';
import { Event, Appointment, DbAppointment } from '../../../../models/scheduler/event';
import { PatientService } from '../../../../services/patient.service';
import { Patient } from '../../../../models/patient';
import { Visit } from '../../../../models/visit';
import { VisitService } from '../../../../services/visit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../../services/products.service';
import { Product } from '../../../../models/product';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { ServicesService } from '../../../../services/services.service';
import { AppointmentViewModel } from '../../../../models/appintment-viewmodel';
import { StaffsService } from '../../../../services/staffs.service';
import { Service } from '../../../../models/service';
import { Observable } from 'rxjs/Observable';
import { startWith, map, takeUntil, take } from 'rxjs/operators';
import { MatDialogRef, MatDialog, MatSelect } from '@angular/material';
import { PatientViewModel } from '../../../../models/patient-viewmodel';
import { CancelVisitDialogComponent } from '../cancel-visit-dialog/cancel-visit-dialog.component';
import { Staff } from '../../../../models/staff';
import { CompanyService } from '../../../../services/company.service';
import { Company } from '../../../../models/company';
import { ServiceCategory } from '../../../../models/service-category';
import { AppointmentService } from '../../../../services/appointments.service';
import { ConfirmApptCancelDialogComponent } from '../../../../management/dialogs/confirm-appt-cancel/confirm-appt-cancel.component';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { MasterOverlayService } from '../../../../services/actionpanel.service';
import { isNullOrUndefined } from 'util';
import { CurrentDataService } from '../../../../services/currentData.service';
import { ConfirmAppointmentDialogComponent } from '../../../../management/dialogs/confirm-appointment/confirm-appointment.component';
import { HoursOfOperationService, getBusinessWeek } from '../../../../services/hoursofoperation.service';
import { BusinessWeek } from '../../../../models/hoursofoperation';

export const colorCodes = [
  {
    code: '100',
    color: '#6087EB',
    backgroundColor: '#FDF4F5'
  },
  {
    code: '103',
    color: '#5EEBA2',
    backgroundColor: '#FEF9F5'
  },
  {
    code: '104',
    color: '#F21A52',
    backgroundColor: '#F9FCF5'
  }
];
@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.less']
})
export class VisitsComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('patientsAutoComplete')
  patientsAutoComplete;
  @ViewChild('patientNotesEntry') patientNotesEntry;

  editIsEnabled = false;
  visitNotesEditIsEnabled = false;

  createPatientPanelVisible = false;
  patientSelected = false;
  firstName: FormControl;
  lastName: FormControl;
  visitIdString: string;
  recentVisits: Visit[];
  recentAppointments: Event[] = [];
  recentProducts: Product[];
  allVisitProducts: Product[];
  patientNotesInactive = false;
  visitAppointments: Appointment[] = [];
  currentAppointment: any = {};
  patientId: number;
  selectedPatientId: number;
  panelOpenState = false;
  patient: Patient;
  visit: Visit;
  visitNotes: FormControl = new FormControl();
  patientLoading: boolean;
  appointmentsLoading: boolean;
  showCreate = false;
  showCancelAppointment = false;
  showCancelVisit = false;
  selectedProduct: FormControl = new FormControl();
  allServicesControl: FormControl = new FormControl();
  allAvailableProducts: Product[] = [];
  filteredProducts: Observable<Product[]>;
  filteredStaff: Observable<Staff>[];
  selectedProducts: Product[] = [];
  totalOfProductPrices: string = '';
  public patientsSource: Patient[] = [];
  public patients: PatientViewModel[] = [];
  public selectedPatient: Patient;

  productsunsub: any;
  unsub: Subject<void> = new Subject<void>();
  billableTotal: number;
  selectedService: string;
  services: Service[] = [];
  date: FormControl;
  calculatedDuration: number;
  minimumDuration: number;
  clickEvent: AppointmentViewModel;
  customDuration: FormControl;
  selectedStaff: number;
  showGift = false;
  cancelVisitComponentRef: MatDialogRef<CancelVisitDialogComponent>;
  patientEdit = false;

  durationOptions: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
    55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
   105, 110, 115, 120];

  startTime = new Date();
  endTime = new Date();
  minTime = new Date();
  maxTime = new Date();
  defaultDate = new Date(Date.now());
  startTimeIsReadonly = false;
  endTimeIsReadonly = false;
  private businessWeek = new BusinessWeek();

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private visitService: VisitService,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router,
    private masterOverlayService: MasterOverlayService,
    private productService: ProductsService,
    private companyService: CompanyService,
    private hoursOfOperationService: HoursOfOperationService,
    private servicesService: ServicesService,
    private eventService: EventsService,
    private staffsService: StaffsService,
    public currentDataService: CurrentDataService,
    private confirmApptDialog: MatDialog,
    private cancelDialog: MatDialog
  ) {
    this.customDuration = new FormControl();
    this.visitNotes = new FormControl();
    this.date = new FormControl(new Date());
  }

  ngOnInit() {
    this.eventService.appointmentUpdated.pipe(takeUntil(this.unsub)).subscribe(appointment => {
      this.updateAppointmentEventHandler(appointment);
    });
    this.clickEvent = this.eventService.getTempEvent();
    this.calculatedDuration = this.currentDataService.company.minimumDuration;
    this.startTime = new Date(moment(this.clickEvent.start).toJSON());
    this.selectedStaff = +this.clickEvent.resourceId;
    this.billableTotal = 0;
    this.selectedProducts = [];
    this.patientLoading = true;
    this.appointmentsLoading = true;
    // this.getServicesByStaff(this.selectedStaff);
    this.route.params.takeUntil(this.unsub).subscribe(params => {
      this.visitIdString = params['id'];
      this.getVisitDetails();
      // this.productsListener();
    });

    this.companyService.getCompanyById(1).subscribe(company => {
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
        }
      );
    });

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
        familyPhysician: patient.familyPhysician,
        preferredPharmacy: patient.preferredPharmacy,
        communicationPreference: patient.communicationPreference,
        sendAppointmentNotifications: patient.sendAppointmentNotifications,
        sendRetentionEmails: patient.sendRetentionEmails,
        isPreferred: patient.isPreferred,
        socialHistory: patient.socialHistory,
        notesAndAlerts: patient.notesAndAlerts,
        services: patient.services
      };
      this.patientsSource.push(viewModel);
    });
    this.patients = this.patientsSource.slice();
  }

  private setStartTime(time: Date) {
    const dayOfWeek = time.getDay();
    const businessWeek = this.businessWeek;

    this.minTime = businessWeek.openTime(dayOfWeek);
    this.maxTime = businessWeek.closeTime(dayOfWeek);
    this.startTime = businessWeek.isOpen(dayOfWeek, time) ? time : this.defaultDate;
    this.startTimeIsReadonly = businessWeek.isClosed(dayOfWeek);
  }

  private setEndTime(time: Date) {
    const dayOfWeek = time.getDay();
    const businessWeek = this.businessWeek;

    this.minTime = businessWeek.openTime(dayOfWeek);
    this.maxTime = businessWeek.closeTime(dayOfWeek);
    this.endTime = businessWeek.isOpen(dayOfWeek, time) ? time : this.defaultDate;
    this.endTimeIsReadonly = businessWeek.isClosed(dayOfWeek);
  }

  filter(val: any): Product[] {
    if (val.name) {
      return this.allAvailableProducts.filter(option => option.name.toLowerCase().includes(val.name.toLowerCase()));
    } else {
      return this.allAvailableProducts.filter(option => option.name.toLowerCase().includes(val.toLowerCase()));
    }
  }

  productDisplayFn(user?: Product): string | undefined {
    return user ? user.name : undefined;
  }

  ngAfterViewInit() {}

  ngOnChanges() {}

  closePanel() {
    if (this.patientService.previousPage === '') {
      this.router.navigate(['/schedule', { outlets: { 'action-panel': null } }]);
      this.eventService.closePanel();
    } else {
      this.masterOverlayService.masterOverlayState(true);
      this.router.navigateByUrl(this.patientService.previousPage);
      this.patientService.previousPage = '';
      this.eventService.closePanel();
    }


    // const removeOverlay: HTMLElement = document.querySelector('.overlay') as HTMLElement;
    // (<HTMLElement>removeOverlay).classList.add('hidden');

    // const gridBody = document.getElementsByClassName('fc-time-grid fc-unselectable');
    // gridBody[0].classList.remove('overlay-On');
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  onEnter() {}

  getPatientDetails() {
    this.patient = this.currentDataService.patients.find(p => p.patientId === this.patientId);
    const makeBDComparable = new Date(this.patient.birthDate);
    makeBDComparable.setFullYear(new Date().getFullYear());
    if (moment(new Date()).isBetween(moment(makeBDComparable).subtract(7, 'days'), moment(makeBDComparable).add(7, 'days'))) {
      this.showGift = true;
    }
    this.patientLoading = false;
  }

  updateAppointmentEventHandler(appointment: Appointment) {
    if (!isNullOrUndefined(this.visitAppointments)) {
      this.updateEventInUI(appointment, false);
    }
    // const index = this.currentDataService.appointments.findIndex(a => a.appointmentId === appointment.appointmentId);
    // if (index > -1) {
    //   this.currentDataService.appointments.splice(index, 1, appointment);
    // }
  }

  getVisitDetails() {
    let thevisit = this.currentDataService.visits.find(v => v.visitId === Number(this.visitIdString));
    if (isNullOrUndefined(thevisit)) {
      thevisit = this.currentDataService.visits.find(v => v.visitIdString === this.visitIdString);
    }
    this.visit = thevisit;

    // first, let's reload the appointment list for the visit
    this.visitAppointments = this.currentDataService.appointments.filter(a => a.visitId === this.visit.visitId);
    this.visitAppointments.forEach(va => {
      if (!va.cancelled) {
        va.editing = false;
      }
      va.color = va.color;
    });

    if (this.visit.visitNotes) {
      this.visitNotes.setValue(this.visit.visitNotes);
    }
    this.patientId = this.visit.patientId;
    // this.productsListener();
    this.sortAppointments();
    this.getPatientDetails();
    // const visitsSnapshot = this.currentDataService.visits.filter(v => v.patientId === this.patientId);
    // this.recentVisits = [];
    // visitsSnapshot.forEach(doc => {
    //   const visit = doc as Visit;
    //   this.recentVisits.push(visit);
    // });
    // this.compileAppointmentsFromRecentVisits();
    // this.compileProductsFromRecentVisits();

    this.appointmentsLoading = false;
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

  updateEventInUI(event, eventIsNew?) {
    let theappointmentinquestion = event as Appointment;
    const newVisitAppointments = this.visitAppointments.slice();
    if (!eventIsNew) {
      const theindex = newVisitAppointments.findIndex(a => a.appointmentId === event.appointmentId);
      theappointmentinquestion = newVisitAppointments[theindex];
      newVisitAppointments.splice(theindex, 1);
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
      if (!isNullOrUndefined(event.cancellationDate)) {
        if (event.cancellationDate instanceof Date) {
          theappointmentinquestion.cancellationDate = this.getLocalTimeFromTimeString(this.getTimeStringFromLocalTime(event.cancellationDate));
        }
        else {
          theappointmentinquestion.cancellationDate = this.getLocalTimeFromTimeString(event.cancellationDate);
        }
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
      newVisitAppointments.push(theappointmentinquestion);
      this.visitAppointments = newVisitAppointments.slice();
      this.sortAppointments();
    }
    else {
      // schedule component provides dates with UTC offset subtracted
      // we need dates to be local before they are sent to the db, so we fix that here
      var tempstart = this.getLocalTimeFromTimeString(event.start);
      var momentStart = moment(new Date())
      .year(tempstart.getFullYear())
      .month(tempstart.getMonth())
      .date(tempstart.getDate())
      .hours(tempstart.getHours())
      .minutes(tempstart.getMinutes())
      .seconds(tempstart.getSeconds());
      var tempend = this.getLocalTimeFromTimeString(event.end);
      var momentEnd = moment(new Date())
      .year(tempend.getFullYear())
      .month(tempend.getMonth())
      .date(tempend.getDate())
      .hours(tempend.getHours())
      .minutes(tempend.getMinutes())
      .seconds(tempend.getSeconds());

      event.start = this.fixEventDateToLocal(momentStart);
      event.end = this.fixEventDateToLocal(momentEnd);
      if (!isNullOrUndefined(event.cancellationDate)) {
        event.cancellationDate = this.fixEventDateToLocal(moment(event)).toDate();
      }
      this.eventsService.addEvent(event).subscribe(e => {
        const newVisitAppointments = this.visitAppointments.slice();
        const newAllAppointments = this.currentDataService.appointments.slice();
        const theappointmentinquestion = e;
        const theeventinquestion = e as Event;

        theappointmentinquestion.className = [];
        theappointmentinquestion.service = this.currentDataService.services[this.currentDataService.services.findIndex(s => s.serviceId === event.serviceId)];
        theeventinquestion.service = this.currentDataService.services[this.currentDataService.services.findIndex(s => s.serviceId === event.serviceId)];
        theappointmentinquestion.start = this.getTimeStringFromLocalTime(event.start._d);
        theeventinquestion.start = this.getTimeStringFromLocalTime(event.start._d);
        theappointmentinquestion.end = this.getTimeStringFromLocalTime(event.end._d);
        theeventinquestion.end = this.getTimeStringFromLocalTime(event.end._d);

        theappointmentinquestion.color = event.color;
        theappointmentinquestion.resourceId = event.resourceId;
        theeventinquestion.resourceId = event.resourceId;
        theappointmentinquestion.title = event.title;
        theeventinquestion.title = event.title;
        theeventinquestion.visit = this.visit;

        newVisitAppointments.push(theappointmentinquestion);
        newAllAppointments.push(theeventinquestion);
        this.visitAppointments = newVisitAppointments.slice();
        this.currentDataService.appointments = newAllAppointments.slice();
        this.getVisitDetails();
        this.sortAppointments();
      });
      // this.eventsService.appointmentUpdated.next(theappointmentinquestion);
    }
  }


  compileAppointmentsFromRecentVisits() {
    this.recentAppointments = [];
    this.recentVisits.forEach(visit => {
      this.eventService.getEvents(visit.visitId).subscribe(snapshot => {
        snapshot.forEach(doc => {

          const appointment: Appointment = {
            appointmentId: doc.appointmentId,
            title: doc.title,
            allDay: doc.allDay,
            start: moment(doc.start).toISOString(),
            end: moment(doc.end).toISOString(),
            url: doc.url,
            className: [],
            editable: doc.editable,
            startEditable: doc.startEditable,
            durationEditable: doc.durationEditable,
            resourceEditable: doc.resourceEditable,
            // background or inverse-background or empty
            rendering: doc.rendering,
            overlap: doc.overlap,
            constraint: doc.constraint,
            // automatically populated
            source: doc.source,
            backgroundColor: doc.backgroundColor,
            borderColor: doc.borderColor,
            textColor: doc.textColor,
            resourceId: doc.resourceId,
            visitIdString: doc.visitIdString,
            visitId: doc.visitId,
            serviceId: doc.serviceId,
            cancellationReason: doc.cancellationReason,
            isCancellationAlert: doc.isCancellationAlert,
            cancellationDate: doc.cancellationDate,
            cancelled: doc.cancelled,
            editing: doc.editing,
          };
          appointment.className = doc.className.split(' ');
          this.recentAppointments.push(appointment);
          if (visit.visitIdString === this.visitIdString) {
            this.billableTotal += parseFloat(appointment.service.defaultPrice.toString());
            this.sortAppointments();
          }
        });
      });
    });
  }

  compileProductsFromRecentVisits() {
    this.recentProducts = [];
    this.recentVisits.forEach(visit => {
      this.productService.getProductsByVisit(visit.visitId).pipe(takeUntil(this.unsub)).subscribe(products => {
        products.forEach(product => {
          if (visit.visitId !== this.visit.visitId) {
            this.recentProducts.push(product);
          }
        });
      });
    });
  }

  getAllAvailableProducts() {
    this.productService.getProductCategories().subscribe(categoriesSnapshot => {
      categoriesSnapshot.forEach(doc => {
        const category = doc;
        this.productService.getProductByCategory(category.productCategoryId).subscribe(productSnapshot => {
          productSnapshot.forEach(productDoc => {
            const product = productDoc as Product;
            this.allAvailableProducts.push(product);
          });
        });
      });
    });
  }

  productsListener() {
    this.recentProducts = [];
      this.productService.getProductsByVisit(this.visit.visitId).pipe(takeUntil(this.unsub)).subscribe(products => {
        this.allVisitProducts = products;
        products.forEach(product => {
          const productIndex = this.selectedProducts.findIndex(p => p.productId === product.productId);
          if (productIndex === -1) {
            this.selectedProducts.push(product);
          } else {
            this.selectedProducts.splice(productIndex, 1, product);
          }
          this.billableTotal += parseFloat(product.retailPrice.toString());
        });
        this.updateTotalOfPrices();
    });
  }

  addProductToVisit(event: any) {
    const productToAdd = event.option.value;
    const selectedProduct = this.selectedProducts.find(p => p.productId === productToAdd.productId);
    if (selectedProduct) {
      productToAdd.quantity = selectedProduct.quantity;
    } else {
      productToAdd.quantity = 0;
    }
    productToAdd.quantity += 1;
    const foundIndex = this.recentProducts.findIndex(x => x.name === productToAdd.name);
    if (foundIndex !== -1) {
      this.recentProducts[foundIndex] = productToAdd;
    }
    if (selectedProduct) {
      // tslint:disable-next-line:max-line-length
      this.productService.updateVisitProduct(this.visit.visitId, productToAdd.productId, productToAdd.quantity).pipe(takeUntil(this.unsub)).subscribe(res => {
        this.selectedProduct.setValue('');
        this.productsListener();
      });
    } else {
      // tslint:disable-next-line:max-line-length
      this.productService.addProductToVisit(this.visit.visitId, productToAdd.productId, productToAdd.quantity).pipe(takeUntil(this.unsub)).subscribe(res => {
        this.selectedProduct.setValue('');
        this.productsListener();
      });
    }
  }

  getServicesByStaff(selectedStaff) {
    const listOfServiceCategories: ServiceCategory[] = [];
    this.services = [];
    this.servicesService.getServiceCategories().subscribe(serviceCategoriesSnapshot => {
      serviceCategoriesSnapshot.forEach(cat => {
        listOfServiceCategories.push(cat as ServiceCategory);
      });
      listOfServiceCategories.forEach(servCat => {
        this.staffsService.getStaffById(selectedStaff).subscribe(staffSnapshot => {
          if (staffSnapshot !== null) {
            const listOfServices = (staffSnapshot as Staff).services;
            listOfServices.forEach(serv => {
              this.servicesService.getServiceById(serv.serviceId).subscribe(serviceSnapshot => {
                const theservice = serviceSnapshot as Service;
                if (theservice !== undefined) {
                  if (this.services.filter(x => x.serviceId === theservice.serviceId).length === 0) {
                    this.services.push(serviceSnapshot as Service);
                  }
                }
              });
            });
          }
        });
      });
    });
  }

  getDate(date: string) {
    return moment(new Date(date)).format('MMM DD, YYYY');
  }

  getDayofWeek(date: string) {
    return moment(date).format('dddd');
  }

  getTime(time: string) {
    return moment(this.getLocalTimeFromTimeString(time)).format('h:mm a');
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

  addShift() {
    this.showCreate = true;
  }

  newAppointment(event) {
    const findMaxTime = Math.max(...this.visitAppointments.map(appointment => new Date(appointment.end).getTime()));
    this.startTime = this.getLocalTimeFromTimeString(new Date(findMaxTime).toISOString());
    this.selectedService = event.option.viewValue;
    const selectedService = this.services.find(s => s.serviceName === this.selectedService);
    this.calculatedDuration = selectedService.defaultDurationMinutes;
    this.showCreate = true;
    this.showCancelVisit = false;
    this.showCancelAppointment = false;
    this.sortAppointments();
  }

  cancelVisit() {
    const dialogRef = this.cancelDialog.open(ConfirmApptCancelDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().takeUntil(this.unsub).subscribe(result => {
      if (result === 'cancel') {
        this.onVisitCancellation();
      }
    });
    // this.showCancelVisit = true;
    // this.showCancelAppointment = false;
    this.showCreate = false;
  }

  onCloseVisitCancellation() {
    // this.showCancelVisit = false;
  }

  onVisitCancellation() {
    // this.showCancelVisit = false;
    this.visit.cancellationDate = new Date();
    this.visit.cancelled = true;
    // this.visit.appointments = [];
    // this.appointments.forEach(a => {
    //   if (a.visitId === this.visit.visitId) {
    //     const tempAppt: Appointment = a;
    //     this.visit.appointments.push(tempAppt);
    //   }
    // });
    this.visitService.updateVisit(this.visit).subscribe(v => {
      const appointmentUpdateObservables = [];
      this.visitAppointments.forEach(appointment => {
        appointment.cancellationDate = new Date();
        appointment.cancelled = true;
        appointmentUpdateObservables.push(this.eventService.updateEvent(appointment));
      });
      if (appointmentUpdateObservables.length > 0) {
        forkJoin(appointmentUpdateObservables).pipe(takeUntil(this.unsub)).subscribe(() => {
          for (let i = 0; i < this.visitAppointments.length; i++) {
            this.removeAppointmentFromUI(this.visitAppointments[i].appointmentId);
            i--;
          }
          this.closePanel();
        });
      } else {
        this.closePanel();
      }
    });
  }

  cancelAppointment(appointment) {
    this.currentAppointment = appointment;
    this.showCancelAppointment = true;
    this.showCancelVisit = false;
    this.showCreate = false;
  }

  onAppointmentCancellation() {
    this.showCancelAppointment = false;
    this.currentAppointment.cancellationDate = new Date().toJSON();
    this.currentAppointment.cancelled = true;
    this.eventService.updateEvent(this.currentAppointment).subscribe(() => {
      this.removeAppointmentFromUI(this.currentAppointment.appointmentId);
      this.sortAppointments();
    });
  }

  onCloseAppointmentCancellation(evt) {
    this.showCancelAppointment = false;
  }

  updateAppointment(appointment: Appointment) {
    const app: any = {
      appointmentId: appointment.appointmentId,
      title: appointment.title,
      start: appointment.start,
      end: appointment.end,
      resourceId: appointment.resourceId,
      visitIdString: appointment.visitIdString,
      cancellationReason: appointment.cancellationReason,
      isCancellationAlert: appointment.isCancellationAlert,
      cancellationDate: appointment.cancellationDate,
      cancelled: appointment.cancelled,
      className: appointment.className,
      editing: appointment.editing,
      serviceId: appointment.serviceId,
      visitId: appointment.visitId
    };

    // const app = appointment;
    // app.serviceName = this.selectedService;
    // tslint:disable-next-line:max-line-length
    const start = moment(new Date())
      .year(this.startTime.getFullYear())
      .month(this.startTime.getMonth())
      .date(this.startTime.getDate())
      .hours(this.startTime.getHours())
      .minutes(this.startTime.getMinutes())
      .seconds(this.startTime.getSeconds())
      .toISOString(true);
    app.start = start;
    app.end = moment(start)
      .add(this.calculatedDuration, 'minutes')
      .toISOString(true);
    app.resourceId = this.selectedStaff.toString();
    // app.title = app.serviceName;
    const newService = this.services.find(s => s.serviceName === this.selectedService);
    if (newService) {
      app.color = newService.serviceIDColour;
      app.serviceId = newService.serviceId;
    }
    this.eventService.updateAppointment(app).subscribe(updatedAppointment => {
      const newVisitAppointments = this.visitAppointments.slice();
      const newAllAppointments = this.currentDataService.appointments.slice();
      let theindex = newVisitAppointments.findIndex(a => a.appointmentId === app.appointmentId);
      const theappointmentinquestion = newVisitAppointments[theindex];
      newVisitAppointments.splice(theindex, 1);
      theindex = newAllAppointments.findIndex(a => a.appointmentId === app.appointmentId);
      newAllAppointments.splice(theindex, 1);

      theappointmentinquestion.service = this.currentDataService.services[this.currentDataService.services.findIndex(s => s.serviceId === app.serviceId)];
      theappointmentinquestion.start = app.start;
      theappointmentinquestion.end = app.end;
      theappointmentinquestion.color = app.color;
      theappointmentinquestion.resourceId = app.resourceId;
      theappointmentinquestion.title = theappointmentinquestion.title.split(' ')[0] + ' ' + theappointmentinquestion.service.serviceName;

      newVisitAppointments.push(theappointmentinquestion);
      newAllAppointments.push(theappointmentinquestion);
      this.visitAppointments = newVisitAppointments.slice();
      this.currentDataService.appointments = newAllAppointments.slice();

      this.getVisitDetails();
      this.sortAppointments();
    });
  }

  removeAppointmentFromUI(currentAppointmentId) {
    const foundIndex = this.visitAppointments.findIndex(appointment => appointment.appointmentId === currentAppointmentId);
    this.visitAppointments.splice(foundIndex, 1);
    this.eventService.callRemoveAppointmentMethod(currentAppointmentId);
    this.sortAppointments();
  }

  cancelNewAppointment() {
    this.showCreate = false;
  }

  editAppointment(appointment) {
    this.startTime = this.getLocalTimeFromTimeString(appointment.start);
    this.selectedService = appointment.service.serviceName;
    this.calculatedDuration = moment(appointment.end).diff(moment(appointment.start), 'minutes');
    this.selectedStaff = +appointment.resourceId;
    appointment.editing = !appointment.editing;
    this.sortAppointments();
  }

  getAdjustments() {
    return '$0.00';
  }

  getSubtotal() {
    return this.billableTotal;
  }

  getTax() {
    return this.billableTotal * 0.05;
  }

  getTotal() {
    return this.billableTotal + this.getTax();
  }

  getBalance() {
    return this.getTotal();
  }

  serviceSelectionChange() {
    if (!this.clickEvent.isSelection) {
      const selectedService = this.services.find(s => s.serviceName === this.selectedService);
      this.servicesService
        .getServiceById(selectedService.serviceId)
        .pipe(take(1))
        .subscribe(service => {
          this.calculatedDuration = service.defaultDurationMinutes;
        });
    }
  }

  createAppointment() {
    this.selectedPatient = this.currentDataService.patients.find(p => p.patientId === this.visit.patientId);
    const time = moment(this.date.value)
      .hours(this.startTime.getHours())
      .minutes(this.startTime.getMinutes())
      .seconds(0)
      .milliseconds(0);
    const getCDuration = '00:' + this.calculatedDuration + ':00';
    const endTime = moment(time).add(moment.duration(getCDuration));
    const svc = this.currentDataService.services.find(service => service.serviceName === this.selectedService);

    const event: Appointment = {
      title: this.selectedPatient.firstName + ' ' + svc.serviceName,
      start: time.toISOString(true),
      end: endTime.toISOString(true),
      resourceId: this.selectedStaff.toString(),
      visitIdString: this.selectedPatient.clientId.toString() + this.date.value.toDateString(),
      cancellationReason: '',
      className: [],
      isCancellationAlert: false,
      cancellationDate: null,
      cancelled: false,
      editing: false,
      service: svc,
      serviceId: svc.serviceId,
      color: svc.serviceIDColour,
      visitId: this.visit.visitId
    };

    // check if the selected Staff Member is available during this time based on their StaffSchedule
    let available: Boolean = false;
    const staffSched = this.currentDataService.staff.find(s => s.staffId === this.selectedStaff).staffSchedules;
    staffSched.forEach(ss => {
      const schedStartTime = moment(ss.start);
      const schedEndTime = moment(ss.end);
      if (schedStartTime.isSameOrBefore(time) && schedEndTime.isSameOrAfter(endTime)) {
        available = true;
      }
    });

    this.addAppointmentToDbAndUI(event);
    // if (!available) {
    //   this.confirmAppointment(event);
    // } else {
    //   this.addAppointmentToDbAndUI(event);
    // }
  }
  addAppointmentToDbAndUI(appointment: Appointment) {
    // update total cost of Visit
    this.visit.totalVisitCost += appointment.service.defaultPrice;
    this.updateEventInUI(appointment, true);
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

  createOk(): boolean {
    if (this.patient && this.selectedService) {
      return true;
    } else {
      return false;
    }
  }

  getAge(DOB) {
    const today = new Date();
    const birthDate = new Date(DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getLastAppointment(appointments) {
    const lastAppointmentDate = new Date(
      Math.max.apply(
        null,
        appointments.map(function(appointment) {
          return new Date(appointment.start);
        })
      )
    );
    const xx = appointments.find(appointment => {
      return new Date(appointment.start).getUTCDate() === lastAppointmentDate.getUTCDate();
    });
    return xx;
  }

  removeProduct(product) {
    this.productService.removeProductFromVisit(this.visit.visitId, product.productId).pipe(takeUntil(this.unsub)).subscribe(() => {
      const productIndex = this.selectedProducts.findIndex(p => p.productId === product.productId);
      if (productIndex !== -1) {
        this.selectedProducts.splice(productIndex, 1);
      }
      this.updateTotalOfPrices();
    });
  }

  updateProductQuantity(product: Product) {
    // tslint:disable-next-line:max-line-length
    this.productService.updateVisitProduct(this.visit.visitId, product.productId, product.quantity).pipe(takeUntil(this.unsub)).subscribe(product => {
      const productIndex = this.selectedProducts.findIndex(p => p.productId === product.productId);
      if (productIndex !== -1) {
        this.selectedProducts.splice(productIndex, 1, product);
      }
    });
  }

  increaseProductQuantity(product: Product) {
    product.quantity = product.quantity + 1;
    this.updateTotalOfPrices();
    this.updateProductQuantity(product);
  }

  decreaseProductQuantity(product: Product) {
    if (product.quantity > 0) {
      product.quantity = product.quantity - 1;
    }
    this.updateTotalOfPrices();
    this.updateProductQuantity(product);
  }

  updateTotalOfPrices() {
    let totalPrices = 0;
    this.selectedProducts.forEach(sp => {
      totalPrices = Number(totalPrices) +
        (Number(sp.retailPrice) * Number(sp.quantity));
      // apply the taxes
      var thetaxtotal = 0;
      sp.productTaxes.forEach(tax => {
        thetaxtotal = thetaxtotal + (totalPrices * tax.tax.value);
      });
      totalPrices = totalPrices + thetaxtotal;
    });
    this.totalOfProductPrices = (totalPrices).toFixed(2);
  }

  editVisit() {
    this.patientEdit = true;
    this.patientSelected = true;
    this.selectedPatient = this.patient;
  }
  newPatientHandler() {
    const autoCompleteText = this.patientsAutoComplete.text.split(' ');
    this.firstName.setValue(autoCompleteText[0]);
    if (autoCompleteText.length > 1) {
      this.lastName.setValue(autoCompleteText[1]);
    }
    this.patientsAutoComplete.toggle(false);
    this.patientSelected = false;
    this.selectedPatient = null;
    this.createPatientPanelVisible = true;
  }

  patientSelect(patient: any): void {
    this.selectedPatient = patient as Patient;
    this.patientSelected = true;
    this.createPatientPanelVisible = false;
  }
  getGender(patient) {
    if (patient.gender === 'Female') {
      return 'F';
    } else if (patient.gender === 'Male') {
      return 'M';
    } else {
      return 'U';
    }
  }
  formatValue(itemText: string, autocomplete) {
    // tslint:disable-next-line:quotemark
    const textMatcher = new RegExp(autocomplete.text, 'ig');
    const t = itemText.replace(textMatcher, function(match) {
      // tslint:disable-next-line:quotemark
      return '<strong>' + match + '</strong>';
    });
    return t;
  }
  getBirthday(date) {
    return moment(date).format('MMMM Do YYYY');
  }
  handleFilter(event) {
    this.patients = this.patientsSource.filter(s => s.firstName.toLowerCase().indexOf(event.toLowerCase()) !== -1);
  }
  patientValueChange(event) {
  }

  onPatientAutoCompleteFocus() {
    this.patientsAutoComplete.toggle(true);
  }

  updateVisit() {
    this.getPatientDetails();
    // this.appointments = [];
    this.visit.visitNotes = this.visitNotes.value;
    this.visitService.updateVisit(this.visit).pipe(takeUntil(this.unsub)).subscribe(v => {
      this.eventService.appointmentAdded.next();
    });
    this.patientEdit = false;
  }

  sortAppointments() {
    this.visitAppointments.sort((a: Appointment, b: Appointment) => {
      if (new Date(a.start) < new Date(b.start)) {
        return -1;
      } else if (new Date(a.start) > new Date(b.start)) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  editVisitNotes() {
    this.visitNotesEditIsEnabled = true;
  }

  saveVisitNotes() {
    this.updateVisit();
    this.visitNotesEditIsEnabled = false;
  }

  cancelVisitNotes() {
    this.visitNotes.setValue(this.visit.visitNotes);
    this.visitNotesEditIsEnabled = false;
  }

  editPatientNotes() {
    this.editIsEnabled = true;
  }

  savePatientNotes() {
    this.patient.notesAndAlerts = this.patientNotesEntry.nativeElement.value;
    this.patientService.updatePatient(this.patient).subscribe(() => {
    });
    this.editIsEnabled = false;
  }

  cancelPatientNotes() {
    this.editIsEnabled = false;
  }

  goToPatientPanel() {
    // now go to the patient panel, passing in the patient id
    this.patientService.getPatientById(this.patient.patientId).subscribe(pat => {
      if (!isNullOrUndefined(pat)) {
        this.masterOverlayService.masterOverlayState(true);
        this.router.navigate(['/schedule', { outlets: {'action-panel': ['patient', pat.patientId]}}]);
      }
    });
  }

  notConfirmedClicked() {
    this.visit.noShow = false;
    this.visit.confirmed = false;
    this.visit.checkedIn = false;
    this.updateVisit();
  }
  confirmedClicked() {
    this.visit.noShow = false;
    this.visit.confirmed = true;
    this.visit.checkedIn = false;
    this.updateVisit();
  }
  checkInClicked() {
    this.visit.noShow = false;
    this.visit.confirmed = true;
    this.visit.checkedIn = true;
    this.updateVisit();
  }
  noShowClicked() {
    this.visit.confirmed = false;
    this.visit.checkedIn = false;
    this.visit.noShow = true;
    this.updateVisit();
  }
}
