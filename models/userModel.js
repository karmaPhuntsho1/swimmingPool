const db = require('../config/db');

const userModel = {
  // Create a new user
  async create({ email, password, is_verified = false, verification_token = null, role = 'user' }) {
    return db.one(
      `INSERT INTO users (email, password, is_verified, verification_token, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [email, password, is_verified, verification_token, role]
    );
  },

  // Find a user by email
  async findByEmail(email) {
    return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
  },

  // Find a user by ID
  async findById(id) {
    return db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
  },

  // Update verification status and token
  async updateVerificationStatus(id, is_verified, verification_token = null) {
    return db.none(
      'UPDATE users SET is_verified = $1, verification_token = $2 WHERE id = $3',
      [is_verified, verification_token, id]
    );
  },

  // Set a new password (for reset)
  async updatePassword(id, newPassword) {
    return db.none('UPDATE users SET password = $1 WHERE id = $2', [newPassword, id]);
  }
};

module.exports = userModel;
