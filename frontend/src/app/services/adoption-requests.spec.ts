import { TestBed } from '@angular/core/testing';

import { AdoptionRequests } from './adoption-requests';

describe('AdoptionRequests', () => {
  let service: AdoptionRequests;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdoptionRequests);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
