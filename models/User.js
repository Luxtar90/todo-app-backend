const mongoose = require('mongoose'); // Asegúrate de importar mongoose
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { 
        type: String, 
        required: function() {
            return !this.googleId && !this.facebookId;
        }
    },
    googleId: { type: String, unique: true, sparse: true }, 
    facebookId: { type: String, unique: true, sparse: true },
    resetToken: String,
    resetTokenExpiration: Date,
});

// Middleware para encriptar la contraseña antes de guardar
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
