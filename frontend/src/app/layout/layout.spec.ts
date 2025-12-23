import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LayoutComponent } from './layout';
import { AuthService } from '../services/auth';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([]), // 👈 esto arregla RouterLinkActive
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl'); // 👈 espía real, no mock
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verifica que el componente Layout se crea correctamente
  // expect().toBeTruthy() - Verifica que el valor sea verdadero (no null, undefined, false, 0, '', NaN)
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Verifica que el método logout() llama al servicio de autenticación y navega a la página de login
  // component.logout() - Llama al método logout del componente
  // expect().toHaveBeenCalled() - Verifica que el spy fue llamado al menos una vez
  // expect().toHaveBeenCalledWith() - Verifica que el spy fue llamado con argumentos específicos
  it('should call auth.logout and navigate to login', () => {
    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
