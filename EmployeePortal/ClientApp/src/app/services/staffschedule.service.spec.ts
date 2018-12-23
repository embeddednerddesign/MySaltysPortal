import { TestBed, inject } from '@angular/core/testing';

import { StaffScheduleService } from './staffschedule.service';

describe('StaffScheduleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaffScheduleService]
    });
  });

  it('should be created', inject([StaffScheduleService], (service: StaffScheduleService) => {
    expect(service).toBeTruthy();
  }));
});
