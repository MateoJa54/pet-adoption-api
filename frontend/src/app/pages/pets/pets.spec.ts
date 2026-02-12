import { TestBed } from '@angular/core/testing';
import { PetsComponent } from './pets';
import { PetsService } from '../../services/pets';
import { of, throwError } from 'rxjs';

describe('PetsComponent', () => {
  let component: PetsComponent;
  const svcSpy = jasmine.createSpyObj<PetsService>('PetsService', ['getAll', 'create', 'update', 'delete']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsComponent],
      providers: [{ provide: PetsService, useValue: svcSpy }],
    }).compileComponents();

    component = TestBed.createComponent(PetsComponent).componentInstance;

    svcSpy.getAll.calls.reset();
    svcSpy.create.calls.reset();
    svcSpy.update.calls.reset();
    svcSpy.delete.calls.reset();
  });

  it('Carga la lista de mascotas', () => {
    // Arrange
    const data = [{ _id: '1', name: 'Luna' }];
    svcSpy.getAll.and.returnValue(of(data));

    // Act
    component.loadPets();

    // Assert
    expect(component.pets).toEqual(data);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('Mensaje de error cuando falla la carga de mascotas', () => {
    // Arrange
    svcSpy.getAll.and.returnValue(throwError(() => ({ error: { message: 'fail' } })));

    // Act
    component.loadPets();

    // Assert
    expect(component.error).toBe('fail');
    expect(component.loading).toBeFalse();
  });

  it('savePet create -> create(), recarga y cierra', () => {
    // Arrange
    component.editingId = null;
    component.showForm = true;

    svcSpy.create.and.returnValue(of({ _id: '1' } as any));
    svcSpy.getAll.and.returnValue(of([]));
    spyOn(component, 'loadPets').and.callThrough();
    spyOn(component, 'toggleForm').and.callThrough();

    // Act
    component.savePet();

    // Assert
    expect(svcSpy.create).toHaveBeenCalledWith(component.formData);
    expect(component.loadPets).toHaveBeenCalled();
    expect(component.toggleForm).toHaveBeenCalled();
  });

  it('savePet update -> update(), recarga y cierra', () => {
    // Arrange
    component.editingId = '1';
    component.showForm = true;

    svcSpy.update.and.returnValue(of({ _id: '1' } as any));
    svcSpy.getAll.and.returnValue(of([]));
    spyOn(component, 'loadPets').and.callThrough();
    spyOn(component, 'toggleForm').and.callThrough();

    // Act
    component.savePet();

    // Assert
    expect(svcSpy.update).toHaveBeenCalledWith('1', component.formData);
    expect(component.loadPets).toHaveBeenCalled();
    expect(component.toggleForm).toHaveBeenCalled();
  });

  it('editPet -> setea editingId y abre form', () => {
    // Arrange
    const pet = { _id: 'p1', name: 'Luna', status: 'Available' };

    // Act
    component.editPet(pet);

    // Assert
    expect(component.editingId).toBe('p1');
    expect(component.showForm).toBeTrue();
    expect(component.formData.name).toBe('Luna');
  });

  it('deletePet confirm=true -> llama delete y recarga', () => {
    // Arrange
    spyOn(window, 'confirm').and.returnValue(true);
    svcSpy.delete.and.returnValue(of({} as any));
    svcSpy.getAll.and.returnValue(of([]));
    spyOn(component, 'loadPets').and.callThrough();

    // Act
    component.deletePet('p1');

    // Assert
    expect(svcSpy.delete).toHaveBeenCalledWith('p1');
    expect(component.loadPets).toHaveBeenCalled();
  });

  it('deletePet confirm=false -> NO llama delete', () => {
    // Arrange
    spyOn(window, 'confirm').and.returnValue(false);

    // Act
    component.deletePet('p1');

    // Assert
    expect(svcSpy.delete).not.toHaveBeenCalled();
  });
  it('si falla loadPets sin message, usa "Error cargando pets"', () => {
  svcSpy.getAll.and.returnValue(throwError(() => ({})));
  component.loadPets();
  expect(component.error).toBe('Error cargando pets');
  expect(component.loading).toBeFalse();
});

it('si falla create al guardar, muestra message del error', () => {
  component.editingId = null;
  svcSpy.create.and.returnValue(throwError(() => ({ error: { message: 'boom' } })));

  component.savePet();

  expect(component.error).toBe('boom');
});

it('si falla create sin message, usa "Error creando pet"', () => {
  component.editingId = null;
  svcSpy.create.and.returnValue(throwError(() => ({})));

  component.savePet();

  expect(component.error).toBe('Error creando pet');
});

it('si falla update, muestra message del error', () => {
  component.editingId = '1';
  svcSpy.update.and.returnValue(throwError(() => ({ error: { message: 'upfail' } })));

  component.savePet();

  expect(component.error).toBe('upfail');
});

it('si falla update sin message, usa "Error actualizando pet"', () => {
  component.editingId = '1';
  svcSpy.update.and.returnValue(throwError(() => ({})));

  component.savePet();

  expect(component.error).toBe('Error actualizando pet');
});
it('si confirma eliminar pero el servicio falla, muestra error y no se cae', () => {
  spyOn(window, 'confirm').and.returnValue(true);

  svcSpy.delete.and.returnValue(throwError(() => ({ error: { message: 'delFail' } })));

  component.deletePet('deletePet');

  expect(component.error).toBe('delFail');
  expect(svcSpy.delete).toHaveBeenCalledWith('deletePet');
});
it('si falla eliminar sin message, usa mensaje por defecto', () => {
  spyOn(window, 'confirm').and.returnValue(true);
  svcSpy.delete.and.returnValue(throwError(() => ({})));

  component.deletePet('p1');

  expect(component.error).toBe('Error eliminando pet');
});
it('si falla crear con message, muestra el message', () => {
  component.editingId = null;
  svcSpy.create.and.returnValue(throwError(() => ({ error: { message: 'createFail' } })));

  component.savePet();

  expect(component.error).toBe('createFail');
});

it('si falla actualizar con message, muestra el message', () => {
  component.editingId = '1';
  svcSpy.update.and.returnValue(throwError(() => ({ error: { message: 'updateFail' } })));

  component.savePet();

  expect(component.error).toBe('updateFail');
});
it('si falla crear con message, muestra el message', () => {
  component.editingId = null;
  svcSpy.create.and.returnValue(throwError(() => ({ error: { message: 'createFail' } })));

  component.savePet();

  expect(component.error).toBe('createFail');
});
it('si falla actualizar con message, muestra el message', () => {
  component.editingId = '1';
  svcSpy.update.and.returnValue(throwError(() => ({ error: { message: 'updateFail' } })));

  component.savePet();

  expect(component.error).toBe('updateFail');
});

});
