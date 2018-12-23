import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferredAppointmentsComponent } from './preferred-appointments.component';

describe('PreferredAppointmentsComponent', () => {
  let component: PreferredAppointmentsComponent;
  let fixture: ComponentFixture<PreferredAppointmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferredAppointmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferredAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
