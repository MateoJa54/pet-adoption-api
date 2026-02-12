const Adopter = require('../models/Adopter');
const controller = require('../controllers/adopterController');
const { mockRes } = require('./helpers/httpMocks');

describe('adopterController', () => {
  beforeEach(() => jest.restoreAllMocks());

  test('getAll -> responde con la lista de adoptantes', async () => {
    const res = mockRes();
    jest.spyOn(Adopter, 'find').mockResolvedValue([{ _id: '1' }]);

    await controller.getAll({}, res);

    expect(Adopter.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ _id: '1' }]);
  });

  test('create -> guarda adoptante y responde 201', async () => {
    const req = { body: { fullName: 'Mateo' } };
    const res = mockRes();

    const saveMock = jest.fn().mockResolvedValue({ _id: '1', fullName: 'Mateo' });
    jest.spyOn(Adopter.prototype, 'save').mockImplementation(saveMock);

    await controller.create(req, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ _id: '1', fullName: 'Mateo' });
  });

  test('update -> actualiza adoptante y responde con el actualizado', async () => {
    const req = { params: { id: '1' }, body: { phone: '099' } };
    const res = mockRes();

    jest.spyOn(Adopter, 'findByIdAndUpdate').mockResolvedValue({ _id: '1', phone: '099' });

    await controller.update(req, res);

    expect(Adopter.findByIdAndUpdate).toHaveBeenCalledWith('1', { phone: '099' }, { new: true });
    expect(res.json).toHaveBeenCalledWith({ _id: '1', phone: '099' });
  });

  test('delete -> elimina adoptante y responde con mensaje', async () => {
    const req = { params: { id: '1' } };
    const res = mockRes();

    jest.spyOn(Adopter, 'findByIdAndDelete').mockResolvedValue(true);

    await controller.delete(req, res);

    expect(Adopter.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith({ message: 'Adopter deleted' });
  });
});
