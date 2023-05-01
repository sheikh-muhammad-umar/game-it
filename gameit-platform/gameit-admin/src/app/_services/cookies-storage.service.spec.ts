import { TestBed } from '@angular/core/testing';

import { CookiesStorageService } from './cookies-storage.service';

describe('TokenStorageService', () => {
  let service: CookiesStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookiesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
