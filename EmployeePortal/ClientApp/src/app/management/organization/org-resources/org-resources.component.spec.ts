import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgResourcesComponent } from './org-resources.component';

describe('OrgResourcesComponent', () => {
  let component: OrgResourcesComponent;
  let fixture: ComponentFixture<OrgResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
