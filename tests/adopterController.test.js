const Adopter = require('../models/Adopter');
const controller = require('../controllers/adopterController');
const { mockRes } = require('./helpers/httpMocks');

describe('adopterController', () => {
  beforeEach(() => jest.restoreAllMocks());

  test('AAA getAll: retorna lista de adoptantes', async () => {
    // Arrange
    const res = mockRes();
    jest.spyOn(Adopter, 'find').mockResolvedValue([{ fullName: 'A' }]);

    // Act
    await controller.getAll({}, res);

    // Assert
    expect(Adopter.find).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith([{ fullName: 'A' }]);
  });
});
