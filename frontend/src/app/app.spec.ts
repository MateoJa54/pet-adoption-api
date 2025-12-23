import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  // Verifica que el componente principal de la aplicación se crea correctamente
  // TestBed.createComponent() - Crea una instancia del componente para testing
  // fixture.componentInstance - Obtiene la instancia del componente
  // expect().toBeTruthy() - Verifica que el valor sea verdadero
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Tests para aumentar cobertura de funciones

  // Verifica que la propiedad title es un signal de Angular con el valor "frontend"
  // app['title'] - Accede a la propiedad protegida title usando notación de corchetes
  // () - Invoca el signal para obtener su valor (los signals son funciones)
  // expect().toBe() - Verifica igualdad estricta (===)
  it('should have title as signal with value "frontend"', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app['title']()).toBe('frontend');
  });
});
