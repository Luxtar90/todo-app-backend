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
        const { title, description, start, end, color, completionPercentage } = req.body;
        const newTask = new Task({
            user: req.user.id,
            title,
            description,
            start: start ? new Date(start) : undefined,
            end: end ? new Date(end) : undefined,
            color,
            completionPercentage
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
        const { title, description, start, end, color, completionPercentage } = req.body;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.title = title;
        task.description = description;
        task.start = start ? new Date(start) : task.start;
        task.end = end ? new Date(end) : task.end;
        task.color = color;
        task.completionPercentage = completionPercentage;
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
    const { completed, completionPercentage } = req.body;
    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.completed = completed;
        task.completionPercentage = completionPercentage;
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
        if (task.completed) {
            // Restaurar el porcentaje anterior si se desmarca como completada
            task.completionPercentage = task.previousCompletionPercentage;
        } else {
            // Guardar el porcentaje actual y marcar como completada
            task.previousCompletionPercentage = task.completionPercentage;
            task.completionPercentage = 100;
        }
        task.completed = !task.completed;
        await task.save();
        res.status(200).json({ message: 'Task status updated', task });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
