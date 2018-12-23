import { TestBed, inject } from '@angular/core/testing';

import { PackagesService } from './packages.service';

describe('PackagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PackagesService]
    });
  });

  it('should be created', inject([PackagesService], (service: PackagesService) => {
    expect(service).toBeTruthy();
  }));
});
