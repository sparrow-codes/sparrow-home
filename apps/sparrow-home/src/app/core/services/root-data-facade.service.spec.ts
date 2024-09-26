import { TestBed } from '@angular/core/testing';

import { RootDataFacadeService } from './root-data-facade.service';

describe('RootDataFacadeService', () => {
  let service: RootDataFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RootDataFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
