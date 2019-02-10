import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { isNullOrUndefined } from 'util';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.less']
})
export class OrganizationComponent implements OnInit, OnDestroy {

  unsub: Subject<void> = new Subject<void>();

  loggedInUserRole = '';

  constructor(private router: Router,
              private userService: UsersService,
              private authService: AuthService) { }

  ngOnInit() {
    if (isNullOrUndefined(this.userService.loggedInUser) || isNullOrEmptyString(this.userService.loggedInUser.firstName)) {
      this.authService.logout();
    }
    this.loggedInUserRole = this.userService.loggedInUser.role;

    this.userService.loggedInUserUpdated$.subscribe(u => {
      this.loggedInUserRole = this.userService.loggedInUser.role;
    });
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

}
