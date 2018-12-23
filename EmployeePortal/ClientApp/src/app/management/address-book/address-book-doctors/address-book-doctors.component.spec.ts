import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBookDoctorsComponent } from './address-book-doctors.component';

describe('AddressBookDoctorsComponent', () => {
  let component: AddressBookDoctorsComponent;
  let fixture: ComponentFixture<AddressBookDoctorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressBookDoctorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressBookDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
