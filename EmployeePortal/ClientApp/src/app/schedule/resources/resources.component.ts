import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.less']
})
export class ResourcesComponent implements OnInit {

  loggedInUserName = '';

  constructor(private userService: UsersService) { }

  ngOnInit() {
    this.loggedInUserName = this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName;
  }

}
