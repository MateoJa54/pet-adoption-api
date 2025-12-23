import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no hay peticiones HTTP pendientes
  });

  // Verifica que el servicio de autenticación se crea correctamente
  // TestBed.inject() - Inyecta y obtiene una instancia del servicio
  // expect().toBeTruthy() - Verifica que el servicio existe
  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  // Verifica que setToken() guarda el token en localStorage
  // spyOn() - Crea un spy para espiar llamadas a métodos
  // localStorage.setItem() - API del navegador para guardar datos en almacenamiento local
  // expect().toHaveBeenCalledWith() - Verifica que se llamó con argumentos específicos
  it('should store token in localStorage', () => {
    spyOn(localStorage, 'setItem');
    service.setToken('test-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
  });

  // Verifica que getToken() obtiene el token de localStorage
  // localStorage.getItem() - API del navegador para obtener datos del almacenamiento local
  // .and.returnValue() - Configura el valor de retorno del spy
  // expect().toBe() - Verifica igualdad estricta del valor retornado
  it('should retrieve token from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('stored-token');
    const token = service.getToken();
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(token).toBe('stored-token');
  });

  // Verifica que logout() elimina el token de localStorage
  // localStorage.removeItem() - API del navegador para eliminar datos del almacenamiento local
  it('should remove token from localStorage on logout', () => {
    spyOn(localStorage, 'removeItem');
    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  // Verifica que isLoggedIn() retorna true cuando hay token
  // isLoggedIn() - Método que verifica si el usuario tiene sesión activa
  // expect().toBeTrue() - Verifica que el valor sea exactamente true
  it('should return true when token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue('some-token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  // Verifica que isLoggedIn() retorna false cuando no hay token
  // .and.returnValue(null) - Simula que no hay token guardado
  // expect().toBeFalse() - Verifica que el valor sea exactamente false
  it('should return false when token does not exist', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    expect(service.isLoggedIn()).toBeFalse();
  });

  // Verifica que login() hace una petición POST al endpoint de login
  // service.login() - Método que envía credenciales al servidor
  // subscribe() - Se suscribe al observable para ejecutar la petición HTTP
  // httpMock.expectOne() - Verifica que se hizo exactamente una petición HTTP
  // req.request.method - Verifica el método HTTP usado (POST, GET, etc)
  // req.flush() - Simula la respuesta del servidor
  it('should call login endpoint with POST method', () => {
    const mockCredentials = { username: 'testuser', password: 'testpass' };
    const mockResponse = { token: 'mock-token-123' };

    service.login(mockCredentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse);
  });

  // Verifica que register() hace una petición POST al endpoint de registro
  // service.register() - Método que envía datos de registro al servidor
  // httpMock.expectOne() - Verifica que solo se hizo una petición HTTP a esa URL
  it('should call register endpoint with POST method', () => {
    const mockCredentials = { username: 'newuser', password: 'newpass' };
    const mockResponse = { success: true };

    service.register(mockCredentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse);
  });
});
