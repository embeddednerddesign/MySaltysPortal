import {Component, Inject, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { SimplePdfViewerComponent, SimplePDFBookmark } from 'simple-pdf-viewer';

@Component({
    selector: 'app-view-pdf',
    templateUrl: './view-pdf.component.html',
    styleUrls: ['./view-pdf.component.less']
  })
  export class ViewPdfDialogComponent {
    public dialog: MatDialog;

    // @ViewChild('content')
    // private content: ElementRef;

    @ViewChild(SimplePdfViewerComponent) private pdfViewer: SimplePdfViewerComponent;
    bookmarks: SimplePDFBookmark[] = [];
    pdfPath: string;

    constructor(public dialogRef: MatDialogRef<ViewPdfDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: string) {
        this.pdfPath = data;
      }

  }
