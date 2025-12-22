import { TestBed } from '@angular/core/testing';

import { Shelters } from './shelters';

describe('Shelters', () => {
  let service: Shelters;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Shelters);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
