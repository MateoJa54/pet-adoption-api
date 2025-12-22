const r = require('express').Router(), a = require('../middleware/authMiddleware'), c = require('../controllers/adopterController');
r.use(a);
r.get('/', c.getAll);
r.post('/', c.create);
r.put('/:id', c.update);
r.delete('/:id', c.delete);
module.exports = r;
