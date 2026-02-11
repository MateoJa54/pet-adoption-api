const Pet = require('../models/Pet');
const controller = require('../controllers/petController');
const { mockRes } = require('./helpers/httpMocks');

describe('petController', () => {
  beforeEach(() => jest.restoreAllMocks());

  test('AAA getAll: retorna lista de pets', async () => {
    // Arrange
    const res = mockRes();
    const data = [{ name: 'Luna' }, { name: 'Max' }];
    jest.spyOn(Pet, 'find').mockResolvedValue(data);

    // Act
    await controller.getAll({}, res);

    // Assert
    expect(Pet.find).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(data);
  });

  test('AAA create: crea pet y retorna 201 con el pet creado', async () => {
    // Arrange
    const req = {
      body: {
        shelterId: 'sh1',
        name: 'Luna',
        species: 'cat',
        breed: 'mixed',
        ageYears: 2,
        sex: 'F',
        status: 'AVAILABLE',
        intakeDate: new Date().toISOString(),
      },
    };
    const res = mockRes();

    const created = { _id: 'p1', ...req.body };
    const saveMock = jest.fn().mockResolvedValue(created);
    jest.spyOn(Pet.prototype, 'save').mockImplementation(saveMock);

    // Act
    await controller.create(req, res);

    // Assert
    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  test('AAA update: actualiza pet por id y retorna el actualizado', async () => {
    // Arrange
    const req = { params: { id: 'p1' }, body: { status: 'ADOPTED' } };
    const res = mockRes();

    const updated = { _id: 'p1', name: 'Luna', status: 'ADOPTED' };
    jest.spyOn(Pet, 'findByIdAndUpdate').mockResolvedValue(updated);

    // Act
    await controller.update(req, res);

    // Assert
    expect(Pet.findByIdAndUpdate).toHaveBeenCalledWith('p1', req.body, { new: true });
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test('AAA delete: elimina pet por id y retorna mensaje', async () => {
    // Arrange
    const req = { params: { id: 'p1' } };
    const res = mockRes();

    jest.spyOn(Pet, 'findByIdAndDelete').mockResolvedValue(true);

    // Act
    await controller.delete(req, res);

    // Assert
    expect(Pet.findByIdAndDelete).toHaveBeenCalledWith('p1');
    expect(res.json).toHaveBeenCalledWith({ message: 'Pet deleted' });
  });
});
