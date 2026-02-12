import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AdoptionRequestsService } from './adoption-requests';
import { environment } from '../../environments/environment';

describe('AdoptionRequestsService', () => {
  let svc: AdoptionRequestsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdoptionRequestsService, provideHttpClient(), provideHttpClientTesting()],
    });
    svc = TestBed.inject(AdoptionRequestsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAll hace GET a /adoption-requests', () => {
    svc.getAll().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/adoption-requests`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getById hace GET a /adoption-requests/:id', () => {
    svc.getById('r1').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/adoption-requests/r1`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('create hace POST a /adoption-requests', () => {
    svc.create({}).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/adoption-requests`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('update hace PUT a /adoption-requests/:id', () => {
    svc.update('r1', { status: 'Approved' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/adoption-requests/r1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('delete hace DELETE a /adoption-requests/:id', () => {
    svc.delete('r1').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/adoption-requests/r1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
