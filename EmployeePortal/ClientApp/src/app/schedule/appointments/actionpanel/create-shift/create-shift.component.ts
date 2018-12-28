import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StaffsService } from '../../../../services/staffs.service';
import { Staff, StaffService } from '../../../../models/staff';
import { EventsService } from '../,,/../../../../services/events.service';
import { AppointmentViewModel } from '../../../../models/appintment-viewmodel';
import { CompanyService } from '../../../../services/company.service';
import { Company } from '../../../../models/company';
import { FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Event, StaffSchedule, scheduleRecurrence } from '../../../../models/scheduler/event';
import {StaffScheduleService} from '../../../../services/staffschedule.service'
import { isNullOrUndefined } from 'util';
import { CurrentDataService } from '../../../../services/currentData.service';

@Component({
  selector: 'app-create-shift',
  templateUrl: './create-shift.component.html',
  styleUrls: ['./create-shift.component.less']
})
export class CreateShiftComponent implements OnInit {

  actionPanelOpened = true;
  staffSchedules: StaffSchedule[] = [];
  selectedStaff: Staff;
  selectedStaffId: number;
  selectedStaffSchedule: StaffSchedule;
  startTime = new Date();
  endTime = new Date();
  repeatUntil = new Date();
  clickEvent: AppointmentViewModel;
  minTime = new Date();
  maxTime = new Date();
  calculatedDuration = '00:10:00';
  durationInMinutes: string = '';
  minimumDuration: number;
  unsub = new Subject<void>();
  date = new Date(Date.now());
  isNew: boolean;
  addOrEdit = 'Add';
  thisCompany: Company;

  loading = false;

  constructor(
    private router: Router,
    public currentDataService: CurrentDataService,
    private eventService: EventsService,
    private companyService: CompanyService,
    private staffScheduleService: StaffScheduleService,
  ) {
    this.eventService.updateCreateVisitTime$.subscribe(time => {

      const datetime = new Date(time.start);
      datetime.setHours(time.start._i[3]);
      datetime.setMinutes(time.start._i[4]);
      this.startTime = datetime;

      if (time.start !== time.end) {
        const durationTime = moment.utc(moment(time.end).diff(moment(time.start)));
        this.calculatedDuration = durationTime.format('HH:mm:ss');
        this.durationInMinutes = (durationTime.hours() * 60 + durationTime.minutes()).toString();
      }
    });
  }

