import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.less']
})
export class OrganizationComponent implements OnInit, OnDestroy {

  unsub: Subject<void> = new Subject<void>();

  loggedInUserRole = '';

  constructor(private router: Router,
              private userService: UsersService) { }

  ngOnInit() {
    this.loggedInUserRole = this.userService.loggedInUser.role;

    this.userService.loggedInUserUpdated$.takeUntil(this.unsub).subscribe(u => {
      this.loggedInUserRole = this.userService.loggedInUser.role;
    });
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.complete();
  }

}
