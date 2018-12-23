import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCategoryDetailsComponent } from './service-category-details.component';

describe('ServiceCategoryDetailsComponent', () => {
  let component: ServiceCategoryDetailsComponent;
  let fixture: ComponentFixture<ServiceCategoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceCategoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