  ngOnInit() {
    this.isNew = true;
    this.addOrEdit = 'Add';
    this.durationInMinutes = '';

    // this.companyService.getCompanyById(1).subscribe(snapshot => {
      // this.thisCompany = snapshot as Company;
    this.thisCompany = this.currentDataService.company;
    this.minimumDuration = this.thisCompany.minimumDuration;
    if (this.durationInMinutes === '') {
      this.durationInMinutes = this.minimumDuration.toString();
    }
    // });
    this.clickEvent = this.eventService.getTempEvent();

    this.startTime = new Date(moment(this.clickEvent.start).toJSON());
    this.endTime = new Date(moment(this.clickEvent.end).toJSON());
    const duration = moment.duration(moment(this.clickEvent.start).diff(moment(this.clickEvent.start))).asMinutes();
    this.durationInMinutes = duration.toString();
    // KM use the setting for the day here
      this.minTime.setHours(9);
      this.minTime.setMinutes(0);
      this.maxTime.setHours(17);
      this.maxTime.setMinutes(0);

    this.selectedStaff = {
      staffId: 0,
      name: '',
      services: [],
      staffSchedules: []
    };
    this.selectedStaffSchedule = {
      staffScheduleId: 0,
      staffId: 0,
      parentId: 0,
      title: '',
      recurrence: null,
      notes: '',
      start: '',
      end: '',
      endDate: ''
    };
    if (this.clickEvent.isSelection) {
      // this is a new Staff Schedule, so the resourceId will be the StaffId
      this.selectedStaff = this.currentDataService.staff.find(s => s.staffId === Number(this.clickEvent.resourceId));
      const staffSchdule: StaffSchedule = {
        staffScheduleId: 0,
        staffId: 0,
        parentId: 0,
        title: this.selectedStaff.name,
        recurrence: scheduleRecurrence.NoRepeat,
        notes: '',
        start: this.startTime.toISOString(),
        end: this.endTime.toISOString(),
        endDate: this.repeatUntil.toISOString()
      }
      this.selectedStaffSchedule = staffSchdule;
    }
    else {
      this.isNew = false;
      this.addOrEdit = 'Update';
      // this is an existing Staff Schedule, so the resourceId will be the StaffScheduleId
      var selectedStaffScheduleId = Number(this.clickEvent.resourceId);
      this.selectedStaff = this.currentDataService.staff.find(s => s.staffSchedules.findIndex(ss => ss.staffScheduleId === selectedStaffScheduleId) !== -1);
      this.selectedStaffSchedule = this.selectedStaff.staffSchedules.find(ss => ss.staffScheduleId === selectedStaffScheduleId);
      this.repeatUntil = new Date(this.selectedStaffSchedule.endDate);
    }
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  closePanel() {
    this.loading = false;
    this.router.navigate(['/schedule', { outlets: { 'action-panel': null } }]);
    this.eventService.closePanel();
  }

  staffSelectionChanged(event) {
    this.selectedStaff = this.currentDataService.staff.find(s => s.staffId === event.value);
  }

  selectRepeat(event) {
  }

  removeShift() {
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

  addStaffSchedule() {
    this.loading = true;
    const time = moment(this.date).hours(this.startTime.getHours()).minutes(this.startTime.getMinutes()).seconds(0).milliseconds(0);

    const staffSchdule: StaffSchedule = {
      staffScheduleId: this.selectedStaffSchedule.staffScheduleId,
      staffId: this.selectedStaff.staffId,
      parentId: this.selectedStaffSchedule.parentId,
      title: this.selectedStaff.name,
      recurrence: this.selectedStaffSchedule.recurrence,
      notes: this.selectedStaffSchedule.notes,
      start: this.startTime.toISOString(),
      end: this.endTime.toISOString(),
      endDate: this.repeatUntil.toISOString()
    }
    if (staffSchdule.staffScheduleId !== 0) {
      // this is an update, not adding a new one
      // this.staffScheduleService.getStaffSchedules().subscribe(ss => {
        const ss = this.currentDataService.staffSchedules;
        const childSchedules: StaffSchedule[] = [];
        ss.forEach(sched => {
          if (sched.parentId === staffSchdule.staffScheduleId) {
            childSchedules.push(sched);
          }
        });
        // check to see if the schedule had any children
        if (!isNullOrUndefined(childSchedules) && childSchedules.length > 0) {
          // it did have children, so change them all
          this.updateChildSchedules(childSchedules, staffSchdule).subscribe(ucs => {
            this.closePanel();
          });
        }
        else {
          // it had no children so now we have to see if it has any siblings
          ss.forEach(sched => {
            if (sched.parentId === staffSchdule.parentId) {
              childSchedules.push(sched);
            }
          });
          if (!isNullOrUndefined(childSchedules) && childSchedules.length > 0) {
            // it has some siblings, let's update them
            this.updateChildSchedules(childSchedules, staffSchdule).subscribe(ucs => {
              // and let's not forget to update the parent as well!
              this.staffScheduleService.updateStaffSchedule(
                this.updateSchedule(ss.find(sched => sched.staffScheduleId === staffSchdule.parentId), staffSchdule)).subscribe(staffsched => {
                  this.closePanel();
                });
            });
          }
          else {
            this.staffScheduleService.updateStaffSchedule(staffSchdule).subscribe(ss => {
              this.closePanel();
            });
          }
        }
      // });
    }
    else {
      // this is a brand new, so add the baseSchedule first to get back it's id for use as the parentId of the rest
      this.staffScheduleService.addStaffSchedule(staffSchdule).subscribe(ss => {
        staffSchdule.staffScheduleId = ss.staffScheduleId;
        const newStaffSchedules: StaffSchedule[] = this.createRepeatedSchedules(staffSchdule);
        staffSchdule.start = this.getTimeStringFromLocalTime(new Date(staffSchdule.start));
        staffSchdule.end = this.getTimeStringFromLocalTime(new Date(staffSchdule.end));
        this.currentDataService.staffSchedules.push(staffSchdule);

        newStaffSchedules.forEach(nss => {
          this.staffScheduleService.addStaffSchedule(nss).subscribe(ss => {
            nss.start = this.getTimeStringFromLocalTime(new Date(nss.start));
            nss.end = this.getTimeStringFromLocalTime(new Date(nss.end));
            this.currentDataService.staffSchedules.push(nss);
          });
        });
        this.closePanel();
      });
    }
  }

  updateChildSchedules(childScheds: StaffSchedule[], updatedSched: StaffSchedule) {
    childScheds.forEach(cs => {
      this.staffScheduleService.updateStaffSchedule(this.updateSchedule(cs, updatedSched)).subscribe(css => { });
    });

    return this.staffScheduleService.updateStaffSchedule(updatedSched);
  }

  updateSchedule(oldSched: StaffSchedule, newSched: StaffSchedule): StaffSchedule {
    oldSched.start = moment(oldSched.start).hour(moment(newSched.start).hour()).toISOString();
    oldSched.start = moment(oldSched.start).minute(moment(newSched.start).minute()).toISOString();
    oldSched.start = moment(oldSched.start).second(moment(newSched.start).second()).toISOString();
    oldSched.end = moment(oldSched.end).hour(moment(newSched.end).hour()).toISOString();
    oldSched.end = moment(oldSched.end).minute(moment(newSched.end).minute()).toISOString();
    oldSched.end = moment(oldSched.end).second(moment(newSched.end).second()).toISOString();
    const childSchdule: StaffSchedule = {
      staffScheduleId: oldSched.staffScheduleId,
      staffId: newSched.staffId,
      parentId: newSched.staffScheduleId,
      title: newSched.title,
      recurrence: newSched.recurrence,
      notes: newSched.notes,
      start: oldSched.start,
      end: oldSched.end,
      endDate: oldSched.endDate
    };
    return childSchdule;
  }

  cancelStaffSchedule() {
    this.closePanel();
  }

  createRepeatedSchedules(baseSchedule: StaffSchedule): StaffSchedule[] {
    let startDate: Date = new Date(baseSchedule.start);
    let endDate: Date = new Date(baseSchedule.end);
    const repetitionDEndDate: Date = new Date(baseSchedule.endDate);
    const repeatedSchedules: StaffSchedule[] = [];
    if (baseSchedule.recurrence !== scheduleRecurrence.NoRepeat) {
      if (moment(startDate).add(baseSchedule.recurrence, 'weeks').isBefore(moment(repetitionDEndDate))) {
        while (moment(startDate).add(baseSchedule.recurrence, 'weeks').isBefore(moment(repetitionDEndDate))) {
          startDate = new Date(moment(startDate).add(baseSchedule.recurrence, 'weeks').toJSON());
          endDate = new Date(moment(endDate).add(baseSchedule.recurrence, 'weeks').toJSON());
          const newSched: StaffSchedule = {
            staffScheduleId: 0,
            staffId: baseSchedule.staffId,
            parentId: baseSchedule.staffScheduleId,
            title: baseSchedule.title,
            recurrence: baseSchedule.recurrence,
            notes: baseSchedule.notes,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            endDate: baseSchedule.endDate
          };
          repeatedSchedules.push(newSched);
        }
      }
    }
    // else {
    //   repeatedSchedules.push(baseSchedule);
    // }

    return repeatedSchedules;

  }

}
