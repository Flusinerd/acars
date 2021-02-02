import { TestBed } from '@angular/core/testing';

import { SimbriefService } from './simbrief.service';

describe('SimbriefService', () => {
  let service: SimbriefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimbriefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
