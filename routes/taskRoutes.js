const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, updateTaskStatus, toggleTaskCompletion } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getTasks);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);
router.patch('/:id/status', authMiddleware, updateTaskStatus);
router.put('/:id/toggle-completion', authMiddleware, toggleTaskCompletion);

module.exports = router;
