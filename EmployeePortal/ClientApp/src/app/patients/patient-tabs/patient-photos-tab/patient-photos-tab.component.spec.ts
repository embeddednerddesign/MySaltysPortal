import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientPhotosTabComponent } from './patient-photos-tab.component';

describe('PatientPhotosTabComponent', () => {
  let component: PatientPhotosTabComponent;
  let fixture: ComponentFixture<PatientPhotosTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientPhotosTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientPhotosTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
