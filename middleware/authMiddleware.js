const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded JWT:', decoded);
        req.user = await User.findById(decoded.id).select('-password');
        console.log('Authenticated user:', req.user);
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
