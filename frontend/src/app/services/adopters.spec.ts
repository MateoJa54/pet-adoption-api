import { TestBed } from '@angular/core/testing';

import { Adopters } from './adopters';

describe('Adopters', () => {
  let service: Adopters;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Adopters);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
