import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueServicesComponent } from './catalogue-services.component';

describe('CatalogueServicesComponent', () => {
  let component: CatalogueServicesComponent;
  let fixture: ComponentFixture<CatalogueServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
