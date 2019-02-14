import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HomeContent } from '../../../models/home-content';
import { Resource } from '../../../models/resource';
import { FormControl } from '@angular/forms';
import { HomeContentService } from '../../../services/home-content.service';
import { UsersService } from '../../../services/users.service';

@Component({
    selector: 'app-edit-home-content',
    templateUrl: './edit-home-content.component.html',
    styleUrls: ['./edit-home-content.component.less']
  })
  export class EditHomeContentDialogComponent implements OnInit, AfterViewInit {
    public dialog: MatDialog;
    homeContent: HomeContent;
    contentTitle: FormControl;
    contentDescription: FormControl;

    file: File;
    homePageContentFile: File;
    homePageContentUploaded = false;
    homeContentTitle = '';
    homeContentDescription = '';

    constructor(private homeContentService: HomeContentService,
      private userService: UsersService,
      public dialogRef: MatDialogRef<EditHomeContentDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.contentTitle = new FormControl();
      this.contentDescription = new FormControl();
    }

    ngOnInit() {
      this.homeContent = this.data;
      this.homeContentTitle = this.homeContent.title;
      this.homeContentDescription = this.homeContent.description;
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
      this.homeContentService.uploadContent(formData).subscribe(res => {
        this.updateHomeContent(false);
      });
      this.homeContent.path = 'home-content/' + this.homePageContentFile.name;
      this.homePageContentUploaded = true;
      this.homePageContentFile = null;
    }

    ngAfterViewInit() {
    }

    updateHomeContent(closeAfterUpdate: boolean) {
      const newContent: HomeContent = {
        homeContentId: this.homeContent.homeContentId,
        title: this.homeContentTitle,
        description: this.homeContentDescription,
        backgroundImage: '',
        path: this.homeContent.path,
        createdBy: this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName,
        createdOn: new Date()
      };
      this.homeContentService.updateHomeContent(newContent).subscribe(newres => {});
      if (closeAfterUpdate) {
        this.onCloseClick();
      }
    }

    onCancelClick() {
      this.onCloseClick();
    }

    onCloseClick() {
      this.dialogRef.close();
    }

  }
