import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdoptionRequestsService } from './adoption-requests';
import { environment } from '../../environments/environment';

describe('AdoptionRequestsService', () => {
  let service: AdoptionRequestsService;
  let httpMock: HttpTestingController;

  const api = `${environment.apiUrl}/adoption-requests`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(AdoptionRequestsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('AAA getAll: GET /adoption-requests', () => {
    // Arrange
    const mockResponse = [{ _id: '1', petId: 'p1', adopterId: 'a1' }];

    // Act
    service.getAll().subscribe((data) => {
      // Assert
      expect(data).toEqual(mockResponse);
    });

    // Assert (request)
    const req = httpMock.expectOne(api);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('AAA getById: GET /adoption-requests/:id', () => {
    // Arrange
    const id = 'r1';
    const mockResponse = { _id: id, petId: 'p1', adopterId: 'a1' };

    // Act
    service.getById(id).subscribe((data) => {
      // Assert
      expect(data).toEqual(mockResponse);
    });

    // Assert (request)
    const req = httpMock.expectOne(`${api}/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('AAA create: POST /adoption-requests (body)', () => {
    // Arrange
    const body = { petId: 'p1', adopterId: 'a1', status: 'Pending', comments: '' };
    const mockResponse = { _id: 'r1', ...body };

    // Act
    service.create(body).subscribe((data) => {
      // Assert
      expect(data).toEqual(mockResponse);
    });

    // Assert (request)
    const req = httpMock.expectOne(api);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(mockResponse);
  });

  it('AAA update: PUT /adoption-requests/:id (body)', () => {
    // Arrange
    const id = 'r1';
    const body = { status: 'Approved' };
    const mockResponse = { _id: id, ...body };

    // Act
    service.update(id, body).subscribe((data) => {
      // Assert
      expect(data).toEqual(mockResponse);
    });

    // Assert (request)
    const req = httpMock.expectOne(`${api}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush(mockResponse);
  });

  it('AAA delete: DELETE /adoption-requests/:id', () => {
    // Arrange
    const id = 'r1';
    const mockResponse = { message: 'deleted' };

    // Act
    service.delete(id).subscribe((data) => {
      // Assert
      expect(data).toEqual(mockResponse);
    });

    // Assert (request)
    const req = httpMock.expectOne(`${api}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
