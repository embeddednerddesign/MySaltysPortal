import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientProfileTabComponent } from './patient-profile-tab.component';

describe('PatientProfileTabComponent', () => {
  let component: PatientProfileTabComponent;
  let fixture: ComponentFixture<PatientProfileTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientProfileTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientProfileTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
