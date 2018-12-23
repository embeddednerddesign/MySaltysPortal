import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShiftComponent } from './create-shift.component';

describe('CreateShiftComponent', () => {
  let component: CreateShiftComponent;
  let fixture: ComponentFixture<CreateShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
