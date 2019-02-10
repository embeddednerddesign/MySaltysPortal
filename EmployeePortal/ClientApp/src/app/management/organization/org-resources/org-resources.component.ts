import { Component, OnInit } from '@angular/core';
import { SchedulesService } from '../../../services/schedules.service';

@Component({
  selector: 'app-org-resources',
  templateUrl: './org-resources.component.html',
  styleUrls: ['./org-resources.component.less']
})
export class OrgResourcesComponent implements OnInit {

  file: File;
  resourceFrontFile: File;
  resourceFrontUploaded = false;
  resourceBackFile: File;
  resourceBackUploaded = false;
  constructor(private scheduleService: SchedulesService) {}

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
    this.scheduleService.uploadSchedule(formData).subscribe(res => { });
    this.resourceFrontUploaded = true;
    this.resourceFrontFile = null;
  }

  uploadResourceBack() {
    const formData = new FormData();
    const myNewFile = new File([this.resourceBackFile], this.resourceBackFile.name, {type: this.resourceBackFile.type});
    formData.append(myNewFile.name, myNewFile);
    this.scheduleService.uploadSchedule(formData).subscribe(res => {});
    this.resourceBackUploaded = true;
    this.resourceBackFile = null;
  }
}



