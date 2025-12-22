const Pet = require('../models/Pet');

exports.getAll = async (_, res) => res.json(await Pet.find());

// Crea una mascota (incluye shelterId en el body)
exports.create = async (req, res) => res.status(201).json(await new Pet(req.body).save());

exports.update = async (req, res) =>
  res.json(await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true }));

exports.delete = async (req, res) => {
  await Pet.findByIdAndDelete(req.params.id);
  res.json({ message: 'Pet deleted' });
};
