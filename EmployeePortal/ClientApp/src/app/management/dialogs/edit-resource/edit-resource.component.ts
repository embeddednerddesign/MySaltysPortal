import {Component, Inject, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Resource } from '../../../models/resource';
import { FormControl } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { ResourceService } from '../../../services/resource.service';
import { isNullOrUndefined } from 'util';

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

    emptyResource: Resource = {
      resourceId: 0,
      title: '',
      type: '',
      description: '',
      backgroundImage: '',
      path: 'resources/',
      createdBy: '',
      createdOn: new Date()
    };

    addNotUpdate = false;
    backResource = false;

    constructor(private resourceService: ResourceService,
      private userService: UsersService,
      public dialogRef: MatDialogRef<EditResourceDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.rsrcTitle = new FormControl();
      this.rsrcDescription = new FormControl();
    }

    ngOnInit() {
      if (this.data === 'front' || this.data === 'back') {
        this.resource = this.emptyResource;
        if (this.data === 'front') {
          this.resource.path = this.resource.path + 'Front of House/';
          this.resourceType = 'Front of House';
          this.resource.type = 'front';
          this.backResource = false;
        } else {
          this.resource.path = this.resource.path + 'Back of House/';
          this.resourceType = 'Back of House';
          this.resource.type = 'back';
          this.backResource = true;
        }
        this.addNotUpdate = true;
      } else {
        this.resource = this.data;
        this.addNotUpdate = false;
      }
      this.resourceTitle = this.resource.title;
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
      this.resourceService.uploadResource(formData, this.resourceType).subscribe(res => {
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
      if (this.addNotUpdate) {
        this.resourceService.addResource(newContent).subscribe(newres => {});
      } else {
        this.resourceService.updateResource(newContent).subscribe(newres => {});
      }
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
