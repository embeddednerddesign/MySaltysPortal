import {Component, Inject, ViewChild, AfterViewInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { SimplePdfViewerComponent, SimplePDFBookmark } from 'simple-pdf-viewer';

@Component({
    selector: 'app-view-pdf',
    templateUrl: './view-pdf.component.html',
    styleUrls: ['./view-pdf.component.less']
  })
  export class ViewPdfDialogComponent implements AfterViewInit {
    public dialog: MatDialog;

    // @ViewChild('content')
    // private content: ElementRef;

    @ViewChild(SimplePdfViewerComponent) private pdfViewer: SimplePdfViewerComponent;
    bookmarks: SimplePDFBookmark[] = [];
    pdfPath: string;
    dragHandle = 0;

    constructor(public dialogRef: MatDialogRef<ViewPdfDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: string) {
        this.pdfPath = data;
      }

    ngAfterViewInit() {
      const domElements = document.body.getElementsByTagName('*');

      for (let i = 0; i < domElements.length; i++) {
        if (domElements[i].id.startsWith('mat-dialog')) {
            console.log('domElements[i] -> ', domElements[i].innerHTML);
            this.dragHandle = i;
            break;
        }
      }
    }

    onCloseClick() {
      this.dialogRef.close();
    }

  }
