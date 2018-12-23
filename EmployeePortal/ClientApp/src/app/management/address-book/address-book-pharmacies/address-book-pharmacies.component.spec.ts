import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBookPharmaciesComponent } from './address-book-pharmacies.component';

describe('AddressBookPharmaciesComponent', () => {
  let component: AddressBookPharmaciesComponent;
  let fixture: ComponentFixture<AddressBookPharmaciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressBookPharmaciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressBookPharmaciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
