import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeContentService } from '../../../services/home-content.service';
import { FormControl } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { HomeContent } from '../../../models/home-content';

@Component({
  selector: 'app-org-home-content',
  templateUrl: './org-home-content.component.html',
  styleUrls: ['./org-home-content.component.less']
})
export class OrgHomeContentComponent implements OnInit {
  contentTitle: FormControl;
  contentDescription: FormControl;

  file: File;
  homePageContentFile: File;
  homePageContentUploaded = false;
  homeContentTitle = '';
  homeContentDescription = '';

  constructor(private homeContentService: HomeContentService,
              private userService: UsersService) {
                this.contentTitle = new FormControl();
                this.contentDescription = new FormControl();
              }

  ngOnInit() {
  }

  /**
   * this is used to trigger the input
  */
  openHomePageContentInput() {
    document.getElementById('homePageContentFileInput').click();
  }

  homePageContentFileChange(files: File[]) {
    if (files.length > 0) {
      this.homePageContentFile = files[0];
      this.homePageContentUploaded = false;
    }
  }

   /**
   * this is used to perform the actual upload
   */
  uploadHomePageContent() {
    const formData = new FormData();
    const myNewFile = new File([this.homePageContentFile], this.homePageContentFile.name, {type: this.homePageContentFile.type});
    formData.append(myNewFile.name, myNewFile);

    const newContent: HomeContent = {
      homeContentId: 0,
      title: this.homeContentTitle,
      description: this.homeContentDescription,
      backgroundImage: '',
      path: 'home-content/' + this.homePageContentFile.name,
      createdBy: this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName,
      createdOn: new Date()
    };
    this.homeContentService.addHomeContent(newContent).subscribe(newres => {
      this.homeContentService.uploadContent(formData).subscribe(res => { });
      this.homePageContentUploaded = true;
      this.homePageContentFile = null;
      this.homeContentTitle = '';
      this.homeContentDescription = '';
    });
  }
}



