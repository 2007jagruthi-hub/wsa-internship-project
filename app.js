const express = require('express');
const app = express();

const authRouter = require('./routes/authRoutes');
const restaurantRouter = require('./routes/restaurantRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const cors = require('cors'); // 1. Imported CORS here

// Middleware to parse incoming JSON request bodies
app.use(express.json());
app.use(cors()); // 2. Enabled CORS right here

// Mount API Resource Endpoints
app.use('/api/v1/users', authRouter);
app.use('/api/v1/restaurants', restaurantRouter);
app.use('/api/v1/payment', paymentRouter);

// Base health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

module.exports = app;