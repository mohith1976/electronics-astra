const { generateOTP, verifyOTP, sendOTP } = require('../services/otpService');

// Request OTP for signup
exports.requestOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  const otp = generateOTP(email);
  try {
    await sendOTP(email, otp);
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

// Verify OTP
exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });
  if (verifyOTP(email, otp)) {
    res.json({ message: 'OTP verified' });
  } else {
    res.status(400).json({ message: 'Invalid or expired OTP' });
  }
};
