import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';

import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  // Verifica que el interceptor de autenticación se crea correctamente
  // HttpInterceptorFn - Tipo de función interceptor en Angular standalone
  // TestBed.runInInjectionContext() - Ejecuta el interceptor en el contexto de inyección de dependencias
  // expect().toBeTruthy() - Verifica que el interceptor existe
  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  // Tests para aumentar cobertura de funciones

  // Verifica que el interceptor agrega el header Authorization cuando hay token en localStorage
  // req.clone() - Método para clonar la petición HTTP con modificaciones
  // setHeaders - Opción para agregar headers HTTP a la petición
  // jasmine.createSpy() - Crea un spy para rastrear llamadas al método
  // expect().toHaveBeenCalledWith() - Verifica los argumentos con los que se llamó el método
  it('should add Authorization header when token exists', () => {
    spyOn(localStorage, 'getItem').and.returnValue('test-token');
    
    const mockReq = {
      clone: jasmine.createSpy('clone').and.returnValue({ cloned: true })
    } as any;
    
    const mockNext = jasmine.createSpy('next');
    
    TestBed.runInInjectionContext(() => authInterceptor(mockReq, mockNext));
    
    expect(mockReq.clone).toHaveBeenCalledWith({
      setHeaders: { Authorization: 'Bearer test-token' }
    });
  });

  // Verifica que el interceptor NO modifica la petición cuando no hay token
  // expect().not.toHaveBeenCalled() - Verifica que el método NO fue llamado
  // mockNext - Función que pasa la petición al siguiente interceptor o handler
  it('should not modify request when token does not exist', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    
    const mockReq = {
      clone: jasmine.createSpy('clone')
    } as any;
    
    const mockNext = jasmine.createSpy('next');
    
    TestBed.runInInjectionContext(() => authInterceptor(mockReq, mockNext));
    
    expect(mockReq.clone).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(mockReq);
  });
});
