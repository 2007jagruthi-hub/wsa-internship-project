const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '90d' });
};

// 1. Sign Up Handler
exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            phoneNumber: req.body.phoneNumber
        });

        const token = signToken(newUser._id);
        res.status(201).json({ status: 'success', token, data: { user: newUser } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 2. Login Handler
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and password!' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }

        const token = signToken(user._id);
        res.status(200).json({ status: 'success', token });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// 3. Protect Middleware to guard private routes
exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return res.status(401).json({ message: 'You are not logged in!' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) return res.status(401).json({ message: 'The user no longer exists.' });

        req.user = currentUser;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};