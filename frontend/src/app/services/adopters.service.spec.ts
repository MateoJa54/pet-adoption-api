import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdoptersService } from './adopters';

describe('AdoptersService', () => {
  let service: AdoptersService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/api/adopters';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AdoptersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('AAA: getAll() hace GET a /adopters y retorna array', () => {
    // Arrange
    const mockAdopters = [
      { _id: '1', fullName: 'John Doe', nationalId: '123', phone: '555-0001', email: 'john@example.com' },
      { _id: '2', fullName: 'Jane Smith', nationalId: '456', phone: '555-0002', email: 'jane@example.com' },
    ];

    // Act
    service.getAll().subscribe((adopters) => {
      // Assert
      expect(adopters).toEqual(mockAdopters);
      expect(adopters.length).toBe(2);
    });

    // Assert request
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdopters);
  });

  it('AAA: getById() hace GET a /adopters/:id y retorna un adopter', () => {
    // Arrange
    const adopterId = '123';
    const mockAdopter = {
      _id: adopterId,
      fullName: 'John Doe',
      nationalId: '123',
      phone: '555-0001',
      email: 'john@example.com',
    };

    // Act
    service.getById(adopterId).subscribe((adopter) => {
      // Assert
      expect(adopter).toEqual(mockAdopter);
      expect(adopter._id).toBe(adopterId);
    });

    // Assert request
    const req = httpMock.expectOne(`${apiUrl}/${adopterId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdopter);
  });

  it('AAA: create() hace POST a /adopters con datos del adopter', () => {
    // Arrange
    const newAdopter = {
      fullName: 'New Adopter',
      nationalId: '789',
      phone: '555-0003',
      email: 'new@example.com',
    };
    const mockResponse = { _id: '3', ...newAdopter };

    // Act
    service.create(newAdopter).subscribe((adopter) => {
      // Assert
      expect(adopter).toEqual(mockResponse);
      expect(adopter._id).toBe('3');
    });

    // Assert request
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAdopter);
    req.flush(mockResponse);
  });

  it('AAA: update() hace PUT a /adopters/:id con datos actualizados', () => {
    // Arrange
    const adopterId = '1';
    const updatedData = {
      fullName: 'Updated Name',
      nationalId: '123',
      phone: '555-9999',
      email: 'updated@example.com',
    };
    const mockResponse = { _id: adopterId, ...updatedData };

    // Act
    service.update(adopterId, updatedData).subscribe((adopter) => {
      // Assert
      expect(adopter).toEqual(mockResponse);
      expect(adopter._id).toBe(adopterId);
      expect(adopter.fullName).toBe('Updated Name');
    });

    // Assert request
    const req = httpMock.expectOne(`${apiUrl}/${adopterId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedData);
    req.flush(mockResponse);
  });

  it('AAA: delete() hace DELETE a /adopters/:id', () => {
    // Arrange
    const adopterId = '1';
    const mockResponse = { message: 'Adopter deleted successfully' };

    // Act
    service.delete(adopterId).subscribe((response) => {
      // Assert
      expect(response).toEqual(mockResponse);
      expect(response.message).toBe('Adopter deleted successfully');
    });

    // Assert request
    const req = httpMock.expectOne(`${apiUrl}/${adopterId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  // ======================
  // Error handling tests
  // ======================

  it('AAA: getAll() maneja error de red correctamente', () => {
    // Arrange
    const errorMessage = 'Network error';

    // Act
    service.getAll().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        // Assert
        expect(error.status).toBe(500);
      },
    });

    // Assert request
    const req = httpMock.expectOne(apiUrl);
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });

  it('AAA: create() maneja error de validación correctamente', () => {
    // Arrange
    const invalidAdopter = { fullName: '' };
    const errorMessage = 'Validation failed';

    // Act
    service.create(invalidAdopter).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        // Assert
        expect(error.status).toBe(400);
      },
    });

    // Assert request
    const req = httpMock.expectOne(apiUrl);
    req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
  });
});
