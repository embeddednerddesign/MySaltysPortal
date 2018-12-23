import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { BusinessDay, BusinessWeek, HoursOfOperation, HoursOfOperationDay } from '../models/hoursofoperation';
import { WeekDay } from '../models/week-day';
// import { HoursOfOperationData } from '../management/dialogs/hours-of-operation/hours-of-operation.component';

@Injectable()
export class HoursOfOperationService {
  constructor(private http: HttpClient) {}

  getHoursOfOperation(companyId: number = 0) {
    // api/HoursOfOperation/company/1
    return this.http.get<HoursOfOperation>(`${environment.baseUrl}api/HoursOfOperation/company/${companyId}`);
  }

  saveHoursOfOperation(companyId: Number, buzzHours: HoursOfOperation) {
    return this.http.put<HoursOfOperation>(
      `${environment.baseUrl}api/HoursOfOperation/${companyId}/${buzzHours.hoursOfOperationId}`,
      buzzHours
    );
  }

  // parseHoursOfOperationString(hours: string) {
  //     // set default value if necessary
  //     if (hours === undefined || hours === '') {
  //         hours = '9am-5pm, Mon-Fri';
  //     }
  //     var hoursObj: HoursOfOperation = {
  //         startTime: new Date(),
  //         endTime: new Date(),
  //         openDays: {
  //             Sun:false,
  //             Mon:false,
  //             Tue:false,
  //             Wed:false,
  //             Thu:false,
  //             Fri:false,
  //             Sat:false
  //         }
  //     };
  //     hoursObj.startTime = new Date(Date.now());
  //     hoursObj.endTime = new Date(Date.now());
  //     let indexOfDash = hours.indexOf('-');
  //     let indexOfComma = hours.indexOf(',');
  // tslint:disable-next-line:max-line-length
  //     let startHour = hours.slice(indexOfDash-2,indexOfDash) == 'am' ? parseInt(hours.slice(0,indexOfDash-2)) : parseInt(hours.slice(0,indexOfDash-2)) + 12;
  // tslint:disable-next-line:max-line-length
  //     let endHour = hours.slice(indexOfComma-2,indexOfComma) == 'am' ? parseInt(hours.slice(indexOfDash+1,indexOfComma-2)) : parseInt(hours.slice(indexOfDash+1,indexOfComma-2)) + 12;

  //     hoursObj.startTime.setHours(startHour);
  //     hoursObj.startTime.setMinutes(0);
  //     hoursObj.endTime.setHours(endHour);
  //     hoursObj.endTime.setMinutes(0);

  //     if (hours.includes('7'))
  //     {
  //         hoursObj.openDays = { Sun:true,Mon:true,Tue:true,Wed:true,Thu:true,Fri:true,Sat:true };
  //     }
  //     else if (hours.includes('Mon')) {
  //         hoursObj.openDays = { Sun:false,Mon:true,Tue:true,Wed:true,Thu:true,Fri:true,Sat:false };
  //     }
  //     else {
  //         hoursObj.openDays.Sun = hours.includes('Su');
  //         hoursObj.openDays.Mon = hours.includes('Mo');
  //         hoursObj.openDays.Tue = hours.includes('Tu');
  //         hoursObj.openDays.Wed = hours.includes('We');
  //         hoursObj.openDays.Thu = hours.includes('Th');
  //         hoursObj.openDays.Fri = hours.includes('Fr');
  //         hoursObj.openDays.Sat = hours.includes('Sa');
  //     }
  //     return hoursObj;
  // }

