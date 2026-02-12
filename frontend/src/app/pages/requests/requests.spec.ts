import { TestBed } from '@angular/core/testing';
import { RequestsComponent } from './requests';
import { AdoptionRequestsService } from '../../services/adoption-requests';
import { of, throwError } from 'rxjs';

describe('RequestsComponent', () => {
  let component: RequestsComponent;
  const svcSpy = jasmine.createSpyObj<AdoptionRequestsService>(
    'AdoptionRequestsService',
    ['getAll', 'create', 'update', 'delete']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsComponent],
      providers: [{ provide: AdoptionRequestsService, useValue: svcSpy }],
    }).compileComponents();

    component = TestBed.createComponent(RequestsComponent).componentInstance;

    svcSpy.getAll.calls.reset();
    svcSpy.create.calls.reset();
    svcSpy.update.calls.reset();
    svcSpy.delete.calls.reset();
  });

  it('loadRequests OK -> llena requests', () => {
    // Arrange
    svcSpy.getAll.and.returnValue(of([{ _id: '1', petId: 'p1', adopterId: 'a1' } as any]));

    // Act
    component.loadRequests();

    // Assert
    expect(component.requests.length).toBe(1);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('loadRequests error -> setea error y loading false', () => {
    // Arrange
    svcSpy.getAll.and.returnValue(throwError(() => ({ error: { message: 'fail' } })));

    // Act
    component.loadRequests();

    // Assert
    expect(component.error).toBe('fail');
    expect(component.loading).toBeFalse();
  });

  it('saveRequest create -> create(), recarga y cierra', () => {
    // Arrange
    component.editingId = null;
    component.showForm = true;

    svcSpy.create.and.returnValue(of({ _id: '1' } as any));
    svcSpy.getAll.and.returnValue(of([]));
    spyOn(component, 'loadRequests').and.callThrough();
    spyOn(component, 'toggleForm').and.callThrough();

    // Act
    component.saveRequest();

    // Assert
    expect(svcSpy.create).toHaveBeenCalledWith(component.formData);
    expect(component.loadRequests).toHaveBeenCalled();
    expect(component.toggleForm).toHaveBeenCalled();
  });

  it('saveRequest update -> update(), recarga y cierra', () => {
    // Arrange
    component.editingId = '1';
    component.showForm = true;

    svcSpy.update.and.returnValue(of({ _id: '1' } as any));
    svcSpy.getAll.and.returnValue(of([]));
    spyOn(component, 'loadRequests').and.callThrough();
    spyOn(component, 'toggleForm').and.callThrough();

    // Act
    component.saveRequest();

    // Assert
    expect(svcSpy.update).toHaveBeenCalledWith('1', component.formData);
    expect(component.loadRequests).toHaveBeenCalled();
    expect(component.toggleForm).toHaveBeenCalled();
  });

  it('deleteRequest confirm=false -> NO delete', () => {
    // Arrange
    spyOn(window, 'confirm').and.returnValue(false);

    // Act
    component.deleteRequest('1');

    // Assert
    expect(svcSpy.delete).not.toHaveBeenCalled();
  });

  it('deleteRequest confirm=true -> delete y recarga', () => {
    // Arrange
    spyOn(window, 'confirm').and.returnValue(true);
    svcSpy.delete.and.returnValue(of({} as any));
    svcSpy.getAll.and.returnValue(of([]));
    spyOn(component, 'loadRequests').and.callThrough();

    // Act
    component.deleteRequest('1');

    // Assert
    expect(svcSpy.delete).toHaveBeenCalledWith('1');
    expect(component.loadRequests).toHaveBeenCalled();
  });
  it('editRequest pone editingId, copia formData y abre el formulario', () => {
  const req = { _id: 'r1', petId: 'p1', adopterId: 'a1', status: 'Pending', comments: 'x' };
  component.editRequest(req as any);
  expect(component.editingId).toBe('r1');
  expect(component.showForm).toBeTrue();
  expect(component.formData.petId).toBe('p1');
});

it('si falla saveRequest create sin message, usa "Error creando request"', () => {
  component.editingId = null;
  svcSpy.create.and.returnValue(throwError(() => ({})));
  component.saveRequest();
  expect(component.error).toBe('Error creando request');
});

it('si falla saveRequest update sin message, usa "Error actualizando request"', () => {
  component.editingId = '1';
  svcSpy.update.and.returnValue(throwError(() => ({})));
  component.saveRequest();
  expect(component.error).toBe('Error actualizando request');
});
it('si confirma eliminar pero el servicio falla, muestra error y no se cae', () => {
  spyOn(window, 'confirm').and.returnValue(true);

  svcSpy.delete.and.returnValue(throwError(() => ({ error: { message: 'delFail' } })));

  component.deleteRequest('1'); // cambia a deleteAdopter/deleteRequest/deleteShelter

  expect(component.error).toBe('delFail'); // o tu fallback
  expect(svcSpy.delete).toHaveBeenCalledWith('1');
});
it('si falla eliminar sin message, usa mensaje por defecto', () => {
  spyOn(window, 'confirm').and.returnValue(true);
  svcSpy.delete.and.returnValue(throwError(() => ({})));

  component.deleteRequest('1');

  expect(component.error).toBe('Error eliminando request');
});

it('toggleForm abre/cierra y al cerrar resetea form', () => {
  component.showForm = false;
  component.formData.petId = 'X';
  component.editingId = '123';

  component.toggleForm();
  expect(component.showForm).toBeTrue();

  component.toggleForm();
  expect(component.showForm).toBeFalse();
  expect(component.editingId).toBeNull();
  expect(component.formData.petId).toBe('');
});

it('si falla loadRequests sin message, usa "Error cargando requests"', () => {
  svcSpy.getAll.and.returnValue(throwError(() => ({})));
  component.loadRequests();
  expect(component.error).toBe('Error cargando requests');
  expect(component.loading).toBeFalse();
});

});
