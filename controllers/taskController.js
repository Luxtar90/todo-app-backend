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
        const newTask = new Task({
            user: req.user.id,
            ...req.body
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

const User = require('../models/User'); // Asegúrate de importar tu modelo de usuario

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password'); // Excluye la contraseña
        res.json({ user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};