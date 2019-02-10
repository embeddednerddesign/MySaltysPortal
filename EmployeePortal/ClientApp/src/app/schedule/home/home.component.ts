import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { HomeContent } from '../../models/home-content';
import { HomeContentService } from '../../services/home-content.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ViewPdfDialogComponent } from '../../management/dialogs/view-pdf/view-pdf.component';
import { isNullOrUndefined } from 'util';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { AuthService } from '../../services/auth.service';

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
              private authService: AuthService,
              public homeContentService: HomeContentService,
              private confirmApptDialog: MatDialog) { }

  ngOnInit() {
    if (isNullOrUndefined(this.userService.loggedInUser) || isNullOrEmptyString(this.userService.loggedInUser.firstName)) {
      this.authService.logout();
    }
    this.homeContentService.contentSelected = false;
    this.loggedInUserName = this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName;
    this.homeContentService.getHomeContent().subscribe(content => {
      this.homeContent = content;
    });
  }

  onBackClick() {
    this.homeContentService.contentSelected = false;
  }

  public viewPDF(pdfPath: string) {
    const dialogRef = this.confirmApptDialog.open(ViewPdfDialogComponent, {
      width: '75%',
      height: '100%',
      data: pdfPath
    });

    dialogRef.afterClosed().subscribe(result => { });

    return dialogRef;
  }

  onContentClick(contentId) {
    this.homeContentService.getHomeContentById(contentId).subscribe(content => {
      this.homeContentService.contentSelected = true;
      this.selectedContent = content;
      this.viewPDF('../../../../assets/' + this.selectedContent.path);
    });
  }

}
