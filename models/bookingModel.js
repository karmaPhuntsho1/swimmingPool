const db = require('../config/db');

module.exports = {
  // Create a new booking with default status
  create(booking) {
    const { user_id, date, time } = booking;
    const status = 'pending';
    return db.none(
      'INSERT INTO bookings (user_id, date, time, status) VALUES ($1, $2, $3, $4)',
      [user_id, date, time, status]
    );
  },

  // Get bookings for a specific user
  getUserBookings(userId) {
    return db.any(
      `SELECT id, date, time, status
       FROM bookings
       WHERE user_id = $1
       ORDER BY date, time`,
      [userId]
    );
  },

  // Get bookings made by other users
  getOtherBookings(userId) {
    return db.any(
      `SELECT b.id, b.date, b.time, b.status, u.email
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       WHERE b.user_id != $1
       ORDER BY b.date, b.time`,
      [userId]
    );
  },

  // Admin: update booking status
  updateStatus(id, status) {
    return db.none(
      'UPDATE bookings SET status = $1 WHERE id = $2',
      [status, id]
    );
  },

  // Admin: get all bookings
  getAll() {
    return db.any(`
      SELECT bookings.*, users.email
      FROM bookings
      JOIN users ON bookings.user_id = users.id
      ORDER BY bookings.date DESC
    `);
  },

  // Get booking by ID
  getById(id) {
    return db.one('SELECT * FROM bookings WHERE id = $1', [id]);
  },

  // Approve and reject helpers
  approve(id) {
    return this.updateStatus(id, 'approved');
  },

  reject(id) {
    return this.updateStatus(id, 'rejected');
  }
};