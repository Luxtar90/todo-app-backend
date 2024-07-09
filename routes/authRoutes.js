const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {
  register,
  login,
  resetPasswordRequest,
  resetPassword,
  updatePassword,
  updateProfile,
  getProfile
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password-request', resetPasswordRequest);
router.post('/reset-password', resetPassword);
router.post('/update-password', updatePassword);
router.put('/profile', authMiddleware, updateProfile);
router.get('/profile', authMiddleware, getProfile);

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Generated JWT:', token);  // Log del token generado
      res.redirect(`https://todo-app-backend-xi-pearl.vercel.app/auth/google/callback?token=${token}`);
    } catch (error) {
      console.error('Error generating JWT:', error);
      res.redirect('/login');
    }
  }
);

module.exports = router;
