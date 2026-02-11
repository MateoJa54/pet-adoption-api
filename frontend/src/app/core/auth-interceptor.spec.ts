import { authInterceptor } from './auth-interceptor';
import { HttpRequest, HttpHandlerFn, HttpHeaders, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

describe('authInterceptor', () => {
  beforeEach(() => localStorage.clear());

  it('AAA: si hay token -> agrega Authorization Bearer', (done) => {
    // Arrange
    localStorage.setItem('token', 'TKN');

    const req = new HttpRequest('GET', '/test', null, { headers: new HttpHeaders() });
    const next: HttpHandlerFn = (r) => {
      // Assert
      expect(r.headers.get('Authorization')).toBe('Bearer TKN');
      return of(new HttpResponse({ status: 200 }));
    };

    // Act
    authInterceptor(req, next).subscribe(() => done());
  });

  it('AAA: si NO hay token -> no agrega Authorization', (done) => {
    // Arrange
    const req = new HttpRequest('GET', '/test');
    const next: HttpHandlerFn = (r) => {
      // Assert
      expect(r.headers.has('Authorization')).toBeFalse();
      return of(new HttpResponse({ status: 200 }));
    };

    // Act
    authInterceptor(req, next).subscribe(() => done());
  });
});
