const Adopter = require('../models/Adopter');

exports.getAll = async (_, res) => res.json(await Adopter.find());

// Crea un adoptante
exports.create = async (req, res) => res.status(201).json(await new Adopter(req.body).save());

exports.update = async (req, res) =>
  res.json(await Adopter.findByIdAndUpdate(req.params.id, req.body, { new: true }));

exports.delete = async (req, res) => {
  await Adopter.findByIdAndDelete(req.params.id);
  res.json({ message: 'Adopter deleted' });
};
