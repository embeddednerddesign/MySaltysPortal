import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appDragmove]'
})
export class DragMoveDirective {
  @Input() x;
  @Input() y;
  @Output() locationChange = new EventEmitter<any>();

  startX = 0;
  startY = 0;

  @HostListener('panstart', ['$event']) protected onPanStart(event) {
    event.preventDefault();
    this.startX = this.x;
    this.startY = this.y;
  }

  @HostListener('panmove', ['$event']) protected onPanMove(event) {
    event.preventDefault();
    this.x = this.startX + event.deltaX;
    this.y = this.startY + event.deltaY;
    this.locationChange.emit({x: this.x, y: this.y});
  }
}
