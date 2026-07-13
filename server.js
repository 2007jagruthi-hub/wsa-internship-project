const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Link the configuration settings safely from the config folder
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

// Establish connection with the MongoDB Database
const DB = process.env.DB_URI || 'mongodb://localhost:27017/foodgenie';
mongoose.connect(DB)
    .then(() => console.log('MongoDB connection successful!'))
    .catch(err => console.error('MongoDB Connection Error: ', err));

// Start the server listener on the designated port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Application server is actively running on port ${port}...`);
});