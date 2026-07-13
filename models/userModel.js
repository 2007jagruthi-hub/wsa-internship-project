const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please tell us your name!'] 
    },
    email: { 
        type: String, 
        required: [true, 'Please provide your email'], 
        unique: true, 
        lowercase: true, 
        validate: [validator.isEmail, 'Please provide a valid email'] 
    },
    password: { 
        type: String, 
        required: [true, 'Please provide a password'], 
        minlength: 8, 
        select: false 
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on .create() and .save()!
            validator: function(el) { return el === this.password; },
            message: 'Passwords are not the same!'
        }
    },
    phoneNumber: String,
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    avatar: { 
        public_id: String, 
        url: String 
    }
});

// Middleware to hash the password before saving it to the database
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // Do not persist passwordConfirm to database
    next();
});

// Helper instance method to verify password matches during login
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);