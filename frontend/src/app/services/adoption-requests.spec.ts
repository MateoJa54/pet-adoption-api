import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdoptionRequestsService } from './adoption-requests';

describe('AdoptionRequestsService', () => {
  let service: AdoptionRequestsService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/adoption-requests';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AdoptionRequestsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Verifica que el servicio se crea correctamente
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Verifica que getAll() hace GET a /adoption-requests
  it('should get all adoption requests', () => {
    const mockRequests = [
      { id: '1', petId: '1', adopterId: '1' },
      { id: '2', petId: '2', adopterId: '2' }
    ];

    service.getAll().subscribe(requests => {
      expect(requests).toEqual(mockRequests);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockRequests);
  });

  // Verifica que getById() hace GET a /adoption-requests/:id
  it('should get adoption request by id', () => {
    const mockRequest = { id: '1', petId: '1', adopterId: '1', status: 'Pending' };

    service.getById('1').subscribe(request => {
      expect(request).toEqual(mockRequest);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRequest);
  });

  // Verifica que create() hace POST a /adoption-requests con los datos
  it('should create a new adoption request', () => {
    const newRequest = { petId: '3', adopterId: '3', status: 'Pending' };
    const mockResponse = { id: '3', ...newRequest };

    service.create(newRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newRequest);
    req.flush(mockResponse);
  });

  // Verifica que update() hace PUT a /adoption-requests/:id con los datos actualizados
  it('should update an adoption request', () => {
    const updatedRequest = { petId: '1', adopterId: '1', status: 'Approved' };
    const mockResponse = { id: '1', ...updatedRequest };

    service.update('1', updatedRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedRequest);
    req.flush(mockResponse);
  });

  // Verifica que delete() hace DELETE a /adoption-requests/:id
  it('should delete an adoption request', () => {
    const mockResponse = { message: 'Adoption request deleted successfully' };

    service.delete('1').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
