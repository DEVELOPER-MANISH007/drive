const mongoose = require('mongoose');




const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [30, 'Name must be at most 30 characters long'],
    },
    email: {
        type: String,
        required: true,
        trim: true,

        minlength: [10, 'Email must be at least 10 characters long'],

    },
    password: {
        type: String,
        required: true, 
        trim: true, 
        minlength: [8, 'Password must be at least 8 characters long'],
    },

    }

);

module.exports = mongoose.model('User', userSchema)