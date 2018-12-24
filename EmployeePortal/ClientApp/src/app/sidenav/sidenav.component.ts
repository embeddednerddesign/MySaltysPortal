import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavStateService } from '../services/navstate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MasterOverlayService } from '../services/actionpanel.service';
import { PatientService } from '../services/patient.service';
import { UsersService } from '../services/users.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.less']
})
export class SidenavComponent implements OnInit, OnDestroy {

  adminOpen = false;

  scheduleOpen = false;

  loggedInUserName = '';
  loggedInUserAvatar = '';

  unsub: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService,
              private userService: UsersService,
              private navStateService: NavStateService,
              private masterOverlayService: MasterOverlayService,
              private patientService: PatientService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loggedInUserName = this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName;
    this.loggedInUserAvatar = 'assets/Avatars/' + this.userService.loggedInUser.avatar;

    this.userService.loggedInUserUpdated$.takeUntil(this.unsub).subscribe(u => {
      this.loggedInUserName = this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName;
      this.loggedInUserAvatar = 'assets/Avatars/' + this.userService.loggedInUser.avatar;
    });
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

  adminClick() {
    this.adminOpen = !this.adminOpen;
  }

  closeSubMenu() {
    this.adminOpen = false;
  }

  scheduleClick() {
    this.scheduleOpen = !this.scheduleOpen;
  }

  addressBookClick() {
    this.closeSubMenu();
    this.router.navigate(['/management/address-book']);
  }
  catalogueClick() {
    this.closeSubMenu();
    this.router.navigate(['/management/catalogue']);
  }
  communicationsClick() {
    this.closeSubMenu();
    this.router.navigate(['/management/communications']);
  }
  billingClick() {
    this.closeSubMenu();
    this.router.navigate(['/management/billing']);
  }
  organizationClick() {
    this.closeSubMenu();
    this.router.navigate(['/management/organization']);
  }

  addPatient() {
    this.patientService.editPatientSourceURL = this.router.url;
    this.masterOverlayService.masterOverlayState(true);
    this.router.navigate([this.router.url, { outlets: {'action-panel': ['edit-patient', '_']}}]);
  }

  openPatientPanel() {
    // this.masterOverlayService.masterOverlayState(true);
    // this.router.navigate([this.router.url, { outlets: {'action-panel': ['patient', '_']}}]);
    this.router.navigate(['/patient']);
  }

  logout() {
    this.authService.logout();
  }
}
