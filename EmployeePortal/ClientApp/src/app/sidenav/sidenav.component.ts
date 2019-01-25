import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
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
  loggedInUserRole = '';

  unsub: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService,
              private userService: UsersService,
              private router: Router) { }

  ngOnInit() {
    this.loggedInUserName = this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName;
    this.loggedInUserAvatar = 'assets/Avatars/' + this.userService.loggedInUser.avatar;
    this.loggedInUserRole = this.userService.loggedInUser.role;

    this.userService.loggedInUserUpdated$.takeUntil(this.unsub).subscribe(u => {
      this.loggedInUserName = this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName;
      this.loggedInUserAvatar = 'assets/Avatars/' + this.userService.loggedInUser.avatar;
      this.loggedInUserRole = this.userService.loggedInUser.role;
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

  organizationClick() {
    this.closeSubMenu();
    this.router.navigate(['/management/organization']);
  }

  logout() {
    this.authService.logout();
  }
}
