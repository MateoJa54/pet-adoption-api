import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent - Frontend Tests', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSvcSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'setToken']);
    const routSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routSpy }
      ]
    })
    .compileComponents();

    authSvcSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verifica que el componente se crea correctamente
  // expect().toBeTruthy() - Verifica que el valor sea verdadero
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Verifica que se muestra el título "Iniciar sesión" en un elemento h2
  // querySelector('h2') - Busca el primer elemento h2 en el DOM
  it('should display title "Iniciar sesión"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h2 = compiled.querySelector('h2');
    expect(h2?.textContent).toBe('Iniciar sesión');
  });

  // Verifica que el formulario contiene campos de input para username y password
  // querySelector('[attribute]') - Busca elementos por atributo
  it('should render login form with username and password fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const usernameInput = compiled.querySelector('input[formControlName="username"]');
    const passwordInput = compiled.querySelector('input[formControlName="password"]');
    
    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });

  // Verifica que los inputs tienen los tipos correctos (text para username, password para password)
  // as HTMLInputElement - Type casting para acceder a propiedades específicas de input
  // .type - Propiedad que devuelve el tipo de input
  it('should have correct input types', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const usernameInput = compiled.querySelector('input[formControlName="username"]') as HTMLInputElement;
    const passwordInput = compiled.querySelector('input[formControlName="password"]') as HTMLInputElement;
    
    expect(usernameInput.type).toBe('text');
    expect(passwordInput.type).toBe('password');
  });

  // Verifica que existen labels con los textos "Usuario" y "Contraseña"
  // querySelectorAll('label') - Busca todos los elementos label
  // expect().toBeGreaterThanOrEqual() - Verifica que un valor sea mayor o igual
  it('should display labels for username and password', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const labels = compiled.querySelectorAll('label');
    
    expect(labels.length).toBeGreaterThanOrEqual(2);
    expect(labels[0].textContent).toBe('Usuario');
    expect(labels[1].textContent).toBe('Contraseña');
  });

  // Verifica que existe un botón de submit con el texto "Entrar"
  // querySelector('[type="submit"]') - Busca por atributo type
  it('should render submit button with text "Entrar"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button[type="submit"]');
    
    expect(button).toBeTruthy();
    expect(button?.textContent).toBe('Entrar');
  });

  // Verifica que inicialmente no se muestra ningún mensaje de error
  // expect().toBeNull() - Verifica que el valor sea null
  it('should not display error message initially', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const errorP = compiled.querySelector('p.error');
    
    expect(errorP).toBeNull();
  });

  // Verifica que cuando existe un error, se muestra el mensaje correspondiente
  // component.error = - Establece una propiedad del componente directamente
  // fixture.detectChanges() - Fuerza la actualización del DOM
  it('should display error message when error exists', () => {
    component.error = 'Credenciales inválidas';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const errorP = compiled.querySelector('p.error');
    
    expect(errorP).toBeTruthy();
    expect(errorP?.textContent?.trim()).toBe('Credenciales inválidas');
  });

  // Verifica que existen 2 divs con clase "form-group" (uno para cada campo)
  // querySelector('.class') - Busca elementos por clase CSS
  it('should have form-group divs for each input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const formGroups = compiled.querySelectorAll('.form-group');
    
    expect(formGroups.length).toBe(2);
  });

  // Verifica que existen los divs contenedores "login-container" y "login-card"
  it('should have login-container and login-card divs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('.login-container');
    const card = compiled.querySelector('.login-card');
    
    expect(container).toBeTruthy();
    expect(card).toBeTruthy();
  });

  // Verifica que existe un elemento form en el DOM
  it('should have a form element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const form = compiled.querySelector('form');
    
    expect(form).toBeTruthy();
  });

  // Verifica que el formulario se inicializa con valores vacíos
  // component.form.get() - Obtiene un control del formulario reactivo
  // ?.value - Accede al valor del control
  it('should initialize form with empty values', () => {
    expect(component.form.get('username')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  // Verifica que el formulario es inválido cuando los campos están vacíos
  // .valid - Propiedad que indica si el formulario es válido
  // expect().toBeFalse() - Verifica que el valor sea false
  it('should mark form as invalid when fields are empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  // Verifica que el formulario es válido cuando ambos campos están llenos
  // .patchValue() - Establece valores en múltiples controles del formulario
  // expect().toBeTrue() - Verifica que el valor sea true
  it('should mark form as valid when fields are filled', () => {
    component.form.patchValue({
      username: 'testuser',
      password: 'testpass'
    });
    
    expect(component.form.valid).toBeTrue();
  });

  // Tests de lógica para aumentar cobertura

  // Verifica que submit() no hace nada si el formulario es inválido
  it('should not call auth service if form is invalid', () => {
    component.form.patchValue({ username: '', password: '' });
    component.submit();
    expect(authSvcSpy.login).not.toHaveBeenCalled();
  });

  // Verifica que submit() llama al servicio de autenticación con datos válidos
  it('should call auth service when form is valid', () => {
    const mockResponse = { token: 'test-token-123' };
    authSvcSpy.login.and.returnValue(of(mockResponse));
    
    component.form.patchValue({ username: 'testuser', password: 'testpass' });
    component.submit();
    
    expect(authSvcSpy.login).toHaveBeenCalledWith({ username: 'testuser', password: 'testpass' });
  });

  // Verifica que después de login exitoso, se guarda el token
  it('should save token on successful login', () => {
    const mockResponse = { token: 'test-token-123' };
    authSvcSpy.login.and.returnValue(of(mockResponse));
    
    component.form.patchValue({ username: 'testuser', password: 'testpass' });
    component.submit();
    
    expect(authSvcSpy.setToken).toHaveBeenCalledWith('test-token-123');
  });

  // Verifica que después de login exitoso, se navega a /pets
  it('should navigate to /pets on successful login', () => {
    const mockResponse = { token: 'test-token-123' };
    authSvcSpy.login.and.returnValue(of(mockResponse));
    
    component.form.patchValue({ username: 'testuser', password: 'testpass' });
    component.submit();
    
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/pets');
  });

  // Verifica que si el login falla, se muestra el mensaje de error del servidor
  it('should display error message on login failure', () => {
    const mockError = { error: { message: 'Credenciales inválidas' } };
    authSvcSpy.login.and.returnValue(throwError(() => mockError));
    
    component.form.patchValue({ username: 'wronguser', password: 'wrongpass' });
    component.submit();
    
    expect(component.error).toBe('Credenciales inválidas');
  });

  // Verifica que si el error no tiene mensaje, se muestra mensaje por defecto
  it('should display default error message when error has no message', () => {
    authSvcSpy.login.and.returnValue(throwError(() => ({})));
    
    component.form.patchValue({ username: 'testuser', password: 'testpass' });
    component.submit();
    
    expect(component.error).toBe('Error al iniciar sesión');
  });
});
