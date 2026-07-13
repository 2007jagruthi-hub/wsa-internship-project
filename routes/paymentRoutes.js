const express = require('express');
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');
const router = express.Router();

// Route to handle order checkouts (protected so only logged-in users can purchase)
router.post('/process', authController.protect, paymentController.processPayment);

module.exports = router;