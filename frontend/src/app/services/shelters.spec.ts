import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SheltersService } from './shelters';

describe('SheltersService', () => {
  let service: SheltersService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/shelters';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(SheltersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Verifica que el servicio se crea correctamente
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Verifica que getAll() hace GET a /shelters
  it('should get all shelters', () => {
    const mockShelters = [{ id: '1', name: 'Shelter A' }, { id: '2', name: 'Shelter B' }];

    service.getAll().subscribe(shelters => {
      expect(shelters).toEqual(mockShelters);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockShelters);
  });

  // Verifica que getById() hace GET a /shelters/:id
  it('should get shelter by id', () => {
    const mockShelter = { id: '1', name: 'Shelter A', address: '123 Main St' };

    service.getById('1').subscribe(shelter => {
      expect(shelter).toEqual(mockShelter);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockShelter);
  });

  // Verifica que create() hace POST a /shelters con los datos
  it('should create a new shelter', () => {
    const newShelter = { name: 'Shelter C', address: '456 Oak Ave' };
    const mockResponse = { id: '3', ...newShelter };

    service.create(newShelter).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newShelter);
    req.flush(mockResponse);
  });

  // Verifica que update() hace PUT a /shelters/:id con los datos actualizados
  it('should update a shelter', () => {
    const updatedShelter = { name: 'Shelter A Updated', address: '789 Elm St' };
    const mockResponse = { id: '1', ...updatedShelter };

    service.update('1', updatedShelter).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedShelter);
    req.flush(mockResponse);
  });

  // Verifica que delete() hace DELETE a /shelters/:id
  it('should delete a shelter', () => {
    const mockResponse = { message: 'Shelter deleted successfully' };

    service.delete('1').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
