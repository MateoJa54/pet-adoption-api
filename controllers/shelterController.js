const Shelter = require('../models/Shelter');

exports.getAll = async (_, res) => res.json(await Shelter.find());

// Crea un refugio
exports.create = async (req, res) => res.status(201).json(await new Shelter(req.body).save());

exports.update = async (req, res) =>
  res.json(await Shelter.findByIdAndUpdate(req.params.id, req.body, { new: true }));

exports.delete = async (req, res) => {
  await Shelter.findByIdAndDelete(req.params.id);
  res.json({ message: 'Shelter deleted' });
};
