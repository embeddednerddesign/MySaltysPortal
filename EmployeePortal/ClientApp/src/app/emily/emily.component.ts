import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { NavStateService } from '../services/navstate.service';
import { MasterOverlayService } from '../services/actionpanel.service';

@Component({
  selector: 'app-emily',
  templateUrl: './emily.component.html',
  styleUrls: ['./emily.component.less']
})
export class EmilyComponent implements OnInit, OnDestroy {

  unsub: Subject<void> = new Subject<void>();
  sideNavExpanded: boolean;
  masterOverlayEnabled: boolean;

  constructor(private navStateService: NavStateService,
              private masterOverlayService: MasterOverlayService ) { }

  ngOnInit() {
    this.navStateService.sideNavExpanded.takeUntil(this.unsub).subscribe(exp => {
      this.sideNavExpanded = exp;
    });
    this.masterOverlayService.masterOverlayEnabled.takeUntil(this.unsub).subscribe(ovr => {
      this.masterOverlayEnabled = ovr;
    });
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

}
