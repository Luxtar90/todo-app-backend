const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/dbConnect');
const passport = require('passport');
const session = require('express-session');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Crear instancia de la aplicación
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de la sesión
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Inicializar Passport y la sesión de Passport
require('./auth/passportConfig');
app.use(passport.initialize());
app.use(passport.session());

// Rutas de tareas
app.use('/tasks', taskRoutes);

// Rutas de autenticación
app.use('/auth', authRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
