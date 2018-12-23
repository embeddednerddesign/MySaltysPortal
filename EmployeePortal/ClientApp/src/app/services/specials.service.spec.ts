import { TestBed, inject } from '@angular/core/testing';

import { SpecialsService } from './specials.service';

describe('SpecialsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpecialsService]
    });
  });

  it('should be created', inject([SpecialsService], (service: SpecialsService) => {
    expect(service).toBeTruthy();
  }));
});
