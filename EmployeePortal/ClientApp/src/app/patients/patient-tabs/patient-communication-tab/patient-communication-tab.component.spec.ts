import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientCommunicationTabComponent } from './patient-communication-tab.component';

describe('PatientCommunicationTabComponent', () => {
  let component: PatientCommunicationTabComponent;
  let fixture: ComponentFixture<PatientCommunicationTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientCommunicationTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCommunicationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
