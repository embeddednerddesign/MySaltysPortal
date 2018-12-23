import { noInstance } from '../lib/fun';

export interface HoursOfOperation {
  hoursOfOperationId: number;
  hoursOfOperationDays: HoursOfOperationDay[];
}

export interface HoursOfOperationDay {
  hoursOfOperationDayId: number;
  closed: boolean;
  dayofweek: string;
  openTime: Date;
  closeTime: Date;
}

export class BusinessDay {
  id: number;
  closed = false;
  openTime: Date;
  closeTime: Date;
}

export class BusinessWeek {
  private _days: BusinessDay[] = [];

  get sun() {
    if (noInstance(this._days[0])) {
      this._days[0] = new BusinessDay();
    }

    return this._days[0];
  }
  set sun(value) {
    this._days[0] = value;
  }

  get mon() {
    if (noInstance(this._days[1])) {
      this._days[1] = new BusinessDay();
    }

    return this._days[1];
  }
  set mon(value) {
    this._days[1] = value;
  }

  get tue() {
    if (noInstance(this._days[2])) {
      this._days[2] = new BusinessDay();
    }

    return this._days[2];
  }
  set tue(value) {
    this._days[2] = value;
  }

  get wed() {
    if (noInstance(this._days[3])) {
      this._days[3] = new BusinessDay();
    }

    return this._days[3];
  }
  set wed(value) {
    this._days[3] = value;
  }

  get thu() {
    if (noInstance(this._days[4])) {
      this._days[4] = new BusinessDay();
    }

    return this._days[4];
  }
  set thu(value) {
    this._days[4] = value;
  }

  get fri() {
    if (noInstance(this._days[5])) {
      this._days[5] = new BusinessDay();
    }

    return this._days[5];
  }
  set fri(value) {
    this._days[5] = value;
  }

  get sat() {
    if (noInstance(this._days[6])) {
      this._days[6] = new BusinessDay();
    }

    return this._days[6];
  }
  set sat(value) {
    this._days[6] = value;
  }

  private toDay(dayOfWeek: number): BusinessDay {
    if (dayOfWeek >= 0 && dayOfWeek <= 6) {
      const day = this._days[dayOfWeek];
      return day ? day : new BusinessDay();
    } else {
      throw new Error(`BusinessDay dayOfWeek should be >=0 && <= 6. Actual value: ${dayOfWeek}`);
    }
  }

  isClosed(dayOfWeek: number): boolean {
    const day = this.toDay(dayOfWeek);
    return day.closed ? true : false;
  }

  openTime(dayOfWeek: number): Date {
    const d = this.toDay(dayOfWeek);

    if (d.closed) {
      return null;
    } else {
      const h = d.openTime ? d.openTime.getHours() : 0;
      const m = d.openTime ? d.openTime.getMinutes() : 0;

      const t = new Date();
      t.setHours(h, m, 0);

      return t;
    }
  }

  closeTime(dayOfWeek: number): Date {
    const d = this.toDay(dayOfWeek);

    if (d.closed) {
      return null;
    } else {
      const h = d.closeTime ? d.closeTime.getHours() : 23;
      const m = d.closeTime ? d.closeTime.getMinutes() : 59;

      const t = new Date();
      t.setHours(h, m, 0);

      return t;
    }
  }

  isOpen(dayOfWeek: number, at: Date) {
    if (this.isClosed(dayOfWeek)) {
      return false;
    }

    const openTime = this.openTime(dayOfWeek);
    const closeTime = this.closeTime(dayOfWeek);

    const oh = openTime.getHours();
    const om = openTime.getMinutes();
    const os = oh * 60 * 60 + om * 60;

    const ch = closeTime.getHours();
    const cm = closeTime.getMinutes();
    const cs = ch * 60 * 60 + cm * 60;

    const h = at.getHours();
    const m = at.getMinutes();
    const s = h * 60 * 60 + m * 60;

    return s >= os && s <= cs;
  }
}
