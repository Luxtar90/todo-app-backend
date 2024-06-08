const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { firstName, lastName, phone, username, email, password } = req.body;

    try {
        const user = new User({ firstName, lastName, phone, username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'User already exists' });
        } else {
            res.status(500).json({ message: 'Server error' });
        }
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resetPasswordRequest = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hora
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `http://localhost:3000/reset/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.status(200).json({ message: 'Password reset token sent' });
        });
    } catch (error) {
        console.error('Error during password reset request:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updatePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(oldPassword))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Encriptar la nueva contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
