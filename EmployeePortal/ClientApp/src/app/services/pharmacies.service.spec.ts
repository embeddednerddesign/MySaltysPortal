import { TestBed, inject } from '@angular/core/testing';

import { PharmaciesService } from './pharmacies.service';

describe('PharmaciesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PharmaciesService]
    });
  });

  it('should be created', inject([PharmaciesService], (service: PharmaciesService) => {
    expect(service).toBeTruthy();
  }));
});
