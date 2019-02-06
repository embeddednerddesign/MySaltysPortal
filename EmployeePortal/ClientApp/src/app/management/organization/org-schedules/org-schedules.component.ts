import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit() {
  }

  /**
   * this is used to trigger the input
  */
  openThisWeekFrontInput() {
    // your can use ElementRef for this later
    document.getElementById('thisWeekFrontFileInput').click();
  }

  openThisWeekBackInput() {
    // your can use ElementRef for this later
    document.getElementById('thisWeekBackFileInput').click();
  }

  openLastWeekFrontInput() {
    // your can use ElementRef for this later
    document.getElementById('lastWeekFrontFileInput').click();
  }

  openLastWeekBackInput() {
    // your can use ElementRef for this later
    document.getElementById('lastWeekBackFileInput').click();
  }

  thisWeekFrontFileChange(files: File[]) {
    if (files.length > 0) {
      this.thisWeekFrontFile = files[0];
    }
  }

  thisWeekBackFileChange(files: File[]) {
    if (files.length > 0) {
      this.thisWeekBackFile = files[0];
    }
  }

  lastWeekFrontFileChange(files: File[]) {
    if (files.length > 0) {
      this.lastWeekFrontFile = files[0];
    }
  }

  lastWeekBackFileChange(files: File[]) {
    if (files.length > 0) {
      this.lastWeekBackFile = files[0];
    }
  }

   /**
   * this is used to perform the actual upload
   */
  uploadThisWeekFront() {
    console.log('sending this to server', this.thisWeekFrontFile);
  }

  uploadThisWeekBack() {
    console.log('sending this to server', this.thisWeekBackFile);
  }

  uploadLastWeekFront() {
    console.log('sending this to server', this.lastWeekFrontFile);
  }

  uploadLastWeekBack() {
    console.log('sending this to server', this.lastWeekBackFile);
  }

  // Upload() {
  //   const fileReader = new FileReader();
  //   fileReader.onload = (e) => {
  //     this.arrayBuffer = fileReader.result;
  //     const data = new Uint8Array(this.arrayBuffer);
  //     const arr = new Array();
  //     for (let i = 0; i !== data.length; ++i) {
  //       arr[i] = String.fromCharCode(data[i]);
  //     }
  //     const bstr = arr.join('');
  //   };
  //   fileReader.readAsArrayBuffer(this.file);
  // }

}



