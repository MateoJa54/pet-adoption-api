import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestsComponent } from './requests';
import { AdoptionRequestsService } from '../../services/adoption-requests';
import { of, throwError } from 'rxjs';

describe('RequestsComponent - Frontend Tests', () => {
  let component: RequestsComponent;
  let fixture: ComponentFixture<RequestsComponent>;
  let reqSvcSpy: jasmine.SpyObj<AdoptionRequestsService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AdoptionRequestsService', ['getAll', 'getById', 'create', 'update', 'delete']);
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
    
    expect(headers.length).toBe(5);
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

  // Test toggleForm() - muestra el formulario
  // M\u00e9todo: toggleForm() - Alterna la visibilidad del formulario de solicitudes
  // Verifica: Que showForm cambia a true cuando estaba en false
  // Sirve para: Validar que el formulario se muestra al presionar \"Agregar Request\"
  it('should toggle showForm to true when toggleForm is called', () => {
    component.showForm = false;
    component.toggleForm();
    expect(component.showForm).toBeTrue();
  });

  // Test toggleForm() - oculta el formulario y resetea
  // M\u00e9todo: toggleForm() - Alterna visibilidad y resetea datos de solicitud
  // Verifica: Que showForm cambia a false y se limpian formData y editingId
  // Sirve para: Validar que el formulario se oculta correctamente y limpia el estado
  it('should toggle showForm to false and reset form when toggleForm is called', () => {
    component.showForm = true;
    component.formData.petId = '123';
    component.editingId = '456';
    component.toggleForm();
    expect(component.showForm).toBeFalse();
    expect(component.formData.petId).toBe('');
    expect(component.editingId).toBeNull();
  });

  // Test resetForm() - limpia el formulario
  // M\u00e9todo: resetForm() - Limpia campos del formulario de solicitudes
  // Verifica: Que todos los campos vuelven a valores iniciales (petId='', adopterId='', status='Pending', comments='')
  // Sirve para: Asegurar que el formulario se reinicia correctamente despu\u00e9s de operaciones
  it('should reset form data when resetForm is called', () => {
    component.formData = { petId: '123', adopterId: '456', status: 'Approved', comments: 'Test comment' };
    component.editingId = '789';
    component.resetForm();
    expect(component.formData).toEqual({ petId: '', adopterId: '', status: 'Pending', comments: '' });
    expect(component.editingId).toBeNull();
  });

  // Test saveRequest() - crear nueva solicitud
  // Método: saveRequest() - Crea una nueva solicitud de adopción llamando a create()
  // Verifica: Que create() es llamado con formData cuando editingId es null
  // Sirve para: Validar la creación de nuevas solicitudes de adopción
  it('should create new request when saveRequest is called without editingId', () => {
    component.editingId = null;
    component.formData = { petId: '123', adopterId: '456', status: 'Pending', comments: 'New request' };
    reqSvcSpy.create.and.returnValue(of({}));
    reqSvcSpy.getAll.and.returnValue(of([]));
    
    component.saveRequest();
    
    expect(reqSvcSpy.create).toHaveBeenCalledWith(component.formData);
  });

  // Test saveRequest() - actualizar solicitud existente
  // Método: saveRequest() - Actualiza una solicitud existente llamando a update()
  // Verifica: Que update() es llamado con ID y formData cuando editingId existe
  // Sirve para: Validar la actualización de solicitudes existentes (ej. cambiar status)
  it('should update existing request when saveRequest is called with editingId', () => {
    component.editingId = '789';
    component.formData = { petId: '123', adopterId: '456', status: 'Approved', comments: 'Updated request' };
    reqSvcSpy.update.and.returnValue(of({}));
    reqSvcSpy.getAll.and.returnValue(of([]));
    
    component.saveRequest();
    
    expect(reqSvcSpy.update).toHaveBeenCalledWith('789', component.formData);
  });

  // Test saveRequest() - manejo de error al crear
  it('should handle error when creating request fails', () => {
    component.editingId = null;
    const mockError = { error: { message: 'Error al crear' } };
    reqSvcSpy.create.and.returnValue(throwError(() => mockError));
    
    component.saveRequest();
    
    expect(component.error).toBe('Error al crear');
  });

  // Test saveRequest() - manejo de error sin mensaje al crear
  it('should use default error message when creating request fails without error message', () => {
    component.editingId = null;
    reqSvcSpy.create.and.returnValue(throwError(() => ({})));
    
    component.saveRequest();
    
    expect(component.error).toBe('Error creando request');
  });

  // Test saveRequest() - manejo de error al actualizar
  it('should handle error when updating request fails', () => {
    component.editingId = '789';
    const mockError = { error: { message: 'Error al actualizar' } };
    reqSvcSpy.update.and.returnValue(throwError(() => mockError));
    
    component.saveRequest();
    
    expect(component.error).toBe('Error al actualizar');
  });

  // Test saveRequest() - manejo de error sin mensaje al actualizar
  // Test editRequest() - carga datos en el formulario
  // M\u00e9todo: editRequest(request) - Carga datos de la solicitud en formData y establece editingId
  // Verifica: Que editingId se establece, formData se llena y showForm es true
  // Sirve para: Validar que el formulario se prepara correctamente para editar una solicitud
  it('should load request data into form when editRequest is called', () => {
    const mockRequest = { _id: '789', petId: '123', adopterId: '456', status: 'Pending', comments: 'Test comment' };
    
    component.editRequest(mockRequest);
    
    expect(component.editingId).toBe('789');
    expect(component.formData.petId).toBe('123');
    expect(component.showForm).toBeTrue();
  });

  // Test deleteRequest() - elimina solicitud con confirmación
  // Método: deleteRequest(id) - Elimina una solicitud después de confirmación
  // Verifica: Que delete() es llamado con el ID correcto cuando usuario confirma
  // Método de testing: spyOn(window, 'confirm').and.returnValue(true) - Simula confirmación
  // Sirve para: Validar que se elimina la solicitud cuando el usuario confirma
  it('should delete request when deleteRequest is called and user confirms', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    reqSvcSpy.delete.and.returnValue(of({}));
    reqSvcSpy.getAll.and.returnValue(of([]));
    
    component.deleteRequest('789');
    
    expect(reqSvcSpy.delete).toHaveBeenCalledWith('789');
  });

  // Test deleteRequest() - elimina solicitud con confirmación
  // Método: deleteRequest(id) - Elimina una solicitud después de confirmación
  // Verifica: Que delete() es llamado con el ID correcto cuando usuario confirma
  // Método de testing: spyOn(window, 'confirm').and.returnValue(true) - Simula confirmación
  // Sirve para: Validar que se elimina la solicitud cuando el usuario confirma
  it('should delete request when deleteRequest is called and user confirms', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    reqSvcSpy.delete.and.returnValue(of({}));
    reqSvcSpy.getAll.and.returnValue(of([]));
    
    component.deleteRequest('789');
    
    expect(reqSvcSpy.delete).toHaveBeenCalledWith('789');
  });

  // Test deleteRequest() - no elimina si el usuario cancela
  // Método: deleteRequest(id) - Intenta eliminar pero se detiene por cancelación
  // Verifica: Que delete() NO es llamado cuando usuario cancela
  // Método de testing: spyOn(window, 'confirm').and.returnValue(false) - Simula cancelación
  // Sirve para: Validar que NO se elimina cuando usuario cancela (cubre branch del if)
// Test deleteRequest() - no elimina si el usuario cancela
it('should not delete request when deleteRequest is called and user cancels', () => {
  spyOn(window, 'confirm').and.returnValue(false);

  component.deleteRequest('789');

  expect(reqSvcSpy.delete).not.toHaveBeenCalled();
});


  // Test deleteRequest() - manejo de error
  it('should handle error when deleting request fails', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockError = { error: { message: 'Error al eliminar' } };
    reqSvcSpy.delete.and.returnValue(throwError(() => mockError));
    
    component.deleteRequest('789');
    
    expect(component.error).toBe('Error al eliminar');
  });

  // Test deleteRequest() - manejo de error sin mensaje
  it('should use default error message when deleting request fails without error message', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    reqSvcSpy.delete.and.returnValue(throwError(() => ({})));
    
    component.deleteRequest('789');
    
    expect(component.error).toBe('Error eliminando request');
  });
});
