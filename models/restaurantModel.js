const mongoose = require('mongoose');

// Define the individual Food Item Schema structure
const foodItemSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please provide the food item name'] 
    },
    price: { 
        type: Number, 
        required: [true, 'Please provide the food item price'] 
    },
    description: String,
    stock: { 
        type: Number, 
        default: 10 
    },
    images: [{ 
        public_id: String, 
        url: String 
    }]
});

// Define the Category Menu Schema structure
const menuSchema = new mongoose.Schema({
    category: { 
        type: String, 
        required: [true, 'Please specify the menu category (e.g., Starters, Main Course)'] 
    },
    items: [foodItemSchema] // Embeds the food items directly into the category array
});

// Define the main Restaurant Schema structure
const restaurantSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please provide the restaurant name'],
        trim: true 
    },
    address: { 
        type: String, 
        required: [true, 'Please provide the restaurant address'] 
    },
    ratings: { 
        type: Number, 
        default: 0 
    },
    numOfReviews: { 
        type: Number, 
        default: 0 
    },
    images: [{ 
        public_id: String, 
        url: String 
    }],
    menu: [menuSchema] // Multi-level nested relationship array
});

module.exports = mongoose.model('Restaurant', restaurantSchema);