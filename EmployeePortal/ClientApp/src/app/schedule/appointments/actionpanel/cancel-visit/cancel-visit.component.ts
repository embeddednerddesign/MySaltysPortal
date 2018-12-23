import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-cancel-visit',
  templateUrl: './cancel-visit.component.html',
  styleUrls: ['./cancel-visit.component.less']
})

export class CancelVisitComponent implements OnInit {
  @Input() source: string;
  @Output() cancellationMessage = new EventEmitter();
  @Output() closeCancellationMessage = new EventEmitter();

  constructor() {  }

  ngOnInit() {
  }
  cancelVisit() {
    this.cancellationMessage.emit();
  }
  close() {
    this.closeCancellationMessage.emit();
  }
}
