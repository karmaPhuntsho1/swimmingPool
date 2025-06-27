const userModel = require('../models/userModel');
const bookingModel = require('../models/bookingModel');
const activityModel = require('../models/activityModel');

module.exports = {
  userDashboard: async (req, res) => {
  try {
    const userId = req.user.id;  // assuming you set req.user from JWT or session
    const user = req.user;       // grab user info from request or fetch from DB if needed

    const activities = await activityModel.getAll();
    const uninterested = await activityModel.getUserUninterestedActivities(userId);
    const filteredActivities = activities.filter(act => !uninterested.includes(act.id));

    res.render('user/userDashboard', { 
      user,           // <-- pass user here
      activities: filteredActivities
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
},

  markInterested: async (req, res) => {
    try {
      res.json({ message: 'Thank you for participating!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to mark as interested' });
    }
  },

  markNotInterested: async (req, res) => {
    try {
      const userId = req.user.id;
      const activityId = parseInt(req.params.id);

      await activityModel.addUserUninterestedActivity(userId, activityId);
      res.json({ message: 'Activity removed from your dashboard.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to mark as not interested' });
    }
  },

  showBookingForm: (req, res) => {
    res.render('user/booking');
  },

submitBooking: async (req, res) => {
  try {
    const { date, time } = req.body;
    const user_id = req.user.id; // from auth middleware

    await bookingModel.create({ user_id, date, time });

    res.redirect('/user/myBooking');
  } catch (error) {
    console.error('Booking submission error:', error);
    res.status(500).send('Failed to submit booking');
  }
},


viewBookings: async (req, res) => {
  const userId = req.user.id;

  const myBookings = await bookingModel.getUserBookings(userId);
  const others = await bookingModel.getOtherBookings(userId);

  res.render('user/myBooking', { myBookings, others });
}
};