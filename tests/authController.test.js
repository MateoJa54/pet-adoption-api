const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const { mockRes } = require('./helpers/httpMocks');

describe('authController', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret';
    jest.restoreAllMocks();
  });

  test('AAA register: si usuario ya existe -> 400', async () => {
    // Arrange
    const req = { body: { username: 'mateo', password: '123' } };
    const res = mockRes();
    jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'u1', username: 'mateo' });

    // Act
    await authController.register(req, res);

    // Assert
    expect(User.findOne).toHaveBeenCalledWith({ username: 'mateo' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  test('AAA register: crea usuario -> 201', async () => {
    // Arrange
    const req = { body: { username: 'nuevo', password: '123' } };
    const res = mockRes();

    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('HASHED');

    const saveMock = jest.fn().mockResolvedValue(true);
    jest.spyOn(User.prototype, 'save').mockImplementation(saveMock);

    // Act
    await authController.register(req, res);

    // Assert
    expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User created' });
  });

  test('AAA login: credenciales inválidas -> 401', async () => {
    // Arrange
    const req = { body: { username: 'x', password: 'y' } };
    const res = mockRes();

    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    // Act
    await authController.login(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  test('AAA login: credenciales válidas -> retorna token', async () => {
    // Arrange
    const req = { body: { username: 'mateo', password: '123' } };
    const res = mockRes();

    jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'u1', username: 'mateo', password: 'HASHED' });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwt, 'sign').mockReturnValue('TOKEN');

    // Act
    await authController.login(req, res);

    // Assert
    expect(jwt.sign).toHaveBeenCalledWith({ userId: 'u1' }, 'test_secret', { expiresIn: '1h' });
    expect(res.json).toHaveBeenCalledWith({ token: 'TOKEN' });
  });
});
