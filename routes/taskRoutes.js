const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, updateTaskStatus } = require('../controllers/taskController'); // Asegúrate de importar updateTaskStatus
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getTasks);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);
router.patch('/:id/status', authMiddleware, updateTaskStatus); // Ruta para actualizar el estado de la tarea

module.exports = router;
