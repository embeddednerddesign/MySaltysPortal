import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { HomeContent } from '../../models/home-content';
import { HomeContentService } from '../../services/home-content.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  loggedInUserName = '';
  homeContent: HomeContent[] = [];

  constructor(private userService: UsersService,
              private homeContentService: HomeContentService) { }

  ngOnInit() {
    this.loggedInUserName = this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName;
    this.homeContentService.getHomeContent().subscribe(content => {
      this.homeContent = content;
    });
  }

}
