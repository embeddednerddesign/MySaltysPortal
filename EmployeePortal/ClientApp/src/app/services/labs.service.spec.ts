import { TestBed, inject } from '@angular/core/testing';

import { LabsService } from './labs.service';

describe('LabsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LabsService]
    });
  });

  it('should be created', inject([LabsService], (service: LabsService) => {
    expect(service).toBeTruthy();
  }));
});
