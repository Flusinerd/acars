import { TestBed } from '@angular/core/testing';

import { FlightProgressService } from './flight-progress.service';

describe('FlightProgressService', () => {
  let service: FlightProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
