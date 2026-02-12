const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Extrae el token del header Authorization: Bearer <token>
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {return res.status(401).json({ error: 'Token required' });}

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
