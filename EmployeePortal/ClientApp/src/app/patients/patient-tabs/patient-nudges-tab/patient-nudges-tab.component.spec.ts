import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientNudgesTabComponent } from './patient-nudges-tab.component';

describe('PatientNudgesTabComponent', () => {
  let component: PatientNudgesTabComponent;
  let fixture: ComponentFixture<PatientNudgesTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientNudgesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientNudgesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
