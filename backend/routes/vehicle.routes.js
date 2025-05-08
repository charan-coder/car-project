const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { protect } = require('../middleware/auth');

// Get all vehicles for the logged-in user
router.get('/', protect, async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ user: req.user._id });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
    }
});

// Add new vehicle
router.post('/', protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.create({
            ...req.body,
            user: req.user._id
        });
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Error creating vehicle', error: error.message });
    }
});

// Update vehicle
router.put('/:id', protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ _id: req.params.id, user: req.user._id });
        
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        Object.assign(vehicle, req.body);
        await vehicle.save();
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Error updating vehicle', error: error.message });
    }
});

// Delete vehicle
router.delete('/:id', protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
    }
});

module.exports = router;
