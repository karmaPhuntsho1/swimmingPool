const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log('User authentication - User role:', payload.role, 'User email:', payload.email);
      req.user = payload;
      next();
    } catch {
      return res.redirect('/login');
    }
  },

  verifyAdmin(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Admin verification - User role:', decoded.role, 'User email:', decoded.email);
      if (decoded.role !== 'admin') {
        console.log('Access denied - User is not admin');
        return res.status(403).send('Access denied');
      }
      console.log('Admin access granted');
      next();
    } catch {
      res.clearCookie('token');
      return res.redirect('/login');
    }
  },
};