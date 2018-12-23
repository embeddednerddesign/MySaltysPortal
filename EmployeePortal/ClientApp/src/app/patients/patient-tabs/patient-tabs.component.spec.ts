import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientTabsComponent } from './patient-tabs.component';

describe('PatientTabsComponent', () => {
  let component: PatientTabsComponent;
  let fixture: ComponentFixture<PatientTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
