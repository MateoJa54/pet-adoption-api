const AdoptionRequest = require('../models/AdoptionRequest');
const Pet = require('../models/Pet');
const controller = require('../controllers/adoptionRequestController');
const { mockRes } = require('./helpers/httpMocks');

describe('adoptionRequestController.create', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('AAA: faltan adopterId/petId -> 400 Required fields', async () => {
    // Arrange
    const req = { body: { adopterId: '', petId: '' } };
    const res = mockRes();

    // Act
    await controller.create(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Required fields' });
  });

  test('AAA: pet no existe -> 404 Pet not found', async () => {
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

  test('AAA: pet ya ADOPTED -> 400 Pet already adopted', async () => {
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

  test('AAA: pet AVAILABLE -> cambia a IN_PROCESS y crea request 201', async () => {
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
});
