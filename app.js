const express = require('express');
const cors = require('cors');

const app = express();

// Configurar CORS para permitir frontend en desarrollo y producción
const allowedOrigins = [
  'http://localhost:4200',
  'http://localhost:3000',
  'https://petadoptionsystem-820a5.web.app',
  'https://petadoptionsystem-820a5.firebaseapp.com',
  process.env.FRONTEND_URL // URL de tu frontend en Firebase
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como Postman, mobile apps, etc.)
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1 || !process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/adopters', require('./routes/adopters'));
app.use('/api/shelters', require('./routes/shelters'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/adoption-requests', require('./routes/adoptionRequests'));

module.exports = app;
