const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTP, verifyOTP } = require('../services/otpService');
const { savePendingSignup, getPendingSignup, removePendingSignup } = require('../services/pendingSignupService');

// Signup controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    // Save signup details in memory
    savePendingSignup(email, { name, email, password });
    // Generate and send OTP
    const otp = generateOTP(email);
    await sendOTP(email, otp);
    res.status(200).json({ message: 'OTP sent to email. Please verify to complete signup.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Complete signup after OTP verification
exports.verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });
    if (!verifyOTP(email, otp)) return res.status(400).json({ message: 'Invalid or expired OTP' });
    const pending = getPendingSignup(email);
    if (!pending) return res.status(400).json({ message: 'No pending signup for this email' });
    const hashedPassword = await bcrypt.hash(pending.password, 10);
    const admin = await User.create({
      admin_id: uuidv4(),
      username: pending.name,
      email: pending.email,
      password: hashedPassword,
    });
    removePendingSignup(email);
    const token = jwt.sign({ id: admin.admin_id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ message: 'Signup successful', token, admin: { admin_id: admin.admin_id, name: admin.username, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Profile delete
exports.deleteProfile = async (req, res) => {
  try {
    const admin = await User.findOne({ where: { admin_id: req.user.id } });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    await admin.destroy();
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Logout (for JWT, client just deletes token)
exports.logout = (req, res) => {
  res.json({ message: 'Logged out' });
};
