import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdoptersComponent } from './adopters';
import { AdoptersService } from '../../services/adopters';
import { of, throwError } from 'rxjs';

describe('AdoptersComponent - Frontend Tests', () => {
  let component: AdoptersComponent;
  let fixture: ComponentFixture<AdoptersComponent>;
  let adoptersSvcSpy: jasmine.SpyObj<AdoptersService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AdoptersService', ['getAll', 'getById', 'create', 'update', 'delete']);
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
    expect(headers?.length).toBe(5);
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

  // Test toggleForm() - muestra el formulario
  // Verifica que toggleForm() cambia showForm a true cuando estaba en false
  // Métodos usados:
  // - toggleForm() - Alterna la visibilidad del formulario
  // - expect().toBeTrue() - Verifica que el valor sea true
  // Sirve para: Validar que el formulario se muestra correctamente al presionar el botón "Agregar"
  it('should toggle showForm to true when toggleForm is called', () => {
    component.showForm = false;
    component.toggleForm();
    expect(component.showForm).toBeTrue();
  });

  // Test toggleForm() - oculta el formulario y resetea
  // Verifica que al llamar toggleForm() cuando showForm es true, se oculta el formulario y se limpian los datos
  // Métodos usados:
  // - toggleForm() - Alterna la visibilidad del formulario y resetea datos cuando se oculta
  // - expect().toBeFalse() - Verifica que el valor sea false
  // - expect().toBe('') - Verifica que el string esté vacío
  // - expect().toBeNull() - Verifica que el valor sea null
  // Sirve para: Validar que el formulario se oculta correctamente y limpia el estado de edición
  it('should toggle showForm to false and reset form when toggleForm is called', () => {
    component.showForm = true;
    component.formData.fullName = 'John Doe';
    component.editingId = '123';
    component.toggleForm();
    expect(component.showForm).toBeFalse();
    expect(component.formData.fullName).toBe('');
    expect(component.editingId).toBeNull();
  });

  // Test resetForm() - limpia el formulario
  // Verifica que resetForm() restablece todos los campos del formulario a sus valores iniciales
  // Métodos usados:
  // - resetForm() - Limpia todos los campos del formulario y el ID de edición
  // - expect().toEqual() - Verifica igualdad profunda entre objetos
  // - expect().toBeNull() - Verifica que el valor sea null
  // Sirve para: Asegurar que el formulario vuelve a su estado inicial después de crear/editar
  it('should reset form data when resetForm is called', () => {
    component.formData = { fullName: 'John Doe', nationalId: '123456', phone: '555-1234', email: 'john@example.com' };
    component.editingId = '123';
    component.resetForm();
    expect(component.formData).toEqual({ fullName: '', nationalId: '', phone: '', email: '' });
    expect(component.editingId).toBeNull();
  });

  // Test saveAdopter() - crear nuevo adoptante
  // Verifica que saveAdopter() llama al servicio create() cuando editingId es null (modo creación)
  // Métodos usados:
  // - saveAdopter() - Guarda un adoptante (crea o actualiza según editingId)
  // - spy.and.returnValue(of({})) - Configura el spy para retornar un observable exitoso
  // - expect().toHaveBeenCalledWith() - Verifica que el método fue llamado con argumentos específicos
  // - of({}) - Crea un observable que emite un objeto vacío
  // Sirve para: Validar que se crea un nuevo adoptante cuando no hay ID de edición
  it('should create new adopter when saveAdopter is called without editingId', () => {
    component.editingId = null;
    component.formData = { fullName: 'John Doe', nationalId: '123456', phone: '555-1234', email: 'john@example.com' };
    adoptersSvcSpy.create.and.returnValue(of({}));
    adoptersSvcSpy.getAll.and.returnValue(of([]));
    
    component.saveAdopter();
    
    expect(adoptersSvcSpy.create).toHaveBeenCalledWith(component.formData);
  });

  // Test saveAdopter() - actualizar adoptante existente
  // Verifica que saveAdopter() llama al servicio update() cuando editingId tiene un valor (modo edición)
  // Métodos usados:
  // - saveAdopter() - Guarda un adoptante (crea o actualiza según editingId)
  // - spy.and.returnValue(of({})) - Configura el spy para retornar un observable exitoso
  // - expect().toHaveBeenCalledWith() - Verifica que el método fue llamado con ID y datos específicos
  // Sirve para: Validar que se actualiza un adoptante existente cuando hay ID de edición
  it('should update existing adopter when saveAdopter is called with editingId', () => {
    component.editingId = '123';
    component.formData = { fullName: 'John Updated', nationalId: '123456', phone: '555-9999', email: 'john@example.com' };
    adoptersSvcSpy.update.and.returnValue(of({}));
    adoptersSvcSpy.getAll.and.returnValue(of([]));
    
    component.saveAdopter();
    
    expect(adoptersSvcSpy.update).toHaveBeenCalledWith('123', component.formData);
  });

  // Test saveAdopter() - manejo de error al crear
  // Verifica que saveAdopter() maneja correctamente errores con mensaje al crear un adoptante
  // Métodos usados:
  // - saveAdopter() - Guarda un adoptante
  // - throwError() - Crea un observable que emite un error
  // - expect().toBe() - Verifica igualdad estricta (===)
  // Sirve para: Validar que se captura y muestra el mensaje de error del servidor al crear
  it('should handle error when creating adopter fails', () => {
    component.editingId = null;
    const mockError = { error: { message: 'Error al crear' } };
    adoptersSvcSpy.create.and.returnValue(throwError(() => mockError));
    
    component.saveAdopter();
    
    expect(component.error).toBe('Error al crear');
  });

  // Test saveAdopter() - manejo de error sin mensaje al crear
  it('should use default error message when creating adopter fails without error message', () => {
    component.editingId = null;
    adoptersSvcSpy.create.and.returnValue(throwError(() => ({})));
    
    component.saveAdopter();
    
    expect(component.error).toBe('Error creando adopter');
  });

  // Test saveAdopter() - manejo de error al actualizar
  it('should handle error when updating adopter fails', () => {
    component.editingId = '123';
    const mockError = { error: { message: 'Error al actualizar' } };
    adoptersSvcSpy.update.and.returnValue(throwError(() => mockError));
    
    component.saveAdopter();
    
    expect(component.error).toBe('Error al actualizar');
  });

  // Test saveAdopter() - manejo de error sin mensaje al actualizar
  it('should use default error message when updating adopter fails without error message', () => {
    component.editingId = '123';
    adoptersSvcSpy.update.and.returnValue(throwError(() => ({})));
    
    component.saveAdopter();
    
    expect(component.error).toBe('Error actualizando adopter');
  });

  // Test editAdopter() - carga datos en el formulario
  // Verifica que editAdopter() carga los datos de un adoptante en el formulario para su edición
  // Métodos usados:
  // - editAdopter(adopter) - Carga los datos del adoptante en formData y establece editingId
  // - expect().toBe() - Verifica igualdad estricta
  // - expect().toBeTrue() - Verifica que el valor sea true
  // Sirve para: Validar que el formulario se prepara correctamente para editar un adoptante existente
  it('should load adopter data into form when editAdopter is called', () => {
    const mockAdopter = { _id: '123', fullName: 'John Doe', nationalId: '123456', phone: '555-1234', email: 'john@example.com' };
    
    component.editAdopter(mockAdopter);
    
    expect(component.editingId).toBe('123');
    expect(component.formData.fullName).toBe('John Doe');
    expect(component.showForm).toBeTrue();
  });

  // Test deleteAdopter() - elimina adoptante con confirmación
  // Verifica que deleteAdopter() elimina un adoptante cuando el usuario confirma la acción
  // Métodos usados:
  // - deleteAdopter(id) - Elimina un adoptante después de confirmación del usuario
  // - spyOn(window, 'confirm') - Crea un spy sobre window.confirm para simular respuesta del usuario
  // - spy.and.returnValue(true) - Simula que el usuario presiona "Aceptar" en el diálogo
  // - expect().toHaveBeenCalledWith() - Verifica que el método fue llamado con el ID correcto
  // Sirve para: Validar que se elimina el adoptante cuando el usuario confirma la acción en el diálogo
  it('should delete adopter when deleteAdopter is called and user confirms', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    adoptersSvcSpy.delete.and.returnValue(of({}));
    adoptersSvcSpy.getAll.and.returnValue(of([]));
    
    component.deleteAdopter('123');
    
    expect(adoptersSvcSpy.delete).toHaveBeenCalledWith('123');
  });

  // Test deleteAdopter() - no elimina si el usuario cancela
  // Verifica que deleteAdopter() NO elimina un adoptante cuando el usuario cancela la acción
  // Métodos usados:
  // - deleteAdopter(id) - Intenta eliminar pero se detiene por cancelación
  // - spyOn(window, 'confirm').and.returnValue(false) - Simula que el usuario presiona "Cancelar"
  // - expect().not.toHaveBeenCalled() - Verifica que el método NO fue llamado
  // Sirve para: Validar que NO se elimina el adoptante cuando el usuario cancela (cubre el branch del if)
  it('should not delete adopter when deleteAdopter is called and user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.deleteAdopter('123');
    
    expect(adoptersSvcSpy.delete).not.toHaveBeenCalled();
  });

  // Test deleteAdopter() - manejo de error
  // Verifica que deleteAdopter() maneja correctamente errores con mensaje al eliminar un adoptante
  // Métodos usados:
  // - deleteAdopter(id) - Elimina un adoptante
  // - spyOn(window, 'confirm').and.returnValue(true) - Simula confirmación
  // - throwError() - Crea un observable que emite un error
  // - expect().toBe() - Verifica que se captura el mensaje de error
  // Sirve para: Validar que se captura y muestra el mensaje de error del servidor al eliminar
  it('should handle error when deleting adopter fails', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockError = { error: { message: 'Error al eliminar' } };
    adoptersSvcSpy.delete.and.returnValue(throwError(() => mockError));
    
    component.deleteAdopter('123');
    
    expect(component.error).toBe('Error al eliminar');
  });

  // Test deleteAdopter() - manejo de error sin mensaje
  it('should use default error message when deleting adopter fails without error message', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    adoptersSvcSpy.delete.and.returnValue(throwError(() => ({})));
    
    component.deleteAdopter('123');
    
    expect(component.error).toBe('Error eliminando adopter');
  });
});
