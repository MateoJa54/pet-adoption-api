const mongoose = require('mongoose');

// Mascota: pertenece a un refugio (shelterId)
module.exports = mongoose.model('Pet', new mongoose.Schema({
  shelterId: String, // Mantengo String para que sea igual de simple a tu Enrollment
  name: String,
  species: String,      // dog, cat, etc.
  breed: String,
  ageYears: Number,
  sex: String,          // M/F u otro esquema
  status: { type: String, default: "AVAILABLE" }, // AVAILABLE | IN_PROCESS | ADOPTED
  intakeDate: Date
}));
