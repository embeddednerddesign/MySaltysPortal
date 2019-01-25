import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.less']
})
export class TopnavComponent implements OnInit {

  searchCtrl: FormControl;

  currentDate: Date;

  loggedInUserName = '';
  loggedInUserAvatar = '';
  loggedInUserRole = '';

  unsub: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService,
              private userService: UsersService) {
    this.searchCtrl = new FormControl();
  }

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

  onTap(event) {
  }

  logout() {
    this.authService.logout();
  }
}
