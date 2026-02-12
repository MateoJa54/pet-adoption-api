import { TestBed } from '@angular/core/testing';
import { SheltersComponent } from './shelters';
import { SheltersService } from '../../services/shelters';
import { of, throwError } from 'rxjs';

describe('SheltersComponent', () => {
  let component: SheltersComponent;
  const svcSpy = jasmine.createSpyObj<SheltersService>('SheltersService', ['getAll', 'create', 'update', 'delete']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheltersComponent],
      providers: [{ provide: SheltersService, useValue: svcSpy }],
    }).compileComponents();

    component = TestBed.createComponent(SheltersComponent).componentInstance;

    svcSpy.getAll.calls.reset();
    svcSpy.create.calls.reset();
    svcSpy.update.calls.reset();
    svcSpy.delete.calls.reset();
  });

  it('loadShelters OK -> llena shelters y loading false', () => {
    // Arrange
    svcSpy.getAll.and.returnValue(of([{ _id: '1', name: 'S1' } as any]));

    // Act
    component.loadShelters();

    // Assert
    expect(svcSpy.getAll).toHaveBeenCalled();
    expect(component.shelters.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('loadShelters error -> usa mensaje fijo', () => {
    // Arrange
    svcSpy.getAll.and.returnValue(throwError(() => ({})));

    // Act
    component.loadShelters();

    // Assert
    expect(component.error).toBe('Error cargando shelters');
    expect(component.loading).toBeFalse();
  });

  it('saveShelter create -> create(), recarga y cierra', () => {
    // Arrange
    component.editingId = null;
    component.showForm = true;

    svcSpy.create.and.returnValue(of({ _id: '1' } as any));
    svcSpy.getAll.and.returnValue(of([]));
    spyOn(component, 'loadShelters').and.callThrough();
    spyOn(component, 'toggleForm').and.callThrough();

    // Act
    component.saveShelter();

    // Assert
    expect(svcSpy.create).toHaveBeenCalledWith(component.formData);
    expect(component.loadShelters).toHaveBeenCalled();
    expect(component.toggleForm).toHaveBeenCalled();
  });

  it('saveShelter update -> update(), recarga y cierra', () => {
    // Arrange
    component.editingId = '1';
    component.showForm = true;

    svcSpy.update.and.returnValue(of({ _id: '1' } as any));
    svcSpy.getAll.and.returnValue(of([]));
    spyOn(component, 'loadShelters').and.callThrough();
    spyOn(component, 'toggleForm').and.callThrough();

    // Act
    component.saveShelter();

    // Assert
    expect(svcSpy.update).toHaveBeenCalledWith('1', component.formData);
    expect(component.loadShelters).toHaveBeenCalled();
    expect(component.toggleForm).toHaveBeenCalled();
  });

  it('deleteShelter confirm=true -> delete y recarga', () => {
    // Arrange
    spyOn(window, 'confirm').and.returnValue(true);
    svcSpy.delete.and.returnValue(of({} as any));
    svcSpy.getAll.and.returnValue(of([]));
    spyOn(component, 'loadShelters').and.callThrough();

    // Act
    component.deleteShelter('1');

    // Assert
    expect(svcSpy.delete).toHaveBeenCalledWith('1');
    expect(component.loadShelters).toHaveBeenCalled();
  });
  it('editShelter pone editingId, copia formData y abre formulario', () => {
  const s = { _id: '1', name: 'S', address: 'A', phone: '9', email: 'e@mail.com' };
  component.editShelter(s as any);
  expect(component.editingId).toBe('1');
  expect(component.showForm).toBeTrue();
  expect(component.formData.name).toBe('S');
});

it('deleteShelter con confirm=false NO llama delete', () => {
  spyOn(window, 'confirm').and.returnValue(false);
  component.deleteShelter('1');
  expect(svcSpy.delete).not.toHaveBeenCalled();
});

it('si falla create sin message, usa "Error creando shelter"', () => {
  component.editingId = null;
  svcSpy.create.and.returnValue(throwError(() => ({})));
  component.saveShelter();
  expect(component.error).toBe('Error creando shelter');
});

it('si falla update sin message, usa "Error actualizando shelter"', () => {
  component.editingId = '1';
  svcSpy.update.and.returnValue(throwError(() => ({})));
  component.saveShelter();
  expect(component.error).toBe('Error actualizando shelter');
});
it('si confirma eliminar pero el servicio falla, muestra error y no se cae', () => {
  spyOn(window, 'confirm').and.returnValue(true);

  svcSpy.delete.and.returnValue(throwError(() => ({ error: { message: 'delFail' } })));

  component.deleteShelter('1'); 

  expect(component.error).toBe('delFail'); 
  expect(svcSpy.delete).toHaveBeenCalledWith('1');
});
it('si falla eliminar sin message, usa mensaje por defecto', () => {
  spyOn(window, 'confirm').and.returnValue(true);
  svcSpy.delete.and.returnValue(throwError(() => ({})));

  component.deleteShelter('1');

  expect(component.error).toBe('Error eliminando shelter'); 
});

});
