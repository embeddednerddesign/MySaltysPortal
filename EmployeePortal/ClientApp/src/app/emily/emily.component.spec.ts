import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmilyComponent } from './emily.component';

describe('EmilyComponent', () => {
  let component: EmilyComponent;
  let fixture: ComponentFixture<EmilyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmilyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
