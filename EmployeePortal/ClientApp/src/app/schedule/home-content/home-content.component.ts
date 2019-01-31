import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { HomeContent } from '../../models/home-content';
import { HomeContentService } from '../../services/home-content.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.less']
})
export class HomeContentComponent implements OnInit {

  loggedInUserName = '';
  selectedContent: HomeContent;
  contentIdParam: string;

  constructor(private userService: UsersService,
              private route: ActivatedRoute,
              private router: Router,
              private homeContentService: HomeContentService) { }

  ngOnInit() {
    this.loggedInUserName = this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName;
    this.route.params.subscribe(params => {
      this.contentIdParam = params['contentid'];
      if (this.contentIdParam !== '_' && this.contentIdParam != null) {
        this.homeContentService.getHomeContentById(this.contentIdParam).subscribe(content => {
          this.selectedContent = content;
        });
      }
    });
  }

  onBackClick() {
    this.router.navigate(['/home']);
  }

}
