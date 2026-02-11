import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;

  const authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['login', 'setToken']);
  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    authSpy.login.calls.reset();
    authSpy.setToken.calls.reset();
    routerSpy.navigateByUrl.calls.reset();
  });

  it('AAA: submit() con form inválido -> NO llama login', () => {
    // Arrange
    component.form.setValue({ username: '', password: '' });
    expect(component.form.invalid).toBeTrue();

    // Act
    component.submit();

    // Assert
    expect(authSpy.login).not.toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('AAA: submit() válido -> login OK -> setToken y navega a /pets', () => {
    // Arrange
    component.form.setValue({ username: 'mateo', password: '123' });
    authSpy.login.and.returnValue(of({ token: 'TKN' }));

    // Act
    component.submit();

    // Assert
    expect(authSpy.login).toHaveBeenCalledWith({ username: 'mateo', password: '123' } as any);
    expect(authSpy.setToken).toHaveBeenCalledWith('TKN');
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/pets');
    expect(component.error).toBe(''); // sin error
  });

  it('AAA: submit() válido -> login error -> setea mensaje de error', () => {
    // Arrange
    component.form.setValue({ username: 'mateo', password: 'bad' });
    authSpy.login.and.returnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));

    // Act
    component.submit();

    // Assert
    expect(authSpy.login).toHaveBeenCalled();
    expect(component.error).toBe('Invalid credentials');
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('AAA: login error sin message -> usa fallback', () => {
    // Arrange
    component.form.setValue({ username: 'mateo', password: 'bad' });
    authSpy.login.and.returnValue(throwError(() => ({})));

    // Act
    component.submit();

    // Assert
    expect(component.error).toBe('Error al iniciar sesión');
  });
});
