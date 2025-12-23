import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AdoptersService } from './adopters';

describe('AdoptersService', () => {
  let service: AdoptersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(AdoptersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
