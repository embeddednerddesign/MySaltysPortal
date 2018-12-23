import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CataloguePackagesComponent } from './catalogue-packages.component';

describe('CataloguePackagesComponent', () => {
  let component: CataloguePackagesComponent;
  let fixture: ComponentFixture<CataloguePackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CataloguePackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CataloguePackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
