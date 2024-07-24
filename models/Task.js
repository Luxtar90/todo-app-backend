// models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String, 
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    start: {
        type: Date,
        required: false,
    },
    end: {
        type: Date,
        required: false,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: '#1abc9c', // Añadir campo de color con un valor por defecto
    },
    completionPercentage: {
        type: Number,
        default: 0, // Añadir campo de completionPercentage
    },
    previousCompletionPercentage: {
        type: Number,
        default: 0, // Añadir campo para recordar el porcentaje anterior
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', TaskSchema);
