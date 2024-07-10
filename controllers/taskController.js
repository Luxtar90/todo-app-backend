const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        console.error("Error al obtener tareas:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, description, start, end, color } = req.body; // Añadir color aquí
        const newTask = new Task({
            user: req.user.id,
            title,
            description,
            start: new Date(start),
            end: new Date(end),
            color // Añadir color aquí
        });
        const task = await newTask.save();
        res.json(task);
    } catch (error) {
        console.error("Error al crear tarea:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const taskId = req.params.id.trim();
        const { title, description, start, end, color } = req.body; // Añadir color aquí
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.title = title;
        task.description = description;
        task.start = new Date(start);
        task.end = new Date(end);
        task.color = color; // Añadir color aquí
        await task.save();
        res.json(task);
    } catch (error) {
        console.error("Error al actualizar tarea:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id.trim();
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

exports.updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.completed = completed;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.toggleTaskCompletion = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.completed = !task.completed;
        await task.save();
        res.status(200).json({ message: 'Task status updated', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
