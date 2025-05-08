const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, admin } = require('../middleware/auth');

// Get all bookings (admin)
router.get('/all', protect, admin, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('vehicle');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

// Get user's bookings
router.get('/', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('vehicle');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

// Create booking
router.post('/', protect, async (req, res) => {
    try {
        const booking = await Booking.create({
            ...req.body,
            user: req.user._id
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
});

// Update booking status (admin)
router.patch('/:id/status', protect, admin, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = req.body.status;
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking status', error: error.message });
    }
});

// Cancel booking
router.patch('/:id/cancel', protect, async (req, res) => {
    try {
        const booking = await Booking.findOne({ 
            _id: req.params.id,
            user: req.user._id,
            status: 'Pending'
        });
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or cannot be cancelled' });
        }

        booking.status = 'Cancelled';
        await booking.save();
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling booking', error: error.message });
    }
});

module.exports = router;
