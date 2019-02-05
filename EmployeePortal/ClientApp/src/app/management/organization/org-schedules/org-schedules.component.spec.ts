import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgSchedulesComponent } from './org-schedules.component';

describe('OrgSchedulesComponent', () => {
  let component: OrgSchedulesComponent;
  let fixture: ComponentFixture<OrgSchedulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgSchedulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
