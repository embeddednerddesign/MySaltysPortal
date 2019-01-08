import * as moment from 'moment';
import { Component, OnInit, Input, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { AppointmentViewModel } from '../../../../models/appintment-viewmodel';
import { FormControl } from '@angular/forms';
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
import { Event, PEvent, BEvent, IEvent } from '../../../../models/scheduler/event';
import { ServiceCategory } from '../../../../models/service-category';
import { Staff } from '../../../../models/staff';
import { CurrentDataService } from '../../../../services/currentData.service';

export const colorCodes = [
  {
    'code': '100',
    'color': '#6087EB'
  },
  {
    'code': '103',
    'color': '#5EEBA2'
  },
  {
    'code': '104',
    'color': '#F21A52'
  }
];


@Component({
  selector: 'app-preferred-appointments',
  templateUrl: './preferred-appointments.component.html',
  styleUrls: ['./preferred-appointments.component.less']
})
export class PreferredAppointmentsComponent implements OnInit {

  @ViewChild('patientsAutoComplete') patientsAutoComplete;

  durationOptions: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
    55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
   105, 110, 115, 120];

  unsub = new Subject<void>();
  view: Observable<Patient>;
  createPatientPanelVisible = false;
  patientSelected = false;
  clickEvent: AppointmentViewModel;
  newTitle: FormControl;
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
  startBTime = moment('09:00', 'HH:mm').toDate();
  endBTime =  moment('17:00', 'HH:mm').toDate();
  services: Service[] = [];
  staffMembers: any[] = [];
  selectedService: string;
  calculatedDuration = '00:30:00';
  selectedStaff: string;
  durationInMinutes: string;
  public patientsSource: Patient[] = [];
  public patients: PatientViewModel[] = [];
  public selectedPatient: Patient;
  prefSelect: string = 'Preferred Appointments';
  interalTitle: string = "";
  startDate: Date;
  endDate: Date;
  prefSelectedIcon: string;
  iconTitle: string;
  iconUrl: string;
  iconTitleNew: boolean = true;
  newIconTitle: string = "";
  iconUrlNew: string;
  private toggleText: string = "Hide";
  private show: boolean = false;
  private show2: boolean = false;
  selectedPref = this._eventsService.selectedPref;
  selectedIcon = this._eventsService.selectedIcon;
  preferredAppoints = this._eventsService.preferredAppoints;
  uniqueIcons: any[];
  prefRepeat: string = "full-week";
  dow: any[] = null
  getDay;
  dayName;
  newIconBox: boolean = false;
  bizSteps = {
    minute:15
}

  list: any[] = [];
  weekdays: any[] = [
    {
      name: "Monday",
      id: 1, checked: false
    },
    {
      name: "Tuesday",
      id: 2,
      checked: false
    },
    {
      name: "Wednesday",
      id: 3,
      checked: false
    },
    {
      name: "Thursday",
      id: 4,
      checked: false
    },
    {
      name: "Friday",
      id: 5,
      checked: false
    },
    {
      name: "Saturday",
      id: 6,
      checked: false
    },
    {
      name: "Sunday",
      id: 0,
      checked: false
    }
  ];
  constructor(private eventService: EventsService,
    private servicesService: ServicesService,
    public currentDataService: CurrentDataService,
    private route: ActivatedRoute,
    private router: Router,
    private staffsService: StaffsService,
    private patientService: PatientService,
    private _eventsService: EventsService,

  ) {
    this.customDuration = new FormControl();
    this.visitIdString = new FormControl();
    this.firstName = new FormControl();
    this.lastName = new FormControl();
    this.bdate = new FormControl();
    this.mspNumber = new FormControl();
    this.emailAddress = new FormControl();
    this.phoneNumber = new FormControl();
    this.newTitle = new FormControl();


    this._eventsService.updateCreateVisitTime$.subscribe(time => {

      let datetime = new Date(time.start);
      datetime.setHours(time.start._i[3]);
      datetime.setMinutes(time.start._i[4]);
      this.startTime = datetime;

      if (time.start !== time.end) {
        const datetime = moment.utc(moment(time.end).diff(moment(time.start)));
        this.calculatedDuration = datetime.format('HH:mm:ss');
        this.durationInMinutes = (datetime.hours() * 60 + datetime.minutes()).toString();
      }
    });
  }

  ngOnInit() {
    this.clickEvent = this.eventService.getTempEvent();
    if (this.clickEvent.start !== this.clickEvent.end) {
      const time = moment.utc(moment(this.clickEvent.end).diff(moment(this.clickEvent.start)));
      this.calculatedDuration = time.format('HH:mm:ss');
      this.durationInMinutes = (time.hours() * 60 + time.minutes()).toString();
    }
    this.selectedStaff = this.clickEvent.resourceId;
    this.startTime = new Date(moment(this.clickEvent.start).toJSON());
    // get the services from the db
    this.getServicesByStaff(this.selectedStaff);
    this.staffsService.getAllStaff()
      .subscribe(snapshot => {
        snapshot.forEach(staff => {
          this.staffMembers.push(staff);
        });
      });
      const snapshot = this.currentDataService.patients;
      snapshot.forEach(doc => {
        const patient = doc as Patient;
        const viewModel: PatientViewModel = {
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
          patientId: patient.patientId,
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
    this._eventsService.currentDate.takeUntil(this.unsub).subscribe(date => {
      this.date = date;
    });

    this.startDate = new Date();
    this.endDate = new Date();

    // this.getPrefList();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(this.startTime);
    this.dayName = days[d.getDay()];



  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  createVisit() {
    // tslint:disable-next-line:max-line-length
    const time = moment(this.date)
      .hours(this.startTime.getHours())
      .minutes(this.startTime.getMinutes())
      .seconds(this.startTime.getSeconds());
    const endTime = moment(time).add(moment.duration(this.calculatedDuration));
    let colorcode = 'red';
    let svc: Service;
    this.services.forEach(service => {
      if (service.serviceName === this.selectedService) {
        svc = service as Service;
        colorcode = service.serviceIDColour;
      }
    });
    const event: Event = {
      title: this.selectedPatient.firstName + ' ' + svc.serviceName,
      start: time.toISOString(true),
      end: endTime.toISOString(true),
      resourceId: this.selectedStaff,
      visitIdString: this.selectedPatient.clientId.toString() + this.date.toDateString(),
      cancellationReason: '',
      isCancellationAlert: false,
      cancellationDate: null,
      cancelled: false,
      service: svc,
      visit: null
    };
    this.eventService.addEvent(event);
    this.router.navigate(['/schedule', { outlets: { 'action-panel': ['visit-details', event.visitIdString] } }]);
    // this.eventService.addEvent(event).subscr(success => {
    //   this.router.navigate(['/schedule', { outlets: { 'action-panel': ['visit-details', event.visitIdString] } }]);
    // }).catch(err => console.error(err));
  }

  createPatient() {
    this.selectedPatient = {
      patientId: 0,
      clientId: this.mspNumber.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      birthDate: this.bdate.value.toJSON(),
      homeNumber: '',
      mobileNumber: this.phoneNumber.value,
      email: this.emailAddress.value,
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
    this.patientService.addPatient(this.selectedPatient).subscribe(success => {
      this.selectedPatient.birthDate = moment(this.selectedPatient.birthDate).format('MM/DD/YYYY');
      this.createPatientPanelVisible = false;
      this.patientSelected = true;
    });
  }

  public color(code: string): any {
    const color = colorCodes.find(x => x.code === code);
    return color;
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

  staffSelectionChanged() {
    this.selectedService = '';
    this.services = [];
    this.getServicesByStaff(this.selectedStaff);
  }

  getServicesByStaff(selectedStaff) {
    var listOfServiceCategories: ServiceCategory[] = [];
    this.services = [];
    this.servicesService.getServiceCategories().subscribe(snapshot => {
        snapshot.forEach(cat => {
            listOfServiceCategories.push(cat as ServiceCategory);
        });
        listOfServiceCategories.forEach(servCat => {
          this.staffsService.getStaffById(selectedStaff).subscribe(snapshot => {
            var listOfServices = (snapshot as Staff).services;
            listOfServices.forEach(serv => {
              this.servicesService.getServiceById(serv.serviceId).subscribe(snapshot => {
                  var theservice = snapshot as Service;
                  if (theservice !== undefined) {
                    if (this.services.filter(x => x.serviceId == theservice.serviceId).length == 0) {
                      this.services.push(snapshot as Service);
                    }
                  }
            });
          });
        });
      });
    });
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

  getLastAppointment(appointments) {
    const lastAppointmentDate = new Date(Math.max.apply(null, appointments.map(function (appointment) {
      return new Date(appointment.start);
    })));
    const xx = appointments.find(appointment => {
      return new Date(appointment.start).getUTCDate() === lastAppointmentDate.getUTCDate();
    });
    return xx;
  }

  patientValueChange(event) {
  }

  formatValue(itemText: string, autocomplete) {
    // tslint:disable-next-line:quotemark
    const textMatcher = new RegExp(autocomplete.text, "ig");
    const t = itemText.replace(textMatcher, function (match) {
      // tslint:disable-next-line:quotemark
      return "<strong>" + match + "</strong>";
    });
    return t;
  }

  handleFilter(event) {
    this.patients = this.patientsSource.filter((s) => s.firstName.toLowerCase().indexOf(event.toLowerCase()) !== -1);
  }

  getBirthday(date) {
    return moment(date).format('MMMM Do YYYY');
  }

  getAge(date) {
    return moment(new Date(Date.now())).diff(moment(date), 'years');
  }

  closePanel() {
    this.router.navigate(['/schedule', { outlets: { 'action-panel': null } }]);
    this.eventService.closePanel();
  }

  iconSelected(event) {
    this.selectedIcon = event.value;
  }
  prefSelected(event) {
    this.selectedPref = event.value;
  }


  updatePreferred() {
    // tslint:disable-next-line:max-line-length
    // this.selectRepeat(event);
    const time = moment(this.date)
      .hours(this.startTime.getHours())
      .minutes(this.startTime.getMinutes())
      .seconds(this.startTime.getSeconds());
    const endTime = moment(time).add(moment.duration(this.calculatedDuration));
    let pevent: PEvent = {
      className: ['fc-preferredAppoints'],
      start: time.format('HH:mm'),
      end: endTime.format('HH:mm'),
      resourceId: this.selectedStaff,
      dow: this.dow,
      rendering: 'background',
      planningId: this.selectedStaff.toString() + this.date.toDateString(),
      icon: this.iconUrl,
      backgroundColor: '#f2f2f2',
      color: '#e8e8e8',
      title: this.iconTitle,

    };
    // this.eventService.addPEvent(pevent).then(success => {
    // }).catch(err => console.error(err));
    this.closePanel();
  }

  updateSchedule() {
    // this.selectRepeat(event)
    let bevent: BEvent = {
      className: ['fc-nonbusiness'],
      start: moment(this.startBTime).format('HH:mm'),
      end: moment(this.endBTime).format('HH:mm'),
      dow: this.dow,
      resourceId: this.selectedStaff,
      selectOverlap: false,
      rendering: 'inverse-background',
      businessId: this.selectedStaff.toString() + this.date.toDateString(),
      backgroundColor: '#e2e2e2'
    };
    // this.eventService.addBEvent(bevent).then(success => {
    // }).catch(err => console.error(err));
    this.closePanel();

  }

  updateInternalAppoints() {
    //this.selectRepeat(event);
    const time = moment(this.date)
      .hours(this.startTime.getHours())
      .minutes(this.startTime.getMinutes())
      .seconds(this.startTime.getSeconds());
    const endTime = moment(time).add(moment.duration(this.calculatedDuration));
    let ievent: PEvent = {
      className: ['fc-InteralAppoints'],
      start: time.format('HH:mm'),
      end: endTime.format('HH:mm'),
      resourceId: this.selectedStaff,
      dow: this.dow,
      rendering: 'background',
      planningId: this.selectedStaff.toString() + this.date.toDateString(),
      backgroundColor: '#eeeeee',
      title: this.interalTitle,
         };
    // this.eventService.addIEvent(ievent).then(success => {
    // }).catch(err => console.error(err));
    this.closePanel();

  }

  onToggle(): void {
    this.show = !this.show;
  }
  onToggle2(): void {
    this.show2 = !this.show2;
  }

  // getPrefList() {
  //   this.eventService.getPrefAppointList().then(snapshot => {
  //     this.list = []
  //     snapshot.docs.forEach(doc => {
  //       const itemsList = doc.data().prefList
  //       this.list.push(...itemsList)
  //       this.preferredAppoints = this.list
  //     })
  //     this.uniqueIconsFunc();
  //   })
  // }
  onIconClick(item) {
    this.iconTitle = item.title;
    this.iconUrl = item.icon;
    this.show = false;
  }
  onIconClickNew(item) {
    this.iconUrlNew = item.icon;
    this.show2 = false;
  }
  addPref() {
    this.newIconBox = true;
    this.iconTitleNew = false;

  }
  // updatePref() {
  //   const prefItem = {
  //     title: this.newIconTitle,
  //     icon: this.iconUrlNew

  //   }
  //   this.eventService.UpdatePrefAppointList(prefItem).then(res => {
  //     this.getPrefList()
  //   });
  //   this.newIconBox = false;
  // }
  uniqueIconsFunc() {
    this.uniqueIcons = this.preferredAppoints.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj['icon']).indexOf(obj['icon']) === pos;
    });
  }

  selectRepeat(event) {

    this.getDay = this.startTime.getDay();

    if (this.prefRepeat === "no-repeat") {
        this.dow = undefined;
    } else if (this.prefRepeat === "full-week") {
      this.dow = [1, 2, 3, 4, 5]
    } else if (this.prefRepeat === "repeat-every") {
      this.dow = [];
      this.dow.push(this.getDay);
    }
  }

}

