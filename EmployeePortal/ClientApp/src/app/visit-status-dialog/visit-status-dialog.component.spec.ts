import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitStatusDialogComponent } from './visit-status-dialog.component';

describe('VisitStatusDialogComponent', () => {
  let component: VisitStatusDialogComponent;
  let fixture: ComponentFixture<VisitStatusDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitStatusDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
