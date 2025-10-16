const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');

router.post('/request', otpController.requestOTP);
router.post('/verify', otpController.verifyOTP);

module.exports = router;
