import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientAccountTabComponent } from './patient-account-tab.component';

describe('PatientAccountTabComponent', () => {
  let component: PatientAccountTabComponent;
  let fixture: ComponentFixture<PatientAccountTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientAccountTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAccountTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
