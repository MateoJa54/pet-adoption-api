const mongoose = require('mongoose');

// Modelo de usuario para login/registro (igual al tuyo)
module.exports = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String
}));
