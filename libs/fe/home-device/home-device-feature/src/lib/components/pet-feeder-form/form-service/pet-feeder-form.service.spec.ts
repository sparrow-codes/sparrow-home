import { TestBed } from '@angular/core/testing';

import { PetFeederFormService } from './pet-feeder-form.service';

describe('PetFeederFormService', () => {
  let service: PetFeederFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetFeederFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
