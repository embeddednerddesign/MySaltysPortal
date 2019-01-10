import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgServiceCategoryDetailsComponent } from './org-service-category-details.component';

describe('OrgServiceCategoryDetailsComponent', () => {
  let component: OrgServiceCategoryDetailsComponent;
  let fixture: ComponentFixture<OrgServiceCategoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgServiceCategoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgServiceCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
