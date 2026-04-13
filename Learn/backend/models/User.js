const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true,
},
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
        type: String,
        enum: ['author', 'admin'],
        default: 'user',
    },
    
},
{ timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;