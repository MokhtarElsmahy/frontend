import { TestBed } from '@angular/core/testing';

import { ClientAuthGuard } from './client-auth.guard';

describe('ClientAuthGuard', () => {
  let guard: ClientAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ClientAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
