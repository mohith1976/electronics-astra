const crypto = require('crypto');
const nodemailer = require('nodemailer');

// In-memory OTP store (for demo; use Redis or DB for production)
const otpStore = {};

function generateOTP(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };
  return otp;
}

function verifyOTP(email, otp) {
  const record = otpStore[email];
  if (!record) return false;
  if (record.otp !== otp) return false;
  if (Date.now() > record.expires) return false;
  delete otpStore[email];
  return true;
}

async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  });
}

module.exports = { generateOTP, verifyOTP, sendOTP };
