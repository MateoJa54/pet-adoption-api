const AdoptionRequest = require('../models/AdoptionRequest');
const Pet = require('../models/Pet');

exports.getAll = async (_, res) => res.json(await AdoptionRequest.find());
//hol
exports.create = async (req, res) => {
  const { adopterId, petId } = req.body;

  // LÍNEA CLAVE PARA REGRESIÓN: valida campos requeridos
  if (!adopterId || !petId) {return res.status(400).json({ message: 'Required fields' });}

  // Regla mínima: si la mascota no existe, 404
  const pet = await Pet.findById(petId);
  if (!pet) {return res.status(404).json({ message: 'Pet not found' });}

  // Regla de negocio útil para pruebas: no permitir solicitar si ya fue adoptada
  if (pet.status === 'ADOPTED') {
    return res.status(400).json({ message: 'Pet already adopted' });
  }

  // Opcional: si estaba disponible, pasa a proceso
  if (pet.status === 'AVAILABLE') {
    pet.status = 'IN_PROCESS';
    await pet.save();
  }

  res.status(201).json(await new AdoptionRequest(req.body).save());
};

exports.update = async (req, res) => {
  // Permite cambiar estado, comentarios, etc.
  res.json(await AdoptionRequest.findByIdAndUpdate(req.params.id, req.body, { new: true }));
};

exports.delete = async (req, res) => {
  await AdoptionRequest.findByIdAndDelete(req.params.id);
  res.json({ message: 'Adoption request deleted' });
};
