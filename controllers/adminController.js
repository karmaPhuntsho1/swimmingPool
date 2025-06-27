const db = require('../config/db');
const userModel = require('../models/userModel');
const bookingModel = require('../models/bookingModel');
const activityModel = require('../models/activityModel');

module.exports = {
  dashboard: async (req, res) => {
    const activities = await db.any('SELECT * FROM activities ORDER BY id DESC');
    res.render('admin/adminDashboard', { user: req.user, activities });
  },

  addActivity: async (req, res) => {
    const { name, coach, price } = req.body;
    await db.none(
      'INSERT INTO activities (name, coach, price) VALUES ($1, $2, $3)',
      [name, coach, price]
    );
    res.redirect('/admin/dashboard');
  },

  approveBooking: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // expected values: 'approved' or 'rejected'

    await bookingModel.approveBooking(id, status);
    res.redirect('/admin/bookings');
  },

  viewBookings: async (req, res) => {
    const bookings = await bookingModel.getAll(); // Fetch all bookings
    res.render('admin/pool-bookings', { bookings });
  },

  updateBookingStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    await bookingModel.updateStatus(id, status);
    res.redirect('/admin/pool-bookings');
  },

  showEditActivity: async (req, res) => {
    const activity = await activityModel.getById(req.params.id);
    res.render('admin/editActivity', { activity });
  },

  updateActivity: async (req, res) => {
    const { name, coach, price } = req.body;
    await activityModel.update(req.params.id, { name, coach, price });
    res.redirect('/admin/dashboard');
  },

  viewSwimming: async (req, res) => {
      try {
        const activities = await activityModel.getAll();
        res.render('admin/view-swimming', { user: req.user, activities });
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    },

  acceptBooking: async (req, res) => {
    const bookingId = req.params.id;
    await bookingModel.updateStatus(bookingId, 'approved');
    res.redirect('/admin/pool-bookings');
  },

  deleteActivity: async (req, res) => {
    try {
      const { id } = req.params;
      await activityModel.delete(id);
      res.redirect('/admin/view-swimming');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }

};

  