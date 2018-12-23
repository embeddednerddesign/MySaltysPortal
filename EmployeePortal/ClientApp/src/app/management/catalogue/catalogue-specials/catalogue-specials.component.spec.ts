import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueSpecialsComponent } from './catalogue-specials.component';

describe('CatalogueSpecialsComponent', () => {
  let component: CatalogueSpecialsComponent;
  let fixture: ComponentFixture<CatalogueSpecialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueSpecialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueSpecialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
