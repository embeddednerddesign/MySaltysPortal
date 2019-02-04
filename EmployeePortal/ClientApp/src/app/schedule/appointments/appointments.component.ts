import * as moment from 'moment';
import * as XLSX from 'xlsx';
// tslint:disable-next-line:max-line-length
import { Component, OnInit, OnDestroy, AfterViewChecked, HostListener, ViewChild } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { debug, isNullOrUndefined } from 'util';

@Component({
    selector: 'app-appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.less']
})
export class AppointmentsComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild(AgGridModule) private theGrid: AgGridModule;
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

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e) {
  }
  @HostListener('document:mousedown', ['$event'])
  onMouseDown(e) {
  }
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(e) {
  }

  constructor() {
    this.columnDefs = [];
    this.rowData = [];
  }

  // angular lifecycle section
  ngOnInit() {
  }


  ngAfterViewChecked() {
  }

  ngOnDestroy() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.setRowData([]);
  }

  incomingfile(event) {
    this.file = event.target.files[0];
  }

  Upload() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, {type: 'binary'});
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      this.excelHeaderNames = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 1})[0];
      this.excelData = XLSX.utils.sheet_to_json(worksheet);

      this.columnDefs = [];
      this.excelHeaderNamesClean = [];
      this.excelHeaderNames.forEach(headerName => {
        this.columnDefs.push({ field: headerName });
      });
      this.gridApi.setRowData(this.excelData);
      this.gridApi.refreshCells();

    };
    fileReader.readAsArrayBuffer(this.file);
  }
}
