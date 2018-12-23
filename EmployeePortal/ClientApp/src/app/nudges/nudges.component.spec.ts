import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NudgesComponent } from './nudges.component';

describe('NudgesComponent', () => {
  let component: NudgesComponent;
  let fixture: ComponentFixture<NudgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NudgesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NudgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
