import { TestBed } from '@angular/core/testing';

import { ServerCallsService } from './server-calls.service';

describe('ServerCallsService', () => {
  let service: ServerCallsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerCallsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
