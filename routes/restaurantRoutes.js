const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const router = express.Router();

router.route('/').get(restaurantController.getRestaurants);
router.route('/:id/menus').get(restaurantController.getRestaurantMenu);

module.exports = router;