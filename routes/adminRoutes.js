const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const { verifyAdmin } = require('../middleWare/auth');

// Only allow access to admins
router.get('/dashboard', verifyAdmin, adminCtrl.dashboard);
router.post('/add-swimming', verifyAdmin, adminCtrl.addActivity);

router.get('/pool-bookings', verifyAdmin, adminCtrl.viewBookings);
router.post('/update-booking/:id', verifyAdmin, adminCtrl.updateBookingStatus);

router.get('/edit-activity/:id', verifyAdmin, adminCtrl.showEditActivity);
router.post('/edit-activity/:id', verifyAdmin, adminCtrl.updateActivity);

router.get('/view-swimming', verifyAdmin, adminCtrl.viewSwimming);
router.post('/accept-booking/:id', verifyAdmin, adminCtrl.acceptBooking);

// Add missing delete activity route
router.post('/delete-activity/:id', verifyAdmin, adminCtrl.deleteActivity);

module.exports = router;