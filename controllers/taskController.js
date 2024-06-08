const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error("Error al obtener tareas:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createTask = async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const task = await newTask.save();
        res.json(task);
    } catch (error) {
        console.error("Error al crear tarea:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const taskId = req.params.id.trim(); // Eliminar cualquier espacio o salto de línea
        const task = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error("Error al actualizar tarea:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id.trim(); // Eliminar cualquier espacio o salto de línea
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error("Error al eliminar tarea:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
