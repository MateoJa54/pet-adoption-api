const mongoose = require('mongoose');

// Solicitud: vincula exactamente un adoptante y una mascota
module.exports = mongoose.model('AdoptionRequest', new mongoose.Schema({
  adopterId: String,
  petId: String,
  requestDate: { type: Date, default: Date.now },
  status: { type: String, default: 'PENDING' }, // PENDING | APPROVED | REJECTED
  comments: String
}));
