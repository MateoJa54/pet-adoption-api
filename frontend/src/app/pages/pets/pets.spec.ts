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

  it('AAA: loadPets OK -> llena pets', () => {
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

  it('AAA: loadPets error -> setea error', () => {
    // Arrange
    svcSpy.getAll.and.returnValue(throwError(() => ({ error: { message: 'fail' } })));

    // Act
    component.loadPets();

    // Assert
    expect(component.error).toBe('fail');
    expect(component.loading).toBeFalse();
  });

  it('AAA: savePet create -> create(), recarga y cierra', () => {
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

  it('AAA: savePet update -> update(), recarga y cierra', () => {
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

  it('AAA: editPet -> setea editingId y abre form', () => {
    // Arrange
    const pet = { _id: 'p1', name: 'Luna', status: 'Available' };

    // Act
    component.editPet(pet);

    // Assert
    expect(component.editingId).toBe('p1');
    expect(component.showForm).toBeTrue();
    expect(component.formData.name).toBe('Luna');
  });

  it('AAA: deletePet confirm=true -> llama delete y recarga', () => {
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

  it('AAA: deletePet confirm=false -> NO llama delete', () => {
    // Arrange
    spyOn(window, 'confirm').and.returnValue(false);

    // Act
    component.deletePet('p1');

    // Assert
    expect(svcSpy.delete).not.toHaveBeenCalled();
  });
});
