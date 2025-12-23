import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetsComponent } from './pets';
import { PetsService } from '../../services/pets';
import { of, throwError } from 'rxjs';

describe('PetsComponent - Frontend Tests', () => {
  let component: PetsComponent;
  let fixture: ComponentFixture<PetsComponent>;
  let petsSvcSpy: jasmine.SpyObj<PetsService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PetsService', ['getAll', 'getById', 'create', 'update', 'delete']);
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
    
    expect(headers.length).toBe(7);
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

  // Test toggleForm() - muestra el formulario
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
    component.formData.name = 'Max';
    component.editingId = '123';
    component.toggleForm();
    expect(component.showForm).toBeFalse();
    expect(component.formData.name).toBe('');
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
    component.formData = { name: 'Max', species: 'Dog', breed: 'Labrador', ageYears: 3, sex: 'Male', status: 'Available' };
    component.editingId = '123';
    component.resetForm();
    expect(component.formData).toEqual({ name: '', species: '', breed: '', ageYears: 0, sex: '', status: 'Available' });
    expect(component.editingId).toBeNull();
  });

  // Test savePet() - crear nueva mascota
  // Verifica que savePet() llama al servicio create() cuando editingId es null (modo creación)
  // Métodos usados:
  // - savePet() - Guarda una mascota (crea o actualiza según editingId)
  // - spy.and.returnValue(of({})) - Configura el spy para retornar un observable exitoso
  // - expect().toHaveBeenCalledWith() - Verifica que el método fue llamado con argumentos específicos
  // - of({}) - Crea un observable que emite un objeto vacío
  // Sirve para: Validar que se crea una nueva mascota cuando no hay ID de edición
  it('should create new pet when savePet is called without editingId', () => {
    component.editingId = null;
    component.formData = { name: 'Max', species: 'Dog', breed: 'Labrador', ageYears: 3, sex: 'Male', status: 'Available' };
    petsSvcSpy.create.and.returnValue(of({}));
    petsSvcSpy.getAll.and.returnValue(of([]));
    
    component.savePet();
    
    expect(petsSvcSpy.create).toHaveBeenCalledWith(component.formData);
  });

  // Test savePet() - actualizar mascota existente
  // Verifica que savePet() llama al servicio update() cuando editingId tiene un valor (modo edición)
  // Métodos usados:
  // - savePet() - Guarda una mascota (crea o actualiza según editingId)
  // - spy.and.returnValue(of({})) - Configura el spy para retornar un observable exitoso
  // - expect().toHaveBeenCalledWith() - Verifica que el método fue llamado con ID y datos específicos
  // Sirve para: Validar que se actualiza una mascota existente cuando hay ID de edición
  it('should update existing pet when savePet is called with editingId', () => {
    component.editingId = '123';
    component.formData = { name: 'Max Updated', species: 'Dog', breed: 'Labrador', ageYears: 4, sex: 'Male', status: 'Available' };
    petsSvcSpy.update.and.returnValue(of({}));
    petsSvcSpy.getAll.and.returnValue(of([]));
    
    component.savePet();
    
    expect(petsSvcSpy.update).toHaveBeenCalledWith('123', component.formData);
  });

  // Test savePet() - manejo de error al crear
  // Verifica que savePet() maneja correctamente errores con mensaje al crear una mascota
  // Métodos usados:
  // - savePet() - Guarda una mascota (crea o actualiza según editingId)
  // - throwError() - Crea un observable que emite un error
  // - expect().toBe() - Verifica igualdad estricta (===)
  // Sirve para: Validar que se captura y muestra el mensaje de error del servidor al crear
  it('should handle error when creating pet fails', () => {
    component.editingId = null;
    const mockError = { error: { message: 'Error al crear' } };
    petsSvcSpy.create.and.returnValue(throwError(() => mockError));
    
    component.savePet();
    
    expect(component.error).toBe('Error al crear');
  });

  // Test savePet() - manejo de error sin mensaje al crear
  // Verifica que savePet() usa mensaje por defecto cuando el error no tiene estructura esperada al crear
  // Métodos usados:
  // - savePet() - Guarda una mascota usando operador ?? para mensaje por defecto
  // - throwError() - Crea un observable que emite un error vacío
  // - expect().toBe() - Verifica que se usa el mensaje por defecto
  // Sirve para: Validar que se muestra mensaje genérico cuando el error no tiene formato esperado (branch del ??)
  it('should use default error message when creating pet fails without error message', () => {
    component.editingId = null;
    petsSvcSpy.create.and.returnValue(throwError(() => ({})));
    
    component.savePet();
    
    expect(component.error).toBe('Error creando pet');
  });

  // Test savePet() - manejo de error al actualizar
  // Verifica que savePet() maneja correctamente errores con mensaje al actualizar una mascota
  // Métodos usados:
  // - savePet() - Guarda una mascota (crea o actualiza según editingId)
  // - throwError() - Crea un observable que emite un error
  // - expect().toBe() - Verifica igualdad estricta (===)
  // Sirve para: Validar que se captura y muestra el mensaje de error del servidor al actualizar
  it('should handle error when updating pet fails', () => {
    component.editingId = '123';
    const mockError = { error: { message: 'Error al actualizar' } };
    petsSvcSpy.update.and.returnValue(throwError(() => mockError));
    
    component.savePet();
    
    expect(component.error).toBe('Error al actualizar');
  });

  // Test savePet() - manejo de error sin mensaje al actualizar
  // Verifica que savePet() usa mensaje por defecto cuando el error no tiene estructura esperada al actualizar
  // Métodos usados:
  // - savePet() - Guarda una mascota usando operador ?? para mensaje por defecto
  // - throwError() - Crea un observable que emite un error vacío
  // - expect().toBe() - Verifica que se usa el mensaje por defecto
  // Sirve para: Validar que se muestra mensaje genérico cuando el error no tiene formato esperado (branch del ??)
  it('should use default error message when updating pet fails without error message', () => {
    component.editingId = '123';
    petsSvcSpy.update.and.returnValue(throwError(() => ({})));
    
    component.savePet();
    
    expect(component.error).toBe('Error actualizando pet');
  });

  // Test editPet() - carga datos en el formulario
  // Verifica que editPet() carga los datos de una mascota en el formulario para su edición
  // Métodos usados:
  // - editPet(pet) - Carga los datos de la mascota en formData y establece editingId
  // - expect().toBe() - Verifica igualdad estricta
  // - expect().toBeTrue() - Verifica que el valor sea true
  // Sirve para: Validar que el formulario se prepara correctamente para editar una mascota existente
  it('should load pet data into form when editPet is called', () => {
    const mockPet = { _id: '123', name: 'Max', species: 'Dog', breed: 'Labrador', ageYears: 3, sex: 'Male', status: 'Available' };
    
    component.editPet(mockPet);
    
    expect(component.editingId).toBe('123');
    expect(component.formData.name).toBe('Max');
    expect(component.showForm).toBeTrue();
  });

  // Test deletePet() - elimina mascota con confirmación
  // Verifica que deletePet() elimina una mascota cuando el usuario confirma la acción
  // Métodos usados:
  // - deletePet(id) - Elimina una mascota después de confirmación del usuario
  // - spyOn(window, 'confirm') - Crea un spy sobre window.confirm para simular respuesta del usuario
  // - spy.and.returnValue(true) - Simula que el usuario presiona "Aceptar" en el diálogo
  // - expect().toHaveBeenCalledWith() - Verifica que el método fue llamado con el ID correcto
  // Sirve para: Validar que se elimina la mascota cuando el usuario confirma la acción en el diálogo
  it('should delete pet when deletePet is called and user confirms', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    petsSvcSpy.delete.and.returnValue(of({}));
    petsSvcSpy.getAll.and.returnValue(of([]));
    
    component.deletePet('123');
    
    expect(petsSvcSpy.delete).toHaveBeenCalledWith('123');
  });

  // Test deletePet() - no elimina si el usuario cancela
  // Verifica que deletePet() NO elimina una mascota cuando el usuario cancela la acción
  // Métodos usados:
  // - deletePet(id) - Intenta eliminar pero se detiene por cancelación
  // - spyOn(window, 'confirm').and.returnValue(false) - Simula que el usuario presiona "Cancelar"
  // - expect().not.toHaveBeenCalled() - Verifica que el método NO fue llamado
  // Sirve para: Validar que NO se elimina la mascota cuando el usuario cancela (cubre el branch del if)
  it('should not delete pet when deletePet is called and user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.deletePet('123');
    
    expect(petsSvcSpy.delete).not.toHaveBeenCalled();
  });

  // Test deletePet() - manejo de error
  // Verifica que deletePet() maneja correctamente errores con mensaje al eliminar una mascota
  // Métodos usados:
  // - deletePet(id) - Elimina una mascota
  // - spyOn(window, 'confirm').and.returnValue(true) - Simula confirmación
  // - throwError() - Crea un observable que emite un error
  // - expect().toBe() - Verifica que se captura el mensaje de error
  // Sirve para: Validar que se captura y muestra el mensaje de error del servidor al eliminar
  it('should handle error when deleting pet fails', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const mockError = { error: { message: 'Error al eliminar' } };
    petsSvcSpy.delete.and.returnValue(throwError(() => mockError));
    
    component.deletePet('123');
    
    expect(component.error).toBe('Error al eliminar');
  });

  // Test deletePet() - manejo de error sin mensaje
  // Verifica que deletePet() usa mensaje por defecto cuando el error no tiene estructura esperada
  // Métodos usados:
  // - deletePet(id) - Elimina una mascota usando operador ?? para mensaje por defecto
  // - throwError() - Crea un observable que emite un error vacío
  // - expect().toBe() - Verifica que se usa el mensaje por defecto
  // Sirve para: Validar que se muestra mensaje genérico cuando el error no tiene formato esperado (branch del ??)
  it('should use default error message when deleting pet fails without error message', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    petsSvcSpy.delete.and.returnValue(throwError(() => ({})));
    
    component.deletePet('123');
    
    expect(component.error).toBe('Error eliminando pet');
  });
});
