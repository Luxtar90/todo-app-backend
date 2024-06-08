const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./database');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de tareas
app.use('/tasks', taskRoutes);

// Rutas de autenticación
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
