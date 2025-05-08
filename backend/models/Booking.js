const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    serviceType: {
        type: String,
        enum: ['Regular Service', 'Oil Change', 'Repair', 'Inspection', 'Other'],
        required: true
    },
    serviceCenter: {
        type: String,
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    bookingId: {
        type: String,
        unique: true,
        required: true
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Generate unique booking ID before saving
bookingSchema.pre('save', async function(next) {
    if (this.isNew) {
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.bookingId = `BK${year}${month}-${random}`;
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
