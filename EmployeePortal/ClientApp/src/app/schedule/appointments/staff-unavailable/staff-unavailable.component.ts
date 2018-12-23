import * as moment from 'moment';
import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef, AfterViewInit, Renderer, OnDestroy } from '@angular/core';
import { ContextMenuService, ContextMenuComponent } from 'ngx-contextmenu';
import { ElementSchemaRegistry } from '@angular/compiler';
import { Router } from '@angular/router';
import { EventsService } from '../../../services/events.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { VisitService } from '../../../services/visit.service';

@Component({
  selector: 'app-staff-unavailable',
  templateUrl: './staff-unavailable.component.html',
  styleUrls: ['./staff-unavailable.component.less']
})
export class StaffUnavailableComponent implements OnInit, OnDestroy {
  @Input() classList;
  @Input() start;
  @Input() end;
  @Input() color;
  @Input() className;
  @Input() resourceId;
  @Input() id;
  @Input() source;
  @Input() title;
  @Input() visitIdString;
  @Input() backColor;
  @Input() icon;
  @Input() rendering;
  @Input() dow;
  @Input() staffName;

  statusColor = '#b1d100';
  unsub: Subject<any> = new Subject<any>();

  constructor(private router: Router) {
  }
  ngOnInit() {
    this.backColor = this.color;
  }
  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }
  thermClick(event) {
  }
  getDate(date: string) {
    return new Date(date).getDate();
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

  isVisitPanelOpen() {
    if (this.router.url.indexOf('action-panel:visit-details') !== -1) {
      return true;

    } else {
      return false;
    }
  }
}
