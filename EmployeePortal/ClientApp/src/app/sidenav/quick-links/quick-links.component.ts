import { Component, OnInit, AfterViewInit, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { NavStateService } from '../../services/navstate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MasterOverlayService } from '../../services/actionpanel.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.less']
})
export class QuickLinksComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('thermo') thermo;
  simple: any;

  unsub: Subject<void> = new Subject<void>();

  constructor(private renderer: Renderer2,
              private masterOverlayService: MasterOverlayService,
              private patientService: PatientService,
              private router: Router ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.simple = this.renderer.listen(this.thermo.nativeElement, 'click',
      (event) => { this.thermClick(event); }
    );
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  addPatient() {
    this.patientService.editPatientSourceURL = this.router.url;
    this.masterOverlayService.masterOverlayState(true);
    this.router.navigate([this.router.url, { outlets: {'action-panel': ['edit-patient', '_']}}]);
  }

  thermClick(event) {
  }
}
