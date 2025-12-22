const mongoose = require('mongoose');

// Adoptante: quien solicita adoptar una mascota
module.exports = mongoose.model('Adopter', new mongoose.Schema({
  fullName: String,
  nationalId: String,
  phone: String,
  email: String,
  address: String
}));
