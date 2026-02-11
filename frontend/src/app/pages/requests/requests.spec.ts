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

  it('AAA: loadRequests OK -> llena requests', () => {
    // Arrange
    svcSpy.getAll.and.returnValue(of([{ _id: '1', petId: 'p1', adopterId: 'a1' } as any]));

    // Act
    component.loadRequests();

    // Assert
    expect(component.requests.length).toBe(1);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('AAA: loadRequests error -> setea error y loading false', () => {
    // Arrange
    svcSpy.getAll.and.returnValue(throwError(() => ({ error: { message: 'fail' } })));

    // Act
    component.loadRequests();

    // Assert
    expect(component.error).toBe('fail');
    expect(component.loading).toBeFalse();
  });

  it('AAA: saveRequest create -> create(), recarga y cierra', () => {
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

  it('AAA: saveRequest update -> update(), recarga y cierra', () => {
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

  it('AAA: deleteRequest confirm=false -> NO delete', () => {
    // Arrange
    spyOn(window, 'confirm').and.returnValue(false);

    // Act
    component.deleteRequest('1');

    // Assert
    expect(svcSpy.delete).not.toHaveBeenCalled();
  });

  it('AAA: deleteRequest confirm=true -> delete y recarga', () => {
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
});
