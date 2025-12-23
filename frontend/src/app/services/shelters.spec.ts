import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { SheltersService } from './shelters';

describe('SheltersService', () => {
  let service: SheltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(SheltersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
