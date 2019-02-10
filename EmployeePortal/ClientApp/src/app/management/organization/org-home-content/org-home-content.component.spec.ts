import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrgHomeContentComponent } from './org-home-content.component';

describe('OrgHomeContentComponent', () => {
  let component: OrgHomeContentComponent;
  let fixture: ComponentFixture<OrgHomeContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgHomeContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgHomeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
