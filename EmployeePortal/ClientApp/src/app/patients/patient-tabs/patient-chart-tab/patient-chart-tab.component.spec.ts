import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientChartTabComponent } from './patient-chart-tab.component';

describe('PatientChartTabComponent', () => {
  let component: PatientChartTabComponent;
  let fixture: ComponentFixture<PatientChartTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientChartTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientChartTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
