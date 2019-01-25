import { TestBed, inject } from '@angular/core/testing';

import { CurrentDataService } from './currentData.service';

describe('CurrentDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentDataService]
    });
  });

  it('should be created', inject([CurrentDataService], (service: CurrentDataService) => {
    expect(service).toBeTruthy();
  }));
});
