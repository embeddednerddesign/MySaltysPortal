import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelVisitDialogComponent } from './cancel-visit-dialog.component';

describe('CancelVisitDialogComponent', () => {
  let component: CancelVisitDialogComponent;
  let fixture: ComponentFixture<CancelVisitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelVisitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelVisitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
