import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueProductsComponent } from './catalogue-products.component';

describe('CatalogueProductsComponent', () => {
  let component: CatalogueProductsComponent;
  let fixture: ComponentFixture<CatalogueProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