  // parseHoursOfOperationObject(hours: HoursOfOperationData) {
  //     var hoursOfOperationString: string  = '';
  //     hoursOfOperationString += String(hours.startTime.getHours() % 12 == 0 ? 12 : hours.startTime.getHours() % 12);
  //     if (hours.startTime.getHours() > 12) {
  //         hoursOfOperationString += 'pm';
  //     }
  //     else {
  //         hoursOfOperationString += 'am';
  //     }
  //     hoursOfOperationString += '-';
  //     hoursOfOperationString += String(hours.endTime.getHours() % 12 == 0 ? 12 : hours.endTime.getHours() % 12);
  //     if (hours.endTime.getHours() > 12) {
  //         hoursOfOperationString += 'pm';
  //     }
  //     else {
  //         hoursOfOperationString += 'am';
  //     }
  //     hoursOfOperationString += ',  ';
  // tslint:disable-next-line:max-line-length
  //     if (hours.openDays.Sun && hours.openDays.Mon && hours.openDays.Tue && hours.openDays.Wed && hours.openDays.Thu && hours.openDays.Fri && hours.openDays.Sat) {
  //         hoursOfOperationString += '7 Days a Week';
  //     }
  // tslint:disable-next-line:max-line-length
  //     else if (!hours.openDays.Sun && hours.openDays.Mon && hours.openDays.Tue && hours.openDays.Wed && hours.openDays.Thu && hours.openDays.Fri && !hours.openDays.Sat) {
  //         hoursOfOperationString += 'Mon-Fri';
  //     }
  //     else {
  //         hoursOfOperationString += hours.openDays.Sun ? 'Su, ' : '';
  //         hoursOfOperationString += hours.openDays.Mon ? 'Mo, ' : '';
  //         hoursOfOperationString += hours.openDays.Tue ? 'Tu, ' : '';
  //         hoursOfOperationString += hours.openDays.Wed ? 'We, ' : '';
  //         hoursOfOperationString += hours.openDays.Thu ? 'Th, ' : '';
  //         hoursOfOperationString += hours.openDays.Fri ? 'Fr, ' : '';
  //         hoursOfOperationString += hours.openDays.Sat ? 'Sa, ' : '';
  //         hoursOfOperationString = hoursOfOperationString.slice(0, hoursOfOperationString.length-2);
  //     }
  //     return hoursOfOperationString;
  // }
}

export function getBusinessWeek(days: HoursOfOperationDay[]): BusinessWeek {
  const b = new BusinessWeek();

  if (days) {
    days.forEach(d => {
      if (d) {
        switch (d.dayofweek) {
          case WeekDay.Sunday:
            setDay(b.sun, d);
            break;

          case WeekDay.Monday:
            setDay(b.mon, d);
            break;

          case WeekDay.Tuesday:
            setDay(b.tue, d);
            break;

          case WeekDay.Wednesday:
            setDay(b.wed, d);
            break;

          case WeekDay.Thursday:
            setDay(b.thu, d);
            break;

          case WeekDay.Friday:
            setDay(b.fri, d);
            break;

          case WeekDay.Saturday:
            setDay(b.sat, d);
            break;
        }
      }
    });
  }

  function setDay(day: BusinessDay, hood: HoursOfOperationDay) {
    day.id = hood.hoursOfOperationDayId;
    day.closed = hood.closed;
    day.openTime = hood.openTime ? new Date(Date.parse(hood.openTime.toString())) : null;
    day.closeTime = hood.closeTime ? new Date(Date.parse(hood.closeTime.toString())) : null;
  }

  return b;
}

export function getHoursOfOperationDays(buzz: BusinessWeek): HoursOfOperationDay[] {
  if (buzz) {
    return [
      fromDay(WeekDay.Sunday, buzz.sun),
      fromDay(WeekDay.Monday, buzz.mon),
      fromDay(WeekDay.Tuesday, buzz.tue),
      fromDay(WeekDay.Wednesday, buzz.wed),
      fromDay(WeekDay.Thursday, buzz.thu),
      fromDay(WeekDay.Friday, buzz.fri),
      fromDay(WeekDay.Saturday, buzz.sat)
    ];
  }

  function fromDay(dayofweek: WeekDay, day: BusinessDay): HoursOfOperationDay {
    return {
      hoursOfOperationDayId: day.id,
      closed: day.closed,
      dayofweek: dayofweek,
      openTime: day.openTime,
      closeTime: day.closeTime
    };
  }

  return [];
}
