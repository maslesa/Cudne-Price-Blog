const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    loginCode: {
        type: String,
        default: null,
    },
    loginCodeExpires: {
        type: Date
    }
});

module.exports = mongoose.model('User', UserSchema);