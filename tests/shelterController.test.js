const Shelter = require('../models/Shelter');
const controller = require('../controllers/shelterController');
const { mockRes } = require('./helpers/httpMocks');

describe('shelterController', () => {
  beforeEach(() => jest.restoreAllMocks());

  test('AAA getAll: retorna lista de shelters', async () => {
    // Arrange
    const res = mockRes();
    const data = [{ name: 'Shelter 1' }, { name: 'Shelter 2' }];
    jest.spyOn(Shelter, 'find').mockResolvedValue(data);

    // Act
    await controller.getAll({}, res);

    // Assert
    expect(Shelter.find).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(data);
  });

  test('AAA create: crea shelter y retorna 201 con el shelter creado', async () => {
    // Arrange
    const req = { body: { name: 'Refugio A', address: 'Quito', phone: '099', email: 'a@mail.com' } };
    const res = mockRes();

    const created = { _id: 's1', ...req.body };
    const saveMock = jest.fn().mockResolvedValue(created);
    jest.spyOn(Shelter.prototype, 'save').mockImplementation(saveMock);

    // Act
    await controller.create(req, res);

    // Assert
    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
  });

  test('AAA update: actualiza shelter por id y retorna el actualizado', async () => {
    // Arrange
    const req = { params: { id: 's1' }, body: { phone: '0987654321' } };
    const res = mockRes();

    const updated = { _id: 's1', name: 'Refugio A', phone: '0987654321' };
    jest.spyOn(Shelter, 'findByIdAndUpdate').mockResolvedValue(updated);

    // Act
    await controller.update(req, res);

    // Assert
    expect(Shelter.findByIdAndUpdate).toHaveBeenCalledWith('s1', req.body, { new: true });
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test('AAA delete: elimina shelter por id y retorna mensaje', async () => {
    // Arrange
    const req = { params: { id: 's1' } };
    const res = mockRes();

    jest.spyOn(Shelter, 'findByIdAndDelete').mockResolvedValue(true);

    // Act
    await controller.delete(req, res);

    // Assert
    expect(Shelter.findByIdAndDelete).toHaveBeenCalledWith('s1');
    expect(res.json).toHaveBeenCalledWith({ message: 'Shelter deleted' });
  });
});
