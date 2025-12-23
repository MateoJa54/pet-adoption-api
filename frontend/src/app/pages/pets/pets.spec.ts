import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetsComponent } from './pets';
import { PetsService } from '../../services/pets';
import { of, throwError } from 'rxjs';

describe('PetsComponent - Frontend Tests', () => {
  let component: PetsComponent;
  let fixture: ComponentFixture<PetsComponent>;
  let petsSvcSpy: jasmine.SpyObj<PetsService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PetsService', ['getAll']);
    spy.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [PetsComponent],
      providers: [
        { provide: PetsService, useValue: spy }
      ]
    })
    .compileComponents();

    petsSvcSpy = TestBed.inject(PetsService) as jasmine.SpyObj<PetsService>;
    fixture = TestBed.createComponent(PetsComponent);
    component = fixture.componentInstance;
  });

  // Verifica que el componente se crea correctamente
  // expect().toBeTruthy() - Verifica que el valor sea verdadero
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Verifica que se muestra el título "Pets" en un elemento h2
  // spy.and.returnValue() - Configura el spy para retornar un valor específico
  // of([]) - Crea un observable que emite un array vacío
  it('should display title "Pets"', () => {
    petsSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const h2 = compiled.querySelector('h2');
    expect(h2?.textContent).toBe('Pets');
  });

  // Verifica que la tabla se renderiza con 6 headers correctos (Nombre, Especie, Raza, Edad, Sexo, Estado)
  // querySelectorAll('th') - Busca todos los elementos th (headers de tabla)
  // expect().toBe() - Verifica igualdad estricta
  it('should display table with correct headers', () => {
    petsSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const headers = compiled.querySelectorAll('th');
    
    expect(headers.length).toBe(6);
    expect(headers[0].textContent).toBe('Nombre');
    expect(headers[1].textContent).toBe('Especie');
    expect(headers[2].textContent).toBe('Raza');
    expect(headers[3].textContent).toBe('Edad');
    expect(headers[4].textContent).toBe('Sexo');
    expect(headers[5].textContent).toBe('Estado');
  });

  // Verifica que los datos de las mascotas se muestran correctamente en las filas de la tabla
  // of(mockPets) - Crea un observable que emite el array de mascotas mock
  // rows[1] - Accede a la segunda fila (índice 1, la primera es el header)
  // .trim() - Elimina espacios en blanco al inicio y final
  it('should display pet data in table rows', () => {
    const mockPets = [
      { name: 'Firulais', species: 'Perro', breed: 'Labrador', ageYears: 3, sex: 'M', status: 'Disponible' },
      { name: 'Michi', species: 'Gato', breed: 'Siamés', ageYears: 2, sex: 'F', status: 'Adoptado' }
    ];
    
    petsSvcSpy.getAll.and.returnValue(of(mockPets));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('table tr');
    
    expect(rows.length).toBe(3); // 1 header + 2 data rows
    
    const firstDataRow = rows[1].querySelectorAll('td');
    expect(firstDataRow[0].textContent?.trim()).toBe('Firulais');
    expect(firstDataRow[1].textContent?.trim()).toBe('Perro');
    expect(firstDataRow[2].textContent?.trim()).toBe('Labrador');
    expect(firstDataRow[3].textContent?.trim()).toBe('3');
    expect(firstDataRow[4].textContent?.trim()).toBe('M');
    expect(firstDataRow[5].textContent?.trim()).toBe('Disponible');
  });

  // Verifica que cuando no hay datos, la tabla solo muestra la fila de headers
  // expect().toBe(1) - Verifica que solo existe 1 fila
  it('should display empty table body when pets array is empty', () => {
    petsSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('table tr');
    expect(rows.length).toBe(1); // Only header row
  });

  // Verifica que se pueden renderizar múltiples mascotas correctamente (3 filas de datos)
  // expect().toBe(4) - Verifica 1 header + 3 filas de datos
  it('should render multiple pets correctly', () => {
    const mockPets = [
      { name: 'Pet1', species: 'Dog', breed: 'Breed1', ageYears: 1, sex: 'M', status: 'Available' },
      { name: 'Pet2', species: 'Cat', breed: 'Breed2', ageYears: 2, sex: 'F', status: 'Adopted' },
      { name: 'Pet3', species: 'Bird', breed: 'Breed3', ageYears: 3, sex: 'M', status: 'Available' }
    ];
    
    petsSvcSpy.getAll.and.returnValue(of(mockPets));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const dataRows = compiled.querySelectorAll('table tr');
    
    expect(dataRows.length).toBe(4); // 1 header + 3 data rows
  });

  // Verifica que la tabla tiene los atributos HTML border="1" y cellpadding="6"
  // getAttribute() - Obtiene el valor de un atributo HTML del elemento
  it('should have table with border and cellpadding attributes', () => {
    petsSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('table');
    expect(table?.getAttribute('border')).toBe('1');
    expect(table?.getAttribute('cellpadding')).toBe('6');
  });

  // Tests de lógica para aumentar cobertura

  // Verifica que loading es true inicialmente
  it('should set loading to true initially', () => {
    expect(component.loading).toBeTrue();
  });

  // Verifica que loading cambia a false después de cargar datos exitosamente
  it('should set loading to false after successful data load', () => {
    petsSvcSpy.getAll.and.returnValue(of([{ name: 'Max' }]));
    component.ngOnInit();
    expect(component.loading).toBeFalse();
  });

  // Verifica que los datos se asignan correctamente al array pets
  it('should assign data to pets array', () => {
    const mockData = [{ name: 'Max', species: 'Dog' }, { name: 'Luna', species: 'Cat' }];
    petsSvcSpy.getAll.and.returnValue(of(mockData));
    component.ngOnInit();
    expect(component.pets).toEqual(mockData);
  });

  // Verifica que se maneja el error correctamente
  it('should handle error and set error message', () => {
    const mockError = { error: { message: 'Error de red' } };
    petsSvcSpy.getAll.and.returnValue(throwError(() => mockError));
    component.ngOnInit();
    expect(component.error).toBe('Error de red');
    expect(component.loading).toBeFalse();
  });

  // Verifica que se muestra mensaje por defecto si el error no tiene mensaje
  it('should set default error message when error has no message', () => {
    petsSvcSpy.getAll.and.returnValue(throwError(() => ({})));
    component.ngOnInit();
    expect(component.error).toBe('Error cargando pets');
  });
});
