import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffUnavailableComponent } from './staff-unavailable.component';

describe('StaffUnavailableComponent', () => {
  let component: StaffUnavailableComponent;
  let fixture: ComponentFixture<StaffUnavailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffUnavailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffUnavailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
