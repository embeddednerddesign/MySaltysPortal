import {Component, Inject, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Resource } from '../../../models/resource';
import { FormControl } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { ResourceService } from '../../../services/resource.service';

@Component({
    selector: 'app-edit-resource',
    templateUrl: './edit-resource.component.html',
    styleUrls: ['./edit-resource.component.less']
  })
  export class EditResourceDialogComponent implements OnInit, AfterViewInit {
    public dialog: MatDialog;
    resource: Resource;
    rsrcTitle: FormControl;
    rsrcDescription: FormControl;

    file: File;
    resourceFile: File;
    resourceUploaded = false;
    resourceTitle = '';
    resourceType = '';
    resourceDescription = '';

    constructor(private resourceService: ResourceService,
      private userService: UsersService,
      public dialogRef: MatDialogRef<EditResourceDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.rsrcTitle = new FormControl();
      this.rsrcDescription = new FormControl();
    }

    ngOnInit() {
      this.resource = this.data;
      this.resourceTitle = this.resource.title;
      this.resourceType = this.resource.type;
      this.resourceDescription = this.resource.description;
    }

    /**
     * this is used to trigger the input
    */
    openResourceInput() {
      document.getElementById('resourceFileInput').click();
    }

    resourceFileChange(files: File[]) {
      if (files.length > 0) {
        this.resourceFile = files[0];
        this.resourceUploaded = false;
      }
    }

     /**
     * this is used to perform the actual upload
     */
    uploadResource() {
      const formData = new FormData();
      const myNewFile = new File([this.resourceFile], this.resourceFile.name, {type: this.resourceFile.type});
      formData.append(myNewFile.name, myNewFile);
      this.resourceService.uploadResource(formData, this.resourceFile.type).subscribe(res => {
        this.updateResource(false);
      });
      this.resource.path = this.resource.path.split('/')[0] + '/' + this.resource.path.split('/')[1] +
                             '/' + this.resourceFile.name;
      this.resourceUploaded = true;
      this.resourceFile = null;
    }

    ngAfterViewInit() {
    }

    updateResource(closeAfterUpdate: boolean) {
      const newContent: Resource = {
        resourceId: this.resource.resourceId,
        title: this.resourceTitle,
        type: this.resource.type,
        description: this.resourceDescription,
        backgroundImage: '',
        path: this.resource.path,
        createdBy: this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName,
        createdOn: new Date()
      };
      this.resourceService.updateResource(newContent).subscribe(newres => {});
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
