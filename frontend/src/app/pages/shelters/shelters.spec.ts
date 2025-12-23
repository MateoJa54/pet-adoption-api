import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SheltersComponent } from './shelters';
import { SheltersService } from '../../services/shelters';
import { of, throwError } from 'rxjs';

describe('SheltersComponent - Frontend Tests', () => {
  let component: SheltersComponent;
  let fixture: ComponentFixture<SheltersComponent>;
  let sheltersSvcSpy: jasmine.SpyObj<SheltersService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SheltersService', ['getAll']);
    spy.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [SheltersComponent],
      providers: [
        { provide: SheltersService, useValue: spy }
      ]
    })
    .compileComponents();

    sheltersSvcSpy = TestBed.inject(SheltersService) as jasmine.SpyObj<SheltersService>;
    fixture = TestBed.createComponent(SheltersComponent);
    component = fixture.componentInstance;
  });

  // Verifica que el componente se crea correctamente
  // expect().toBeTruthy() - Verifica que el valor sea verdadero
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Verifica que se muestra el título "Shelters" en un elemento h2
  // spy.and.returnValue() - Configura el spy para retornar un valor específico
  // of([]) - Crea un observable que emite un array vacío
  // fixture.detectChanges() - Ejecuta la detección de cambios para actualizar la vista
  it('should display title "Shelters"', () => {
    sheltersSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const h2 = compiled.querySelector('h2');
    expect(h2?.textContent).toBe('Shelters');
  });

  // Verifica que la tabla siempre se muestra, incluso cuando está en estado de carga
  it('should always display table regardless of loading state', () => {
    component.loading = true;
    sheltersSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('table');
    expect(table).toBeTruthy();
  });

  // Verifica que la tabla se renderiza con 4 headers correctos (Nombre, Dirección, Teléfono, Email)
  // querySelectorAll('th') - Busca todos los elementos th (headers de tabla)
  // expect().toBe() - Verifica igualdad estricta
  it('should display table with correct headers', () => {
    sheltersSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const headers = compiled.querySelectorAll('th');
    
    expect(headers.length).toBe(4);
    expect(headers[0].textContent).toBe('Nombre');
    expect(headers[1].textContent).toBe('Dirección');
    expect(headers[2].textContent).toBe('Teléfono');
    expect(headers[3].textContent).toBe('Email');
  });

  // Verifica que los datos de los refugios se muestran correctamente en las filas de la tabla
  // of(mockShelters) - Crea un observable que emite el array de refugios mock
  // rows[1] - Accede a la segunda fila (índice 1, la primera es el header)
  // .trim() - Elimina espacios en blanco al inicio y final
  it('should display shelter data in table rows', () => {
    const mockShelters = [
      { name: 'Refugio Esperanza', address: 'Calle 123', phone: '555-0001', email: 'esperanza@shelter.com' },
      { name: 'Hogar Feliz', address: 'Av. Principal 456', phone: '555-0002', email: 'feliz@shelter.com' }
    ];
    
    sheltersSvcSpy.getAll.and.returnValue(of(mockShelters));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('table tr');
    
    expect(rows.length).toBe(3); // 1 header + 2 data rows
    
    const firstDataRow = rows[1].querySelectorAll('td');
    expect(firstDataRow[0].textContent?.trim()).toBe('Refugio Esperanza');
    expect(firstDataRow[1].textContent?.trim()).toBe('Calle 123');
    expect(firstDataRow[2].textContent?.trim()).toBe('555-0001');
    expect(firstDataRow[3].textContent?.trim()).toBe('esperanza@shelter.com');
  });

  // Verifica que cuando no hay datos, la tabla solo muestra la fila de headers
  // expect().toBe(1) - Verifica que solo existe 1 fila
  it('should display empty table body when shelters array is empty', () => {
    sheltersSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('table tr');
    expect(rows.length).toBe(1); // Only header row
  });

  // Verifica que se pueden renderizar múltiples refugios correctamente (3 filas de datos)
  // expect().toBe(4) - Verifica 1 header + 3 filas de datos
  it('should render multiple shelters correctly', () => {
    const mockShelters = [
      { name: 'Shelter 1', address: 'Address 1', phone: '111', email: 'email1@test.com' },
      { name: 'Shelter 2', address: 'Address 2', phone: '222', email: 'email2@test.com' },
      { name: 'Shelter 3', address: 'Address 3', phone: '333', email: 'email3@test.com' }
    ];
    
    sheltersSvcSpy.getAll.and.returnValue(of(mockShelters));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const dataRows = compiled.querySelectorAll('table tr');
    
    expect(dataRows.length).toBe(4); // 1 header + 3 data rows
  });

  // Verifica que la tabla tiene los atributos HTML border="1" y cellpadding="6"
  // getAttribute() - Obtiene el valor de un atributo HTML del elemento
  it('should have table with border and cellpadding attributes', () => {
    sheltersSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('table');
    expect(table?.getAttribute('border')).toBe('1');
    expect(table?.getAttribute('cellpadding')).toBe('6');
  });

  // Verifica que todas las propiedades del refugio se muestran en el orden correcto
  // querySelectorAll('td') - Busca todos los elementos td (celdas de datos)
  it('should display all shelter properties in correct order', () => {
    const mockShelter = { 
      name: 'Test Shelter', 
      address: '123 Test St', 
      phone: '555-TEST', 
      email: 'test@shelter.org' 
    };
    
    sheltersSvcSpy.getAll.and.returnValue(of([mockShelter]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const cells = compiled.querySelectorAll('table tr:nth-child(2) td');
    
    expect(cells[0].textContent?.trim()).toBe(mockShelter.name);
    expect(cells[1].textContent?.trim()).toBe(mockShelter.address);
    expect(cells[2].textContent?.trim()).toBe(mockShelter.phone);
    expect(cells[3].textContent?.trim()).toBe(mockShelter.email);
  });

  it('should have proper table structure with thead implied', () => {
    sheltersSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('table');
    const headerRow = table?.querySelector('tr');
    
    expect(headerRow).toBeTruthy();
    expect(headerRow?.querySelectorAll('th').length).toBe(4);
  });

  // Tests de lógica para aumentar cobertura

  // Verifica que loading es true inicialmente
  it('should set loading to true initially', () => {
    expect(component.loading).toBeTrue();
  });

  // Verifica que loading cambia a false después de cargar datos exitosamente
  it('should set loading to false after successful data load', () => {
    sheltersSvcSpy.getAll.and.returnValue(of([{ name: 'Test Shelter' }]));
    component.ngOnInit();
    expect(component.loading).toBeFalse();
  });

  // Verifica que los datos se asignan correctamente al array shelters
  it('should assign data to shelters array', () => {
    const mockData = [{ name: 'Shelter A' }, { name: 'Shelter B' }];
    sheltersSvcSpy.getAll.and.returnValue(of(mockData));
    component.ngOnInit();
    expect(component.shelters).toEqual(mockData);
  });

  // Verifica que se maneja el error correctamente y se establece mensaje de error
  it('should handle error and set error message', () => {
    sheltersSvcSpy.getAll.and.returnValue(throwError(() => new Error('Network error')));
    component.ngOnInit();
    expect(component.error).toBe('Error cargando shelters');
    expect(component.loading).toBeFalse();
  });
});
