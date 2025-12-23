import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PetsService } from './pets';

describe('PetsService', () => {
  let service: PetsService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/pets';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PetsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Verifica que el servicio se crea correctamente
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Verifica que getAll() hace GET a /pets
  // httpMock.expectOne() - Verifica que se hizo exactamente una petición HTTP
  it('should get all pets', () => {
    const mockPets = [{ id: '1', name: 'Max' }, { id: '2', name: 'Luna' }];

    service.getAll().subscribe(pets => {
      expect(pets).toEqual(mockPets);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPets);
  });

  // Verifica que getById() hace GET a /pets/:id
  it('should get pet by id', () => {
    const mockPet = { id: '1', name: 'Max', species: 'Dog' };

    service.getById('1').subscribe(pet => {
      expect(pet).toEqual(mockPet);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPet);
  });

  // Verifica que create() hace POST a /pets con los datos
  // req.request.body - Verifica el cuerpo de la petición HTTP
  it('should create a new pet', () => {
    const newPet = { name: 'Buddy', species: 'Dog', breed: 'Golden' };
    const mockResponse = { id: '3', ...newPet };

    service.create(newPet).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPet);
    req.flush(mockResponse);
  });

  // Verifica que update() hace PUT a /pets/:id con los datos actualizados
  it('should update a pet', () => {
    const updatedPet = { name: 'Max Updated', species: 'Dog' };
    const mockResponse = { id: '1', ...updatedPet };

    service.update('1', updatedPet).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPet);
    req.flush(mockResponse);
  });

  // Verifica que delete() hace DELETE a /pets/:id
  it('should delete a pet', () => {
    const mockResponse = { message: 'Pet deleted successfully' };

    service.delete('1').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
