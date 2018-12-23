import { TestBed, inject } from '@angular/core/testing';

import { ClinicsService } from './clinics.service';

describe('ClinicsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClinicsService]
    });
  });

  it('should be created', inject([ClinicsService], (service: ClinicsService) => {
    expect(service).toBeTruthy();
  }));
});
