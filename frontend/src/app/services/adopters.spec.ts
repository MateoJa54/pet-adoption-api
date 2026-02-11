import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AdoptersComponent } from '../pages/adopters/adopters';
import { AdoptersService } from '../services/adopters';

describe('AdoptersComponent', () => {
  let fixture: ComponentFixture<AdoptersComponent>;
  let component: AdoptersComponent;

  let svcSpy: jasmine.SpyObj<AdoptersService>;

  beforeEach(async () => {
    svcSpy = jasmine.createSpyObj<AdoptersService>('AdoptersService', [
      'getAll',
      'create',
      'update',
      'delete',
    ]);

    // default mocks
    svcSpy.getAll.and.returnValue(of([]));
    svcSpy.create.and.returnValue(of({ _id: '1' } as any));
    svcSpy.update.and.returnValue(of({ _id: '1' } as any));
    svcSpy.delete.and.returnValue(of({ message: 'Adopter deleted' } as any));

    await TestBed.configureTestingModule({
      imports: [AdoptersComponent], // standalone component
      providers: [{ provide: AdoptersService, useValue: svcSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdoptersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('AAA: ngOnInit() -> llama loadAdopters()', () => {
    // Arrange
    spyOn(component, 'loadAdopters').and.callThrough();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.loadAdopters).toHaveBeenCalled();
  });

  it('AAA: loadAdopters() success -> set adopters y loading false', () => {
    // Arrange
    const mock = [{ _id: '1', fullName: 'A' }];
    svcSpy.getAll.and.returnValue(of(mock));

    // Act
    component.loadAdopters();

    // Assert
    expect(svcSpy.getAll).toHaveBeenCalled();
    expect(component.adopters).toEqual(mock as any);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('AAA: loadAdopters() error -> set error y loading false', () => {
    // Arrange
    svcSpy.getAll.and.returnValue(throwError(() => ({ error: { message: 'Boom' } })));

    // Act
    component.loadAdopters();

    // Assert
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Boom');
  });

  it('AAA: toggleForm() abre/cierra y al cerrar resetea formData', () => {
    // Arrange
    component.showForm = false;
    component.editingId = 'X';
    component.formData = { fullName: 'A', nationalId: 'N', phone: '1', email: 'a@mail.com' };

    // Act 1: abrir
    component.toggleForm();

    // Assert 1
    expect(component.showForm).toBeTrue();

    // Act 2: cerrar
    component.toggleForm();

    // Assert 2 (reseteado)
    expect(component.showForm).toBeFalse();
    expect(component.editingId).toBeNull();
    expect(component.formData).toEqual({ fullName: '', nationalId: '', phone: '', email: '' });
  });

  it('AAA: saveAdopter() create (sin editingId) -> llama create, recarga y cierra form', () => {
    // Arrange
    svcSpy.create.and.returnValue(of({ _id: '1' } as any));
    svcSpy.getAll.and.returnValue(of([])); // para loadAdopters()

    component.showForm = true;
    component.editingId = null;

    const payload = { fullName: 'A', nationalId: 'N', phone: '', email: 'a@mail.com' };
    component.formData = { ...payload };

    spyOn(component, 'loadAdopters').and.callThrough();
    spyOn(component, 'toggleForm').and.callThrough();

    // Act
    component.saveAdopter();

    // Assert
    expect(svcSpy.create).toHaveBeenCalledWith(payload);
    expect(component.loadAdopters).toHaveBeenCalled();
    expect(component.toggleForm).toHaveBeenCalled();
  });

  it('AAA: saveAdopter() update (con editingId) -> llama update, recarga y cierra form', () => {
    // Arrange
    svcSpy.update.and.returnValue(of({ _id: '1' } as any));
    svcSpy.getAll.and.returnValue(of([]));

    component.showForm = true;
    component.editingId = '1';

    const payload = { fullName: 'Mateo', nationalId: 'X', phone: '099', email: 'x@mail.com' };
    component.formData = { ...payload };

    spyOn(component, 'loadAdopters').and.callThrough();
    spyOn(component, 'toggleForm').and.callThrough();

    // Act
    component.saveAdopter();

    // Assert
    expect(svcSpy.update).toHaveBeenCalledWith('1', payload);
    expect(component.loadAdopters).toHaveBeenCalled();
    expect(component.toggleForm).toHaveBeenCalled();
  });

  it('AAA: editAdopter() -> set editingId, formData y abre form', () => {
    // Arrange
    const adopter = { _id: '9', fullName: 'A', nationalId: 'N', phone: '', email: 'a@mail.com' };

    // Act
    component.editAdopter(adopter);

    // Assert
    expect(component.editingId).toBe('9');
    expect(component.formData).toEqual(adopter as any);
    expect(component.showForm).toBeTrue();
  });

  it('AAA: deleteAdopter() confirm true -> llama delete y recarga', () => {
    // Arrange
    spyOn(window, 'confirm').and.returnValue(true);
    svcSpy.delete.and.returnValue(of({ message: 'ok' } as any));
    spyOn(component, 'loadAdopters').and.callThrough();

    // Act
    component.deleteAdopter('1');

    // Assert
    expect(svcSpy.delete).toHaveBeenCalledWith('1');
    expect(component.loadAdopters).toHaveBeenCalled();
  });

  it('AAA: deleteAdopter() confirm false -> NO llama delete', () => {
    // Arrange
    spyOn(window, 'confirm').and.returnValue(false);

    // Act
    component.deleteAdopter('1');

    // Assert
    expect(svcSpy.delete).not.toHaveBeenCalled();
  });
});
