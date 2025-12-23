import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AdoptionRequestsService } from './adoption-requests';

describe('AdoptionRequestsService', () => {
  let service: AdoptionRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(AdoptionRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
