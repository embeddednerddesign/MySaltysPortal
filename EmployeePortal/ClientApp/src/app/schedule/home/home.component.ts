import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { HomeContent } from '../../models/home-content';
import { HomeContentService } from '../../services/home-content.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  loggedInUserName = '';
  homeContent: HomeContent[] = [];
  selectedContent: HomeContent;

  constructor(private userService: UsersService,
              private router: Router,
              public homeContentService: HomeContentService) { }

  ngOnInit() {
    this.homeContentService.contentSelected = false;
    this.loggedInUserName = this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName;
    this.homeContentService.getHomeContent().subscribe(content => {
      this.homeContent = content;
    });
  }

  onBackClick() {
    this.homeContentService.contentSelected = false;
  }

  onContentClick(contentId) {
  this.homeContentService.getHomeContentById(contentId).subscribe(content => {
    this.homeContentService.contentSelected = true;
    this.selectedContent = content;
  });
}

}
