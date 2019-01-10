import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgServicesComponent } from './org-services.component';

describe('OrgServicesComponent', () => {
  let component: OrgServicesComponent;
  let fixture: ComponentFixture<OrgServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
