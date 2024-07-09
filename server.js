const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/dbConnect');
const passport = require('passport');
const session = require('express-session');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config(); // Cargar variables de entorno

require('./auth/passportConfig'); // Configurar Passport

connectDB(); // Conectar a la base de datos

const app = express();
app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Rutas de tareas
app.use('/tasks', taskRoutes);

// Rutas de autenticación
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
