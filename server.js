const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Habilita CORS y parseo de JSON
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Rutas (mismo estilo que tu proyecto)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/adopters', require('./routes/adopters'));
app.use('/api/shelters', require('./routes/shelters'));
app.use('/api/pets', require('./routes/pets'));
app.use('/api/adoption-requests', require('./routes/adoptionRequests'));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
