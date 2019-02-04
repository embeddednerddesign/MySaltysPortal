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
    this.columnDefs = [
      { headerName: 'Task Name', field: 'Taskname' },
      { headerName: 'Hourly Rate', field: 'Hourlyrate' },
      { headerName: 'Billable', field: 'Billable' },
      { headerName: 'Active?', field: 'Active' }
    ];
    this.rowData = [];
  }

  // angular lifecycle section
  ngOnInit() {
  }


  ngAfterViewChecked() {
  }

  ngOnDestroy() {
  }

  scrambleAndRefreshAll() {
    scramble();
    console.log('this.excelHeaderNames -> ', this.excelHeaderNames);
    console.log('this.excelData -> ', this.excelData);
    this.gridApi.refreshCells();
  }

  onGridReady(params) {
    console.log('onGridReady');
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    data = createData(14);
    params.api.setRowData(data);
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
      // this.excelData = XLSX.utils.sheet_to_json(worksheet, {raw: true});
      this.excelData = XLSX.utils.sheet_to_json(worksheet);
      // console.log(this.excelData);
      this.excelHeaderNamesClean = [];
      this.excelHeaderNames.forEach(headerName => {
        console.log('headerName -> ', headerName);
        const headerNameClean = (headerName as string).replace(/[^a-zA-Z ]/g, '').replace(' ', '');
        console.log('headerNameClean -> ', headerNameClean);
        this.excelHeaderNamesClean.push(headerNameClean);
        this.columnDefs.push({ headerName: headerName, field: headerNameClean });
      });

      this.excelData.forEach(rowdata => {
        console.log(rowdata);


        this.excelHeaderNames.forEach(function(colId) {
          if (!isNullOrUndefined(rowdata[colId])) {
            console.log('colId -> ', colId);
            console.log('rowdata[colId] -> ', rowdata[colId]);
            const colIdClean = (colId as string).replace(/[^a-zA-Z ]/g, '').replace(' ', '');

          }
        });


    this.columnDefs = [
      { headerName: 'Task Name', field: 'Taskname' },
      { headerName: 'Hourly Rate', field: 'Hourlyrate' },
      { headerName: 'Billable', field: 'Billable' },
      { headerName: 'Active?', field: 'Active' }
    ];

        // const rowdataclean = (rowdata as string).replace(/[^a-zA-Z ]/g, '');
        this.rowData.push(rowdata);
      });

      console.log('columnDefs -> ', this.columnDefs);
      console.log('rowData -> ', this.rowData);

    };
    fileReader.readAsArrayBuffer(this.file);

    // this.columnDefs = [
    //   {headerName: 'Make', field: 'make' },
    //   {headerName: 'Model', field: 'model' },
    //   {headerName: 'Price', field: 'price'}
    // ];

    // this.rowData = [
    //   { make: 'Toyota', model: 'Celica', price: 35000 },
    //   { make: 'Ford', model: 'Mondeo', price: 32000 },
    //   { make: 'Porsche', model: 'Boxter', price: 72000 }
    // ];
  }
}

var data = [];
function createData(count) {
  var result = [];
  for (var i = 1; i <= count; i++) {
    result.push({
      Taskname: (i * 863) % 100,
      Hourlyrate: (i * 811) % 100,
      Billable: (i * 743) % 100,
      Active: (i * 677) % 100
    });
  }
  return result;
}
function callRefreshAfterMillis(params, millis, gridApi) {
  setTimeout(function() {
    gridApi.refreshCells(params);
  }, millis);
}
function scramble() {
  data.forEach(scrambleItem);
}
function scrambleItem(item) {
  this.excelHeaderNamesClean.forEach(function(colId) {
    if (Math.random() > 0.5) {
      return;
    }
    item[colId] = Math.floor(Math.random() * 100);
  });
}
