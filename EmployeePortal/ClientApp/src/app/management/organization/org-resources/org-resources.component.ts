import { Component, OnInit } from '@angular/core';
import { SchedulesService } from '../../../services/schedules.service';
import { ResourceService } from '../../../services/resource.service';
import { Resource } from '../../../models/resource';
import { UsersService } from '../../../services/users.service';
import { FormControl } from '@angular/forms';
import { FormatterService } from '../../../services/formatter.service';

@Component({
  selector: 'app-org-resources',
  templateUrl: './org-resources.component.html',
  styleUrls: ['./org-resources.component.less']
})
export class OrgResourcesComponent implements OnInit {

  frontTitle: FormControl;
  frontDescription: FormControl;
  backTitle: FormControl;
  backDescription: FormControl;

  file: File;
  resourceFrontFile: File;
  resourceFrontUploaded = false;
  resourceBackFile: File;
  resourceBackUploaded = false;
  resourceFrontTitle = '';
  resourceFrontDescription = '';
  resourceBackTitle = '';
  resourceBackDescription = '';

  constructor(private resourceService: ResourceService,
              private userService: UsersService) {
                this.frontTitle = new FormControl();
                this.frontDescription = new FormControl();
                this.backTitle = new FormControl();
                this.backDescription = new FormControl();
              }

  ngOnInit() {
  }

  /**
   * this is used to trigger the input
  */
  openResourceFrontInput() {
    document.getElementById('resourceFrontFileInput').click();
  }

  openResourceBackInput() {
    document.getElementById('resourceBackFileInput').click();
  }

  resourceFrontFileChange(files: File[]) {
    if (files.length > 0) {
      this.resourceFrontFile = files[0];
      this.resourceFrontUploaded = false;
    }
  }

  resourceBackFileChange(files: File[]) {
    if (files.length > 0) {
      this.resourceBackFile = files[0];
      this.resourceBackUploaded = false;
    }
  }

   /**
   * this is used to perform the actual upload
   */
  uploadResourceFront() {
    const formData = new FormData();
    const myNewFile = new File([this.resourceFrontFile], this.resourceFrontFile.name, {type: this.resourceFrontFile.type});
    formData.append(myNewFile.name, myNewFile);

    const newResource: Resource = {
      resourceId: 0,
      title: this.resourceFrontTitle,
      type: 'front',
      description: this.resourceFrontDescription,
      backgroundImage: '',
      path: 'resources/Front of House/' + this.resourceFrontFile.name,
      createdBy: this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName,
      createdOn: new Date()
    };
    this.resourceService.addResource(newResource).subscribe(newres => {
      this.resourceService.uploadResource(formData, 'front').subscribe(res => {});
      this.resourceFrontTitle = '';
      this.resourceFrontDescription = '';
      this.resourceFrontUploaded = true;
      this.resourceFrontFile = null;
    });
  }

  uploadResourceBack() {
    const formData = new FormData();
    const myNewFile = new File([this.resourceBackFile], this.resourceBackFile.name, {type: this.resourceBackFile.type});
    formData.append(myNewFile.name, myNewFile);

    const newResource: Resource = {
      resourceId: 0,
      title: this.resourceBackTitle,
      type: 'back',
      description: this.resourceBackDescription,
      backgroundImage: '',
      path: 'resources/Back of House/' + this.resourceBackFile.name,
      createdBy: this.userService.loggedInUser.firstName + ' ' + this.userService.loggedInUser.lastName,
      createdOn: new Date()
    };
    this.resourceService.addResource(newResource).subscribe(newres => {
      this.resourceService.uploadResource(formData, 'back').subscribe(res => {});
      this.resourceBackUploaded = true;
      this.resourceBackFile = null;
      this.resourceBackTitle = '';
      this.resourceBackDescription = '';
    });
  }
}



