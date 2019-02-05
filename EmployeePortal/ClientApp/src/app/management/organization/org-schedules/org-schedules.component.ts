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
  ourFile: File; // hold our file

  constructor() {}

  ngOnInit() {
  }

  /**
   * this is used to trigger the input
  */
  openInput() {
    // your can use ElementRef for this later
    document.getElementById('fileInput').click();
  }

  fileChange(files: File[]) {
    if (files.length > 0) {
      this.ourFile = files[0];
    }
  }

   /**
   * this is used to perform the actual upload
   */
   upload() {
    console.log('sending this to server', this.ourFile);
  }

  incomingfile(event) {
    this.file = event.target.files[0];
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



