import { TestBed } from '@angular/core/testing';

import { ObjectRegistryService } from './object-registry.service';

describe('ObjectRegistryService', () => {
  let service: ObjectRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
