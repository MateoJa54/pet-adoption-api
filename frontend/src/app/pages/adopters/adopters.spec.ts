import { TestBed } from '@angular/core/testing';
import { AdoptersComponent } from './adopters';
import { AdoptersService } from '../../services/adopters';
import { of, throwError } from 'rxjs';

describe('AdoptersComponent', () => {
  let component: AdoptersComponent;

  const svcSpy = jasmine.createSpyObj<AdoptersService>('AdoptersService', ['getAll', 'create', 'update', 'delete']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdoptersComponent],
      providers: [{ provide: AdoptersService, useValue: svcSpy }],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdoptersComponent);
    component = fixture.componentInstance;

    svcSpy.getAll.calls.reset();
    svcSpy.create.calls.reset();
    svcSpy.update.calls.reset();
    svcSpy.delete.calls.reset();
  });

  it('ngOnInit -> loadAdopters() -> llena adopters y loading false', () => {
    // Arrange
    const data = [{ _id: '1', fullName: 'A' }];
    svcSpy.getAll.and.returnValue(of(data));

    // Act
    component.ngOnInit();

    // Assert
    expect(svcSpy.getAll).toHaveBeenCalled();
    expect(component.adopters).toEqual(data);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('loadAdopters() error -> setea error y loading false', () => {
    // Arrange
    svcSpy.getAll.and.returnValue(throwError(() => ({ error: { message: 'boom' } })));

    // Act
    component.loadAdopters();

    // Assert
    expect(component.error).toBe('boom');
    expect(component.loading).toBeFalse();
  });

  it('toggleForm() -> abre/cierra y al cerrar resetea form', () => {
    // Arrange
    component.showForm = false;
    component.formData.fullName = 'X';
    component.editingId = '123';

    // Act (abrir)
    component.toggleForm();

    // Assert
    expect(component.showForm).toBeTrue();

    // Act (cerrar)
    component.toggleForm();

    // Assert (reseteo)
    expect(component.showForm).toBeFalse();
    expect(component.editingId).toBeNull();
    expect(component.formData.fullName).toBe('');
  });

  it('editAdopter() -> setea editingId, copia formData y abre form', () => {
    // Arrange
    const adopter = { _id: '1', fullName: 'Mateo', nationalId: '123', phone: '099', email: 'x@mail.com' };

    // Act
    component.editAdopter(adopter);

    // Assert
    expect(component.editingId).toBe('1');
    expect(component.formData.fullName).toBe('Mateo');
    expect(component.showForm).toBeTrue();
  });

  it('saveAdopter() create (sin editingId) -> llama create, recarga y cierra form', () => {
  // Arrange
  svcSpy.create.and.returnValue(of({ _id: '1' } as any));
  svcSpy.getAll.and.returnValue(of([])); // para loadAdopters()

  component.showForm = true;
  component.editingId = null;

  const payload = { fullName: 'A', nationalId: 'N', phone: '', email: 'a@mail.com' };
  component.formData = { ...payload }; // copia

  spyOn(component, 'loadAdopters').and.callThrough();
  spyOn(component, 'toggleForm').and.callThrough();

  // Act
  component.saveAdopter();

  // Assert
  expect(svcSpy.create).toHaveBeenCalledWith(payload); 
  expect(component.loadAdopters).toHaveBeenCalled();
  expect(component.toggleForm).toHaveBeenCalled();
});


  it('saveAdopter() update (con editingId) -> llama update, recarga y cierra form', () => {
    // Arrange
    component.editingId = '1';
    component.showForm = true;

    svcSpy.update.and.returnValue(of({ _id: '1' } as any));
    svcSpy.getAll.and.returnValue(of([]));

    spyOn(component, 'loadAdopters').and.callThrough();
    spyOn(component, 'toggleForm').and.callThrough();

    // Act
    component.saveAdopter();

    // Assert
    expect(svcSpy.update).toHaveBeenCalledWith('1', component.formData);
    expect(component.loadAdopters).toHaveBeenCalled();
    expect(component.toggleForm).toHaveBeenCalled();
  });

  it('deleteAdopter() confirm=false -> NO llama delete', () => {
    // Arrange
    spyOn(window, 'confirm').and.returnValue(false);

    // Act
    component.deleteAdopter('1');

    // Assert
    expect(svcSpy.delete).not.toHaveBeenCalled();
  });

  it('deleteAdopter() confirm=true -> llama delete y recarga', () => {
    // Arrange
    spyOn(window, 'confirm').and.returnValue(true);
    svcSpy.delete.and.returnValue(of({} as any));
    svcSpy.getAll.and.returnValue(of([]));
    spyOn(component, 'loadAdopters').and.callThrough();

    // Act
    component.deleteAdopter('1');

    // Assert
    expect(svcSpy.delete).toHaveBeenCalledWith('1');
    expect(component.loadAdopters).toHaveBeenCalled();
  });
});
