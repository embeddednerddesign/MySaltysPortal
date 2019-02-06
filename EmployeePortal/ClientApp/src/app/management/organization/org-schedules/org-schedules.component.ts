import { Component, OnInit } from '@angular/core';
import { SchedulesService } from '../../../services/schedules.service';

@Component({
  selector: 'app-org-schedules',
  templateUrl: './org-schedules.component.html',
  styleUrls: ['./org-schedules.component.less']
})
export class OrgSchedulesComponent implements OnInit {

  data;
  arrayBuffer: any;
  file: File;
  excelHeaderNames;
  excelHeaderNamesClean;
  excelData;
  excelDataClean;
  gridApi;
  gridColumnApi;
  columnDefs;
  rowData;
  name: string;
  thisWeekFrontFile: File;
  thisWeekBackFile: File;
  lastWeekFrontFile: File;
  lastWeekBackFile: File;
  thisWeekFrontUploaded = false;
  thisWeekBackUploaded = false;
  lastWeekFrontUploaded = false;
  lastWeekBackUploaded = false;


  constructor(private scheduleService: SchedulesService) {}

  ngOnInit() {
  }

  /**
   * this is used to trigger the input
  */
  openThisWeekFrontInput() {
    document.getElementById('thisWeekFrontFileInput').click();
  }

  openThisWeekBackInput() {
    document.getElementById('thisWeekBackFileInput').click();
  }

  openLastWeekFrontInput() {
    document.getElementById('lastWeekFrontFileInput').click();
  }

  openLastWeekBackInput() {
    document.getElementById('lastWeekBackFileInput').click();
  }

  thisWeekFrontFileChange(files: File[]) {
    if (files.length > 0) {
      this.thisWeekFrontFile = files[0];
      this.thisWeekFrontUploaded = false;
    }
  }

  thisWeekBackFileChange(files: File[]) {
    if (files.length > 0) {
      this.thisWeekBackFile = files[0];
      this.thisWeekBackUploaded = false;
    }
  }

  lastWeekFrontFileChange(files: File[]) {
    if (files.length > 0) {
      this.lastWeekFrontFile = files[0];
      this.lastWeekFrontUploaded = false;
    }
  }

  lastWeekBackFileChange(files: File[]) {
    if (files.length > 0) {
      this.lastWeekBackFile = files[0];
      this.lastWeekBackUploaded = false;
    }
  }

   /**
   * this is used to perform the actual upload
   */
  uploadThisWeekFront() {
    const formData = new FormData();
    const myNewFile = new File([this.thisWeekFrontFile], 'ThisWeekFrontSchedule.pdf', {type: this.thisWeekFrontFile.type});
    formData.append(myNewFile.name, myNewFile);
    this.scheduleService.uploadSchedule(formData).subscribe(res => { });
    this.thisWeekFrontUploaded = true;
    this.thisWeekFrontFile = null;
  }

  uploadThisWeekBack() {
    const formData = new FormData();
    const myNewFile = new File([this.thisWeekBackFile], 'ThisWeekBackSchedule.pdf', {type: this.thisWeekBackFile.type});
    formData.append(myNewFile.name, myNewFile);
    this.scheduleService.uploadSchedule(formData).subscribe(res => {});
    this.thisWeekBackUploaded = true;
    this.thisWeekBackFile = null;
  }

  uploadLastWeekFront() {
    const formData = new FormData();
    const myNewFile = new File([this.lastWeekFrontFile], 'LastWeekFrontSchedule.pdf', {type: this.lastWeekFrontFile.type});
    formData.append(myNewFile.name, myNewFile);
    this.scheduleService.uploadSchedule(formData).subscribe(res => {});
    this.lastWeekFrontUploaded = true;
    this.lastWeekFrontFile = null;
  }

  uploadLastWeekBack() {
    const formData = new FormData();
    const myNewFile = new File([this.lastWeekBackFile], 'LastWeekBackSchedule.pdf', {type: this.lastWeekBackFile.type});
    formData.append(myNewFile.name, myNewFile);
    this.scheduleService.uploadSchedule(formData).subscribe(res => {});
    this.lastWeekBackUploaded = true;
    this.lastWeekBackFile = null;
  }
}



