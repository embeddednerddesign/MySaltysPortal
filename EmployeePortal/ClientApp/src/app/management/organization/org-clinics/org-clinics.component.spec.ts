import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgClinicsComponent } from './org-clinics.component';

describe('OrgClinicsComponent', () => {
  let component: OrgClinicsComponent;
  let fixture: ComponentFixture<OrgClinicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgClinicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgClinicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
