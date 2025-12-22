const mongoose = require('mongoose');

// Refugio: alberga mascotas
module.exports = mongoose.model('Shelter', new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  email: String
}));
