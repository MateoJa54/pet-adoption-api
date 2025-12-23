import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SheltersComponent } from './shelters';
import { SheltersService } from '../../services/shelters';
import { of, throwError } from 'rxjs';

describe('SheltersComponent - Frontend Tests', () => {
  let component: SheltersComponent;
  let fixture: ComponentFixture<SheltersComponent>;
  let sheltersSvcSpy: jasmine.SpyObj<SheltersService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SheltersService', ['getAll', 'getById', 'create', 'update', 'delete']);
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
    
    expect(headers.length).toBe(5);
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
    expect(headerRow?.querySelectorAll('th').length).toBe(5);
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

  // Test toggleForm() - muestra el formulario
  // M\u00e9todo: toggleForm() - Alterna la visibilidad del formulario
  // Verifica: Que showForm cambia a true cuando estaba en false
  // Sirve para: Validar que el formulario se muestra al presionar \"Agregar Shelter\"
  it('should toggle showForm to true when toggleForm is called', () => {
    component.showForm = false;
    component.toggleForm();
    expect(component.showForm).toBeTrue();
  });

  // Test toggleForm() - oculta el formulario y resetea
  // M\u00e9todo: toggleForm() - Alterna visibilidad y resetea datos
  // Verifica: Que showForm cambia a false y se limpian formData y editingId
  // Sirve para: Validar que el formulario se oculta y limpia el estado de edici\u00f3n
  it('should toggle showForm to false and reset form when toggleForm is called', () => {
    component.showForm = true;
    component.formData.name = 'Shelter ABC';
    component.editingId = '123';
    component.toggleForm();
    expect(component.showForm).toBeFalse();
    expect(component.formData.name).toBe('');
    expect(component.editingId).toBeNull();
  });

  // Test resetForm() - limpia el formulario
  // M\u00e9todo: resetForm() - Limpia campos del formulario
  // Verifica: Que todos los campos vuelven a sus valores iniciales
  // Sirve para: Asegurar que el formulario se reinicia despu\u00e9s de crear/editar
  it('should reset form data when resetForm is called', () => {
    component.formData = { name: 'Shelter ABC', address: '123 Main St', phone: '555-1234', email: 'shelter@example.com' };
    component.editingId = '123';
    component.resetForm();
    expect(component.formData).toEqual({ name: '', address: '', phone: '', email: '' });
    expect(component.editingId).toBeNull();
  });

  // Test saveShelter() - crear nuevo refugio
  // M\u00e9todo: saveShelter() - Crea un nuevo refugio llamando a create()
  // Verifica: Que create() es llamado con formData cuando editingId es null
  // Sirve para: Validar la creaci\u00f3n de nuevos refugios sin ID de edici\u00f3n
  it('should create new shelter when saveShelter is called without editingId', () => {
    component.editingId = null;
    component.formData = { name: 'Shelter ABC', address: '123 Main St', phone: '555-1234', email: 'shelter@example.com' };
    sheltersSvcSpy.create.and.returnValue(of({}));
    sheltersSvcSpy.getAll.and.returnValue(of([]));
    
    component.saveShelter();
    
    expect(sheltersSvcSpy.create).toHaveBeenCalledWith(component.formData);
  });

  // Test saveShelter() - actualizar refugio existente
  // M\u00e9todo: saveShelter() - Actualiza un refugio existente llamando a update()
  // Verifica: Que update() es llamado con ID y formData cuando editingId existe
  // Sirve para: Validar la actualizaci\u00f3n de refugios existentes
  it('should update existing shelter when saveShelter is called with editingId', () => {
    component.editingId = '123';
    component.formData = { name: 'Shelter Updated', address: '456 Oak Ave', phone: '555-9999', email: 'shelter@example.com' };
    sheltersSvcSpy.update.and.returnValue(of({}));
    sheltersSvcSpy.getAll.and.returnValue(of([]));
    
    component.saveShelter();
    
    expect(sheltersSvcSpy.update).toHaveBeenCalledWith('123', component.formData);
  });

  // Test saveShelter() - manejo de error al crear
  it('should handle error when creating shelter fails', () => {
    component.editingId = null;
    const mockError = { error: { message: 'Error al crear' } };
    sheltersSvcSpy.create.and.returnValue(throwError(() => mockError));
    
    component.saveShelter();
    
    expect(component.error).toBe('Error al crear');
  });

  // Test saveShelter() - manejo de error sin mensaje al crear
  it('should use default error message when creating shelter fails without error message', () => {
    component.editingId = null;
    sheltersSvcSpy.create.and.returnValue(throwError(() => ({})));
    
    component.saveShelter();
    
    expect(component.error).toBe('Error creando shelter');
  });

  // Test saveShelter() - manejo de error al actualizar
  it('should handle error when updating shelter fails', () => {
    component.editingId = '123';
    const mockError = { error: { message: 'Error al actualizar' } };
    sheltersSvcSpy.update.and.returnValue(throwError(() => mockError));
    
    component.saveShelter();
    
    expect(component.error).toBe('Error al actualizar');
  });

  // Test saveShelter() - manejo de error sin mensaje al actualizar
  it('should use default error message when updating shelter fails without error message', () => {
    component.editingId = '123';
    sheltersSvcSpy.update.and.returnValue(throwError(() => ({})));
    
    component.saveShelter();
    
    expect(component.error).toBe('Error actualizando shelter');
  });

  // Test editShelter() - carga datos en el formulario
  it('should load shelter data into form when editShelter is called', () => {
    const mockShelter = { _id: '123', name: 'Shelter ABC', address: '123 Main St', phone: '555-1234', email: 'shelter@example.com' };
    
    component.editShelter(mockShelter);
    
    expect(component.editingId).toBe('123');
    expect(component.formData.name).toBe('Shelter ABC');
    expect(component.showForm).toBeTrue();
  });

  // Test deleteShelter() - elimina refugio con confirmación
  it('should delete shelter when deleteShelter is called and user confirms', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    sheltersSvcSpy.delete.and.returnValue(of({}));
    sheltersSvcSpy.getAll.and.returnValue(of([]));
    
    component.deleteShelter('123');
    
    expect(sheltersSvcSpy.delete).toHaveBeenCalledWith('123');
  });

  // Test deleteShelter() - no elimina si el usuario cancela
  it('should not delete shelter when deleteShelter is called and user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.deleteShelter('123');
    
    expect(sheltersSvcSpy.delete).not.toHaveBeenCalled();
  });

  // Test deleteShelter() - manejo de error
  it('should handle error when deleting shelter fails', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockError = { error: { message: 'Error al eliminar' } };
    sheltersSvcSpy.delete.and.returnValue(throwError(() => mockError));
    
    component.deleteShelter('123');
    
    expect(component.error).toBe('Error al eliminar');
  });

  // Test deleteShelter() - manejo de error sin mensaje
  it('should use default error message when deleting shelter fails without error message', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    sheltersSvcSpy.delete.and.returnValue(throwError(() => ({})));
    
    component.deleteShelter('123');
    
    expect(component.error).toBe('Error eliminando shelter');
  });
});
