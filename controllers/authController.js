const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Nodemailer transporter can be kept for password reset
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

module.exports = {
  showSignup: (req, res) => res.render('pages/signup'),

  signup: async (req, res) => {
    const { email, password } = req.body;
    const exists = await userModel.findByEmail(email);
    if (exists) return res.send('User already exists');

    const hashed = await bcrypt.hash(password, 10);

    // Create user with is_verified always true, remove token
    const user = await userModel.create({
      email,
      password: hashed,
      is_verified: true, // Automatically verified
      verification_token: null
    });

    // Skip sending verification email
    res.redirect('/login?message=Signup successful! Please login.');
  },

  // Remove verify endpoint completely, or keep it if you want, but no longer needed:
  verify: (req, res) => res.send('Verification disabled.'),

  showLogin: (req, res) => {
    const message = req.query.message || '';
    res.render('pages/login', { message });
  },

login: async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt - Email:', email);
  console.log('Admin email from env:', process.env.ADMIN_EMAIL);

  // Admin login
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    console.log('Admin login successful');
    const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    return res.redirect('/admin/dashboard');
  }

  // User login
  console.log('Attempting user login');
  const user = await userModel.findByEmail(email);
  if (!user) return res.send('Invalid login.');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send('Invalid login.');

  console.log('User login successful');
  const token = jwt.sign({ id: user.id, email: user.email, role: 'user' }, process.env.JWT_SECRET);
  res.cookie('token', token, { httpOnly: true });
  
  // Redirect to user dashboard
  res.redirect('/user/userDashboard');
},

  logout: (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
  },

  showForgot: (req, res) => res.render('pages/forgot-password'),

  sendReset: async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user) return res.send('If that email exists, a reset link was sent.');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    const url = `http://localhost:${process.env.PORT}/reset/${token}`;
    await transporter.sendMail({
      to: email,
      subject: 'Reset Password',
      html: `Reset here: <a href="${url}">${url}</a>`
    });
    res.send('If that email exists, a reset link was sent.');
  },

  showReset: (req, res) => res.render('pages/reset-password', { token: req.params.token }),

  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      const hashed = await bcrypt.hash(password, 10);
      await userModel.updatePassword(id, hashed);
      res.send('Password reset! You can now <a href="/login">login</a>.');
    } catch (err) {
      res.send('Invalid or expired link.');
    }
  }
};