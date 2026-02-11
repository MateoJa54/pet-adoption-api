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

  it('AAA: loadShelters OK -> llena shelters y loading false', () => {
    // Arrange
    svcSpy.getAll.and.returnValue(of([{ _id: '1', name: 'S1' } as any]));

    // Act
    component.loadShelters();

    // Assert
    expect(svcSpy.getAll).toHaveBeenCalled();
    expect(component.shelters.length).toBe(1);
    expect(component.loading).toBeFalse();
  });

  it('AAA: loadShelters error -> usa mensaje fijo', () => {
    // Arrange
    svcSpy.getAll.and.returnValue(throwError(() => ({})));

    // Act
    component.loadShelters();

    // Assert
    expect(component.error).toBe('Error cargando shelters');
    expect(component.loading).toBeFalse();
  });

  it('AAA: saveShelter create -> create(), recarga y cierra', () => {
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

  it('AAA: saveShelter update -> update(), recarga y cierra', () => {
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

  it('AAA: deleteShelter confirm=true -> delete y recarga', () => {
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
});
