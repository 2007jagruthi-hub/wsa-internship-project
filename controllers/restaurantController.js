const Restaurant = require('../models/restaurantModel');

// Fetch all restaurants from the database collection
exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json({
            status: 'success',
            count: restaurants.length,
            data: restaurants
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Fetch a single restaurant along with its complete nested menu details
exports.getRestaurantMenu = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ status: 'fail', message: 'Restaurant not found' });
        }
        res.status(200).json({
            status: 'success',
            data: {
                menu: restaurant.menu
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};