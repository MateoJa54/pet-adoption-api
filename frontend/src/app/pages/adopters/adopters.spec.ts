import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdoptersComponent } from './adopters';
import { AdoptersService } from '../../services/adopters';
import { of, throwError } from 'rxjs';

describe('AdoptersComponent - Frontend Tests', () => {
  let component: AdoptersComponent;
  let fixture: ComponentFixture<AdoptersComponent>;
  let adoptersSvcSpy: jasmine.SpyObj<AdoptersService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AdoptersService', ['getAll']);
    spy.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AdoptersComponent],
      providers: [
        { provide: AdoptersService, useValue: spy }
      ]
    })
    .compileComponents();

    adoptersSvcSpy = TestBed.inject(AdoptersService) as jasmine.SpyObj<AdoptersService>;
    fixture = TestBed.createComponent(AdoptersComponent);
    component = fixture.componentInstance;
  });

  // Verifica que el componente se crea correctamente
  // expect().toBeTruthy() - Verifica que el valor sea verdadero (no null, undefined, 0, false, '')
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Verifica que se muestra el título "Adopters" en un elemento h2
  // spy.and.returnValue() - Configura el spy para retornar un valor específico
  // fixture.detectChanges() - Ejecuta el ciclo de detección de cambios de Angular
  // querySelector() - Busca un elemento en el DOM usando un selector CSS
  // expect().toBe() - Verifica igualdad estricta (===)
  it('should display title "Adopters"', () => {
    adoptersSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const h2 = compiled.querySelector('h2');
    expect(h2?.textContent).toBe('Adopters');
  });

  // Verifica que la tabla se renderiza con los headers correctos (Full Name, National ID, Phone, Email)
  // querySelectorAll() - Busca todos los elementos que coinciden con el selector CSS
  // expect().toBe() - Verifica que el número de headers sea exactamente 4
  it('should display table with headers when data is loaded', () => {
    adoptersSvcSpy.getAll.and.returnValue(of([
      { fullName: 'Juan Pérez', nationalId: '12345', phone: '555-1234', email: 'juan@test.com' }
    ]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('table');
    expect(table).toBeTruthy();
    
    const headers = table?.querySelectorAll('th');
    expect(headers?.length).toBe(4);
    expect(headers?.[0].textContent).toBe('Full Name');
    expect(headers?.[1].textContent).toBe('National ID');
    expect(headers?.[2].textContent).toBe('Phone');
    expect(headers?.[3].textContent).toBe('Email');
  });

  // Verifica que los datos de los adoptantes se muestran correctamente en las filas de la tabla
  // of() - Crea un observable que emite los valores proporcionados
  // querySelectorAll('td') - Busca todas las celdas de datos en una fila
  // .trim() - Elimina espacios en blanco al inicio y final del texto
  it('should display adopter data in table rows', () => {
    const mockAdopters = [
      { fullName: 'Juan Pérez', nationalId: '12345', phone: '555-1234', email: 'juan@test.com' },
      { fullName: 'María López', nationalId: '67890', phone: '555-5678', email: 'maria@test.com' }
    ];
    
    adoptersSvcSpy.getAll.and.returnValue(of(mockAdopters));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('table tr');
    
    expect(rows.length).toBe(3); // 1 header + 2 data rows
    
    const firstDataRow = rows[1].querySelectorAll('td');
    expect(firstDataRow[0].textContent?.trim()).toBe('Juan Pérez');
    expect(firstDataRow[1].textContent?.trim()).toBe('12345');
    expect(firstDataRow[2].textContent?.trim()).toBe('555-1234');
    expect(firstDataRow[3].textContent?.trim()).toBe('juan@test.com');
  });

  // Verifica que cuando no hay datos, la tabla solo muestra la fila de headers
  // expect().toBe(1) - Verifica que solo hay 1 fila (la de headers)
  it('should display empty table when adopters array is empty', () => {
    adoptersSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('table tr');
    expect(rows.length).toBe(1); // Only header row
  });

  // Verifica que la tabla tiene los atributos HTML border="1" y cellpadding="6"
  // getAttribute() - Obtiene el valor de un atributo HTML
  it('should have table with border and cellpadding attributes', () => {
    adoptersSvcSpy.getAll.and.returnValue(of([]));
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
    adoptersSvcSpy.getAll.and.returnValue(of([{ name: 'Test' }]));
    component.ngOnInit();
    expect(component.loading).toBeFalse();
  });

  // Verifica que los datos se asignan correctamente al array adopters
  it('should assign data to adopters array', () => {
    const mockData = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
    adoptersSvcSpy.getAll.and.returnValue(of(mockData));
    component.ngOnInit();
    expect(component.adopters).toEqual(mockData);
  });

  // Verifica que se maneja el error correctamente
  it('should handle error and set error message', () => {
    const mockError = { error: { message: 'Error de red' } };
    adoptersSvcSpy.getAll.and.returnValue(throwError(() => mockError));
    component.ngOnInit();
    expect(component.error).toBe('Error de red');
    expect(component.loading).toBeFalse();
  });

  // Verifica que se muestra mensaje por defecto si el error no tiene mensaje
  it('should set default error message when error has no message', () => {
    adoptersSvcSpy.getAll.and.returnValue(throwError(() => ({})));
    component.ngOnInit();
    expect(component.error).toBe('Error cargando adopters');
  });
});
