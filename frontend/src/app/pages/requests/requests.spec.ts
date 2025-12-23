import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestsComponent } from './requests';
import { AdoptionRequestsService } from '../../services/adoption-requests';
import { of, throwError } from 'rxjs';

describe('RequestsComponent - Frontend Tests', () => {
  let component: RequestsComponent;
  let fixture: ComponentFixture<RequestsComponent>;
  let reqSvcSpy: jasmine.SpyObj<AdoptionRequestsService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AdoptionRequestsService', ['getAll']);
    spy.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [RequestsComponent],
      providers: [
        { provide: AdoptionRequestsService, useValue: spy }
      ]
    })
    .compileComponents();

    reqSvcSpy = TestBed.inject(AdoptionRequestsService) as jasmine.SpyObj<AdoptionRequestsService>;
    fixture = TestBed.createComponent(RequestsComponent);
    component = fixture.componentInstance;
  });

  // Verifica que el componente se crea correctamente
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Verifica que se muestran tanto el párrafo "requests works!" como el título "Adoption Requests"
  // querySelector('p') - Busca el primer elemento párrafo
  // querySelector('h2') - Busca el primer elemento h2
  it('should display both paragraph and title', () => {
    reqSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const p = compiled.querySelector('p');
    const h2 = compiled.querySelector('h2');
    
    expect(p?.textContent).toBe('requests works!');
    expect(h2?.textContent).toBe('Adoption Requests');
  });

  // Verifica que la tabla se renderiza con 4 headers correctos (Pet ID, Adopter ID, Status, Comments)
  // querySelectorAll('th') - Busca todos los elementos th (headers de tabla)
  // expect().toBe() - Verifica igualdad estricta
  it('should display table with correct headers', () => {
    reqSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const headers = compiled.querySelectorAll('th');
    
    expect(headers.length).toBe(4);
    expect(headers[0].textContent).toBe('Pet ID');
    expect(headers[1].textContent).toBe('Adopter ID');
    expect(headers[2].textContent).toBe('Status');
    expect(headers[3].textContent).toBe('Comments');
  });

  // Verifica que los datos de las solicitudes se muestran correctamente en las filas de la tabla
  // of(mockRequests) - Crea un observable que emite el array de solicitudes mock
  // rows[1] - Accede a la segunda fila (índice 1, la primera es el header)
  // .trim() - Elimina espacios en blanco al inicio y final
  it('should display request data in table rows', () => {
    const mockRequests = [
      { petId: '123', adopterId: '456', status: 'Pending', comments: 'Interested' },
      { petId: '789', adopterId: '012', status: 'Approved', comments: 'Good match' }
    ];
    
    reqSvcSpy.getAll.and.returnValue(of(mockRequests));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('table tr');
    
    expect(rows.length).toBe(3); // 1 header + 2 data rows
    
    const firstDataRow = rows[1].querySelectorAll('td');
    expect(firstDataRow[0].textContent?.trim()).toBe('123');
    expect(firstDataRow[1].textContent?.trim()).toBe('456');
    expect(firstDataRow[2].textContent?.trim()).toBe('Pending');
    expect(firstDataRow[3].textContent?.trim()).toBe('Interested');
  });

  // Verifica que cuando no hay datos, la tabla solo muestra la fila de headers
  // expect().toBe(1) - Verifica que solo existe 1 fila
  it('should display empty table body when requests array is empty', () => {
    reqSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const rows = compiled.querySelectorAll('table tr');
    expect(rows.length).toBe(1); // Only header row
  });

  // Verifica que se pueden renderizar múltiples solicitudes correctamente (2 filas de datos)
  // expect().toBe(3) - Verifica 1 header + 2 filas de datos
  it('should render multiple requests correctly', () => {
    const mockRequests = [
      { petId: '1', adopterId: '10', status: 'Pending', comments: 'Comment 1' },
      { petId: '2', adopterId: '20', status: 'Approved', comments: 'Comment 2' },
      { petId: '3', adopterId: '30', status: 'Rejected', comments: 'Comment 3' }
    ];
    
    reqSvcSpy.getAll.and.returnValue(of(mockRequests));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const dataRows = compiled.querySelectorAll('table tr');
    
    expect(dataRows.length).toBe(4); // 1 header + 3 data rows
  });

  // Verifica que la tabla tiene los atributos HTML border="1" y cellpadding="6"
  // getAttribute() - Obtiene el valor de un atributo HTML del elemento
  it('should have table with border and cellpadding attributes', () => {
    reqSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const table = compiled.querySelector('table');
    expect(table?.getAttribute('border')).toBe('1');
    expect(table?.getAttribute('cellpadding')).toBe('6');
  });

  // Verifica que todo el contenido de texto del template está presente
  // textContent - Obtiene todo el texto contenido en el elemento
  // .includes() - Verifica si una cadena contiene otra cadena
  it('should display all text content from template', () => {
    reqSvcSpy.getAll.and.returnValue(of([]));
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const textContent = compiled.textContent;
    
    expect(textContent).toContain('requests works!');
    expect(textContent).toContain('Adoption Requests');
  });

  // Tests de lógica para aumentar cobertura

  // Verifica que loading es true inicialmente
  it('should set loading to true initially', () => {
    expect(component.loading).toBeTrue();
  });

  // Verifica que loading cambia a false después de cargar datos exitosamente
  it('should set loading to false after successful data load', () => {
    reqSvcSpy.getAll.and.returnValue(of([{ petId: '1' }]));
    component.ngOnInit();
    expect(component.loading).toBeFalse();
  });

  // Verifica que los datos se asignan correctamente al array requests
  it('should assign data to requests array', () => {
    const mockData = [{ petId: '1', adopterId: '10' }, { petId: '2', adopterId: '20' }];
    reqSvcSpy.getAll.and.returnValue(of(mockData));
    component.ngOnInit();
    expect(component.requests).toEqual(mockData);
  });

  // Verifica que se maneja el error correctamente
  it('should handle error and set error message', () => {
    const mockError = { error: { message: 'Error de red' } };
    reqSvcSpy.getAll.and.returnValue(throwError(() => mockError));
    component.ngOnInit();
    expect(component.error).toBe('Error de red');
    expect(component.loading).toBeFalse();
  });

  // Verifica que se muestra mensaje por defecto si el error no tiene mensaje
  it('should set default error message when error has no message', () => {
    reqSvcSpy.getAll.and.returnValue(throwError(() => ({})));
    component.ngOnInit();
    expect(component.error).toBe('Error cargando requests');
  });
});
