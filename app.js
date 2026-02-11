const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/adopters', require('./routes/adopters'));
app.use('/api/shelters', require('./routes/shelters'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/adoption-requests', require('./routes/adoptionRequests'));

module.exports = app;
