const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const { mockRes, mockNext } = require('./helpers/httpMocks');

describe('authMiddleware', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret';
    jest.restoreAllMocks();
  });

  test('AAA: sin token -> 401 Token required', () => {
    // Arrange
    const req = { headers: {} };
    const res = mockRes();
    const next = mockNext();

    // Act
    authMiddleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token required' });
    expect(next).not.toHaveBeenCalled();
  });

  test('AAA: token inválido -> 401 Invalid token', () => {
    // Arrange
    const req = { headers: { authorization: 'Bearer badtoken' } };
    const res = mockRes();
    const next = mockNext();
    jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('bad'); });

    // Act
    authMiddleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  test('AAA: token válido -> set req.userId y next()', () => {
    // Arrange
    const req = { headers: { authorization: 'Bearer goodtoken' } };
    const res = mockRes();
    const next = mockNext();
    jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'abc123' });

    // Act
    authMiddleware(req, res, next);

    // Assert
    expect(req.userId).toBe('abc123');
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
