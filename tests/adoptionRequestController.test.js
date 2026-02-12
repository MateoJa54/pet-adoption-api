const AdoptionRequest = require('../models/AdoptionRequest');
const Pet = require('../models/Pet');
const controller = require('../controllers/adoptionRequestController');
const { mockRes } = require('./helpers/httpMocks');

describe('adoptionRequestController.create', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('faltan adopterId/petId -> 400 Required fields', async () => {
    // Arrange
    const req = { body: { adopterId: '', petId: '' } };
    const res = mockRes();

    // Act
    await controller.create(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Required fields' });
  });

  test('pet no existe -> 404 Pet not found', async () => {
    // Arrange
    const req = { body: { adopterId: 'a1', petId: 'p1' } };
    const res = mockRes();

    jest.spyOn(Pet, 'findById').mockResolvedValue(null);

    // Act
    await controller.create(req, res);

    // Assert
    expect(Pet.findById).toHaveBeenCalledWith('p1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Pet not found' });
  });

  test('pet ya ADOPTED -> 400 Pet already adopted', async () => {
    // Arrange
    const req = { body: { adopterId: 'a1', petId: 'p1' } };
    const res = mockRes();

    jest.spyOn(Pet, 'findById').mockResolvedValue({ _id: 'p1', status: 'ADOPTED' });

    // Act
    await controller.create(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Pet already adopted' });
  });

  test('pet AVAILABLE -> cambia a IN_PROCESS y crea request 201', async () => {
    // Arrange
    const req = { body: { adopterId: 'a1', petId: 'p1', comments: 'ok' } };
    const res = mockRes();

    const pet = { _id: 'p1', status: 'AVAILABLE', save: jest.fn().mockResolvedValue(true) };
    jest.spyOn(Pet, 'findById').mockResolvedValue(pet);

    const arSave = jest.fn().mockResolvedValue({ _id: 'r1', ...req.body });
    jest.spyOn(AdoptionRequest.prototype, 'save').mockImplementation(arSave);

    // Act
    await controller.create(req, res);

    // Assert
    expect(pet.status).toBe('IN_PROCESS');
    expect(pet.save).toHaveBeenCalledTimes(1);
    expect(arSave).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('create: pet IN_PROCESS -> NO cambia status, NO llama pet.save(), crea request 201', async () => {
  // Arrange
  const req = { body: { adopterId: 'a1', petId: 'p1', comments: 'ok' } };
  const res = mockRes();

  const pet = { _id: 'p1', status: 'IN_PROCESS', save: jest.fn() };
  jest.spyOn(Pet, 'findById').mockResolvedValue(pet);

  const arSave = jest.fn().mockResolvedValue({ _id: 'r1', ...req.body });
  jest.spyOn(AdoptionRequest.prototype, 'save').mockImplementation(arSave);

  // Act
  await controller.create(req, res);

  // Assert
  expect(Pet.findById).toHaveBeenCalledWith('p1');
  expect(pet.status).toBe('IN_PROCESS');         
  expect(pet.save).not.toHaveBeenCalled();         
  expect(arSave).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ _id: 'r1', ...req.body });
});
test('update: actualiza solicitud por id y devuelve el documento actualizado', async () => {
  // Arrange
  const req = { params: { id: 'r1' }, body: { status: 'APPROVED', comments: 'ok' } };
  const res = mockRes();

  jest
    .spyOn(AdoptionRequest, 'findByIdAndUpdate')
    .mockResolvedValue({ _id: 'r1', status: 'APPROVED', comments: 'ok' });

  // Act
  await controller.update(req, res);

  // Assert
  expect(AdoptionRequest.findByIdAndUpdate).toHaveBeenCalledWith(
    'r1',
    { status: 'APPROVED', comments: 'ok' },
    { new: true }
  );
  expect(res.json).toHaveBeenCalledWith({ _id: 'r1', status: 'APPROVED', comments: 'ok' });
});


});
describe('adoptionRequestController.getAll', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('devuelve todas las solicitudes (find) como JSON', async () => {
    // Arrange
    const req = {};
    const res = mockRes();

    const data = [{ _id: 'r1' }, { _id: 'r2' }];
    jest.spyOn(AdoptionRequest, 'find').mockResolvedValue(data);

    // Act
    await controller.getAll(req, res);

    // Assert
    expect(AdoptionRequest.find).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(data);
  });
});

describe('adoptionRequestController.delete', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('elimina una solicitud por id y devuelve mensaje', async () => {
    // Arrange
    const req = { params: { id: 'r1' } };
    const res = mockRes();

    jest.spyOn(AdoptionRequest, 'findByIdAndDelete').mockResolvedValue(true);

    // Act
    await controller.delete(req, res);

    // Assert
    expect(AdoptionRequest.findByIdAndDelete).toHaveBeenCalledWith('r1');
    expect(res.json).toHaveBeenCalledWith({ message: 'Adoption request deleted' });
  });
});
