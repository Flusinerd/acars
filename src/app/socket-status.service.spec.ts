import { TestBed } from '@angular/core/testing';

import { SocketStatusService } from './socket-status.service';

describe('SocketStatusService', () => {
  let service: SocketStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
