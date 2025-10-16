const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');

// Signup (step 1: send OTP)
router.post('/signup', adminController.signup);
// Signup (step 2: verify OTP and create user)
router.post('/signup/verify', adminController.verifySignupOTP);
// Login
router.post('/login', adminController.login);
// Profile (protected)
router.get('/profile', auth, adminController.getProfile);
router.put('/profile', auth, adminController.editProfile);
router.delete('/profile', auth, adminController.deleteProfile);
// Logout
router.post('/logout', auth, adminController.logout);

module.exports = router;
