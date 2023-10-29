import { TestBed } from '@angular/core/testing';

import { ManuscriptRequestService } from './manuscript-request.service';

describe('ManuscriptRequestService', () => {
  let service: ManuscriptRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManuscriptRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
