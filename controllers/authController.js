const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    const { firstName, lastName, phone, username, email, password } = req.body;
    if (!firstName || !lastName || !phone || !username || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    try {
        const user = new User({ firstName, lastName, phone, username, email, password });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'El usuario ya existe' });
        } else {
            res.status(500).json({ message: 'Error del servidor', error: error.message });
        }
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        console.log('Password match:', isMatch); // Log para depuración
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resetPasswordRequest = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email es requerido' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const token = crypto.randomBytes(20).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hora
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Restablecimiento de Contraseña',
            text: `Has recibido este mensaje porque tú (u otra persona) ha solicitado restablecer la contraseña de tu cuenta.\n\n` +
                  `Por favor, haz clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso:\n\n` +
                  `${process.env.FRONTEND_URL}/reset/${token}\n\n` +
                  `Si no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.\n`,
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('Error al enviar el correo:', err);
                return res.status(500).json({ message: 'Error al enviar el correo' });
            }
            res.status(200).json({ message: 'Token de restablecimiento de contraseña enviado' });
        });
    } catch (error) {
        console.error('Error durante la solicitud de restablecimiento de contraseña:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token y nueva contraseña son requeridos' });
    }
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }
        console.log('Usuario encontrado:', user);
        
        user.password = newPassword; // Asignar la nueva contraseña en texto plano
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        
        console.log('Contraseña actualizada:', user);
        res.status(200).json({ message: 'Contraseña restablecida correctamente' });
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.updatePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Email, contraseña antigua y nueva contraseña son requeridos' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(oldPassword))) {
            return res.status(401).json({ message: 'Email o contraseña inválidos' });
        }
        user.password = newPassword; // Asignar la nueva contraseña en texto plano
        await user.save();
        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.updateProfile = async (req, res) => {
    const { firstName, lastName, phone, username, email } = req.body;
    if (!firstName || !lastName || !phone || !username || !email) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;
        user.username = username || user.username;
        user.email = email || user.email;
        await user.save();
        res.status(200).json({ message: 'Perfil actualizado correctamente', user });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
};
