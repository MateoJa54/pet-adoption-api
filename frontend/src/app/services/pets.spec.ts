import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PetsService } from './pets';

describe('PetsService', () => {
  let service: PetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(PetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
