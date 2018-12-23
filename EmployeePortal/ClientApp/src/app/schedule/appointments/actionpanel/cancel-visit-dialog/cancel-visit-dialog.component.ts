import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Data } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-cancel-visit-dialog',
  templateUrl: './cancel-visit-dialog.component.html',
  styleUrls: ['./cancel-visit-dialog.component.less']
})

export class CancelVisitDialogComponent implements OnInit {
  @Input() source: string;
  @Output() cancellationMessage = new EventEmitter<any>();
  @Output() closeCancellationMessage = new EventEmitter<any>();
  selectedCancellationReason: string;
  cancellationDate: FormControl;
  isCancellationAlert: boolean;
  constructor() {
    this.cancellationDate = new FormControl(new Date());
    this.isCancellationAlert = false;
  }

  ngOnInit() {
  }
  cancelVisit() {
    this.cancellationMessage.emit({cancellationReason: this.selectedCancellationReason,
      isCancellationAlert: this.isCancellationAlert,
      cancellationDate: this.cancellationDate.value
    });
    this.close();
  }
  close() {
    this.closeCancellationMessage.emit();
  }
}
