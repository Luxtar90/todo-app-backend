const express = require('express');
const { getTasks, createTask, updateTask, deleteTask,updateTaskStatus, toggleTaskCompletion } = require('../controllers/taskController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getTasks);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);
router.patch('/:id/status', authMiddleware, updateTaskStatus);
router.put('/:id/toggle-completion', authMiddleware, toggleTaskCompletion); // Ruta para alternar estado de tarea

module.exports = router;
