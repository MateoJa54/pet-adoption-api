const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password } = req.body;

  // Verifica si el usuario ya existe
  const existing = await User.findOne({ username });
  if (existing) {return res.status(400).json({ message: 'User already exists' });}

  // Encripta la contraseña y crea el usuario
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();

  res.status(201).json({ message: 'User created' });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Valida credenciales
  const user = await User.findOne({ username });
  if (!user || !await bcrypt.compare(password, user.password))
    {return res.status(401).json({ message: 'Invalid credentials' });}

  // Genera JWT (igual a tu proyecto)
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};
