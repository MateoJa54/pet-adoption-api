import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/api/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ======================
  // HTTP tests (AAA)
  // ======================

  it('AAA: login() hace POST a /auth/login y retorna token', () => {
    // Arrange
    const body = { username: 'mateo', password: '123' };
    const mockResponse = { token: 'TOKEN123' };

    // Act
    service.login(body).subscribe((res) => {
      // Assert
      expect(res).toEqual(mockResponse);
    });

    // Assert request
    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(mockResponse);
  });

  it('AAA: register() hace POST a /auth/register', () => {
    // Arrange
    const body = { username: 'nuevo', password: '123' };
    const mockResponse = { message: 'User created' };

    // Act
    service.register(body).subscribe((res) => {
      // Assert
      expect(res).toEqual(mockResponse as any);
    });

    // Assert request
    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush(mockResponse);
  });

  // ======================
  // LocalStorage tests (AAA)
  // ======================

  it('AAA: setToken() guarda token en localStorage', () => {
    // Arrange
    const token = 'ABC';

    // Act
    service.setToken(token);

    // Assert
    expect(localStorage.getItem('token')).toBe(token);
  });

  it('AAA: getToken() devuelve token de localStorage', () => {
    // Arrange
    localStorage.setItem('token', 'XYZ');

    // Act
    const token = service.getToken();

    // Assert
    expect(token).toBe('XYZ');
  });

  it('AAA: logout() elimina token de localStorage', () => {
    // Arrange
    localStorage.setItem('token', 'XYZ');

    // Act
    service.logout();

    // Assert
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('AAA: isLoggedIn() true si existe token', () => {
    // Arrange
    localStorage.setItem('token', 'XYZ');

    // Act
    const logged = service.isLoggedIn();

    // Assert
    expect(logged).toBeTrue();
  });

  it('AAA: isLoggedIn() false si NO existe token', () => {
    // Arrange
    localStorage.removeItem('token');

    // Act
    const logged = service.isLoggedIn();

    // Assert
    expect(logged).toBeFalse();
  });
});
