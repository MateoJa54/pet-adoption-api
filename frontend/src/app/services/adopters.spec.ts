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
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AdoptersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Verifica que el servicio se crea correctamente
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Verifica que getAll() hace GET a /adopters
  it('should get all adopters', () => {
    const mockAdopters = [{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }];

    service.getAll().subscribe(adopters => {
      expect(adopters).toEqual(mockAdopters);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdopters);
  });

  // Verifica que getById() hace GET a /adopters/:id
  it('should get adopter by id', () => {
    const mockAdopter = { id: '1', name: 'John', email: 'john@test.com' };

    service.getById('1').subscribe(adopter => {
      expect(adopter).toEqual(mockAdopter);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAdopter);
  });

  // Verifica que create() hace POST a /adopters con los datos
  it('should create a new adopter', () => {
    const newAdopter = { name: 'Mike', email: 'mike@test.com' };
    const mockResponse = { id: '3', ...newAdopter };

    service.create(newAdopter).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newAdopter);
    req.flush(mockResponse);
  });

  // Verifica que update() hace PUT a /adopters/:id con los datos actualizados
  it('should update an adopter', () => {
    const updatedAdopter = { name: 'John Updated', email: 'john.new@test.com' };
    const mockResponse = { id: '1', ...updatedAdopter };

    service.update('1', updatedAdopter).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedAdopter);
    req.flush(mockResponse);
  });

  // Verifica que delete() hace DELETE a /adopters/:id
  it('should delete an adopter', () => {
    const mockResponse = { message: 'Adopter deleted successfully' };

    service.delete('1').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
