import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { EventsService } from '../services/events.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-current-date',
  templateUrl: './current-date.component.html',
  styleUrls: ['./current-date.component.less']
})
export class CurrentDateComponent implements OnInit {

  currentDate: Date;
  unsub: Subject<void> = new Subject<void>();

  constructor(private _eventsService: EventsService) {}

  ngOnInit() {
    this._eventsService.currentDate.takeUntil(this.unsub).subscribe(value => {
      this.currentDate = value;
    });
  }

  getDayOfWeek(date) {
    return moment(date).format('dddd');
  }

  getDate(date) {
    return moment(date).format('MMMM D, YYYY');
  }

}
