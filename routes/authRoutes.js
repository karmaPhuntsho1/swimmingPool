const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.get('/signup', auth.showSignup);
router.post('/signup', auth.signup);

// Removed verification route since email verification is disabled
// router.get('/verify/:token', auth.verify);

router.get('/login', auth.showLogin);
router.post('/login', auth.login);
router.get('/logout', auth.logout);

router.get('/forgot-password', auth.showForgot);
router.post('/forgot-password', auth.sendReset);

router.get('/reset/:token', auth.showReset);
router.post('/reset/:token', auth.resetPassword);

module.exports = router;