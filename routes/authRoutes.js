const express = require('express');
const { register, login, resetPasswordRequest, resetPassword, updatePassword } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password-request', resetPasswordRequest);
router.post('/reset-password', resetPassword);
router.post('/update-password', updatePassword);

module.exports = router;
