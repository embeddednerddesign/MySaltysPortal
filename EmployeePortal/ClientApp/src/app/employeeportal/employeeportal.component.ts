import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { NavStateService } from '../services/navstate.service';
import { MasterOverlayService } from '../services/actionpanel.service';

@Component({
  selector: 'app-employeeportal',
  templateUrl: './employeeportal.component.html',
  styleUrls: ['./employeeportal.component.less']
})
export class EmployeePortalComponent implements OnInit, OnDestroy {

  unsub: Subject<void> = new Subject<void>();
  masterOverlayEnabled: boolean;

  constructor(private masterOverlayService: MasterOverlayService ) { }

  ngOnInit() {
    this.masterOverlayService.masterOverlayEnabled.takeUntil(this.unsub).subscribe(ovr => {
      this.masterOverlayEnabled = ovr;
    });
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

}
