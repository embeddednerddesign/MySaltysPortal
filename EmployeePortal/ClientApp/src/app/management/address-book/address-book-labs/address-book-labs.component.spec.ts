import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBookLabsComponent } from './address-book-labs.component';

describe('AddressBookLabsComponent', () => {
  let component: AddressBookLabsComponent;
  let fixture: ComponentFixture<AddressBookLabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressBookLabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressBookLabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
