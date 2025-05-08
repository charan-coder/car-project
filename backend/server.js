require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle-service-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'API is running 🚀' });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/vehicles', require('./routes/vehicle.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
